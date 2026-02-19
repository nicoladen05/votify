import { getAccessToken } from '$lib/server/spotify';
import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { songQueueItem } from '../db/schema';
import { _setClosed, isClosed } from '../../../routes/api/queue/+server';

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
	let nextTrackAdded = false;

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
			const remainingMs = data.item.duration_ms - data.progress_ms;

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
			}

			_setClosed(remainingMs < 15000);

			if (nextTrackAdded && remainingMs > 12000) nextTrackAdded = false;
			// Wenn unter 1 Sekunde Rest, nächsten Song pushen
			if (!nextTrackAdded && remainingMs <= 12000) {
				nextTrackAdded = true;
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
							uris: [data.item.uri, nextSong[0].song_uri],
							position_ms: data.progress_ms
						})
					});
					console.log(nextSong[0].song_id);
					console.log(nextSong);
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
			pollInterval = setTimeout(poll, 5000);
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
