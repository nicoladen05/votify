import { getAccessToken } from '$lib/server/spotify';
import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { songQueueItem } from '../db/schema';

let started = false;

export type NowPlaying = {
	state: 'playing' | 'paused' | 'stopped';
	song?: {
		trackId: string;
		title: string;
		artist: string;
		coverImage: string;
		duration: number;
		progress: number; // 0-100
	};
};

let currentState: NowPlaying = { state: 'stopped' };
let clients: ((data: NowPlaying) => void)[] = [];

// Worker starten
let pollInterval: NodeJS.Timeout;

export function startSpotifyWorker() {
	if (started) return;
	started = true;

	let lastTrackId = '';
	let currentPollingMs = 5000;

	async function poll() {
		try {
			const accessToken = await getAccessToken();
			const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing?market=DE', {
				headers: { Authorization: `Bearer ${accessToken}` }
			});

			if (!res.ok || res.status === 204) {
				currentState = { state: 'stopped' };
				broadcast();
				return;
			}

			const data = await res.json();
			console.log(data.item.id);
			const remainingMs = data.item.duration_ms - data.progress_ms;
			console.log(remainingMs);

			const nowPlaying: NowPlaying = {
				state: data.is_playing ? 'playing' : 'paused',
				song: {
					trackId: data.item.id,
					title: data.item.name,
					artist: data.item.artists[0].name,
					coverImage: data.item.album.images[0].url,
					duration: data.item.duration_ms,
					progress: (data.progress_ms / data.item.duration_ms) * 100
				}
			};

			// Trackwechsel erkennen
			if (lastTrackId !== nowPlaying.song!.trackId) {
				lastTrackId = nowPlaying.song!.trackId;
				currentPollingMs = 5000; // Reset Polling
			}

			// kurz vor Ende der Wiedergabe auf 1 Sekunde Polling umstellen
			if (remainingMs <= 7000) currentPollingMs = 1000;

			// Wenn unter 1 Sekunde Rest, nächsten Song pushen
			if (remainingMs <= 2000) {
				const nextSong = await db
					.select()
					.from(songQueueItem)
					.orderBy(sql`upvotes - downvotes DESC`)
					.limit(1);

				if (nextSong[0]) {
					await fetch('https://api.spotify.com/v1/me/player/play', {
						method: 'PUT',
						headers: {
							Authorization: `Bearer ${accessToken}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							uris: [nextSong[0].song_uri]
						})
					});
					await db.delete(songQueueItem).where(eq(songQueueItem.song_id, nextSong[0].song_id));
				}
			}

			currentState = nowPlaying;
			broadcast();
		} catch (err) {
			console.error('Spotify Worker Fehler:', err);
		} finally {
			// Nächstes Polling planen
			clearTimeout(pollInterval);
			pollInterval = setTimeout(poll, currentPollingMs);
		}
	}

	// initial starten
	poll();
}

// SSE: Client registrieren
export function registerClient(cb: (data: NowPlaying) => void) {
	clients.push(cb);
	cb(currentState); // sofort aktueller Stand
}

// SSE: Client entfernen
export function unregisterClient(cb: (data: NowPlaying) => void) {
	clients = clients.filter((c) => c !== cb);
}

// Broadcast an alle Clients
function broadcast() {
	clients.forEach((cb) => cb(currentState));
}
