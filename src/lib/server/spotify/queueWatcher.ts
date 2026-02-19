import { getAccessToken } from '$lib/server/spotify';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import { songQueueItem } from '../db/schema';

let started = false;
// let interval: NodeJS.Timeout;

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
export function startSpotifyWorker() {
	if (started) return;
	started = true;

	let lastTrackId = '';

	setInterval(async () => {
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

			console.log(data.item.duration_ms - data.progress_ms);
			if (data.item.duration_ms - data.progress_ms < 1000) {
				const nextSong = await db
					.select()
					.from(songQueueItem)
					.orderBy(sql`upvotes - downvotes DESC`)
					.limit(1);
				const res = await fetch('https://api.spotify.com/v1/me/player/play', {
					method: 'PUT',
					headers: { Authorization: `Bearer ${accessToken}` },
					body: JSON.stringify({
						uris: [nextSong[0].song_uri]
					})
				});
			}
			// Trackwechsel erkennen
			if (lastTrackId !== nowPlaying.song!.trackId) {
				lastTrackId = nowPlaying.song!.trackId;
				if (data.item.duration_ms - data.progress_ms < 10000) {
					const nextSong = await db
						.select()
						.from(songQueueItem)
						.orderBy(sql`upvotes - downvotes DESC`)
						.limit(1);
					const res = await fetch('https://api.spotify.com/v1/me/player/play', {
						method: 'PUT',
						headers: { Authorization: `Bearer ${accessToken}` },
						body: JSON.stringify({
							uris: [nextSong[0].song_uri]
						})
					});
					console.log('test-------------------\n\n\ntest---------------------------');
					console.log(res);
				}
			}

			currentState = nowPlaying;
			broadcast();
		} catch (err) {
			console.error('Spotify Worker Fehler:', err);
		}
	}, 5000);
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
