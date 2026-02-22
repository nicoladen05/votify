import { getAccessTokenByTokenId } from '$lib/server/spotify';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { songQueueItem, votes } from '../db/schema';

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

type ClientCallback = (data: NowPlaying) => void;

type RoomWatcherState = {
	currentState: NowPlaying;
	clients: Set<ClientCallback>;
	lastTrackId: string;
	nextTrackAdded: boolean;
	tokenId: number | null;
	pollInterval?: NodeJS.Timeout;
	isPolling: boolean;
};

// Runtime-only watcher state per room. This allows multiple rooms to poll Spotify in parallel.
const roomWatchers = new Map<number, RoomWatcherState>();
const roomClosedMap = new Map<number, boolean>();

export function ensureRoomWorker({ roomId, tokenId }: { roomId: number; tokenId: number }) {
	// Reuse existing room worker if present; always refresh token binding for that room.
	const state = getOrCreateRoomState(roomId);
	state.tokenId = tokenId;

	// Workers are lazy-started when the first SSE subscriber appears.
	if (!state.pollInterval && !state.isPolling) {
		pollRoom(roomId);
	}
}

export function registerClient(roomId: number, cb: ClientCallback) {
	const state = getOrCreateRoomState(roomId);
	state.clients.add(cb);
	cb(state.currentState);
}

export function unregisterClient(roomId: number, cb: ClientCallback) {
	const state = roomWatchers.get(roomId);
	if (!state) return;

	state.clients.delete(cb);
}

export function getRoomClosed(roomId: number) {
	return roomClosedMap.get(roomId) ?? false;
}

function getOrCreateRoomState(roomId: number): RoomWatcherState {
	let state = roomWatchers.get(roomId);

	if (!state) {
		// Isolated state prevents cross-room playback leaks.
		state = {
			currentState: { state: 'stopped' },
			clients: new Set<ClientCallback>(),
			lastTrackId: '',
			nextTrackAdded: false,
			tokenId: null,
			isPolling: false
		};
		roomWatchers.set(roomId, state);
	}

	return state;
}

async function pollRoom(roomId: number) {
	const state = roomWatchers.get(roomId);
	if (!state || state.isPolling) return;

	state.isPolling = true;

	try {
		// If no token is linked yet, we keep reporting stopped and continue polling.
		if (!state.tokenId) {
			state.currentState = { state: 'stopped' };
			roomClosedMap.set(roomId, false);
			broadcast(roomId);
			return;
		}

		// Token refresh + lookup is done against the room's token row.
		const accessToken = await getAccessTokenByTokenId(state.tokenId);
		if (!accessToken) {
			state.currentState = { state: 'stopped' };
			roomClosedMap.set(roomId, false);
			broadcast(roomId);
			return;
		}

		// This endpoint reflects the active player for the account behind this room token.
		const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing?market=DE', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		if (!res.ok || res.status === 204) {
			state.currentState = { state: 'stopped' };
			roomClosedMap.set(roomId, false);
			broadcast(roomId);
			return;
		}

		const data = await res.json();
		if (!data?.item?.id || !data?.item?.duration_ms) {
			state.currentState = { state: 'stopped' };
			roomClosedMap.set(roomId, false);
			broadcast(roomId);
			return;
		}

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

		if (state.lastTrackId !== nowPlaying.song!.trackId) {
			state.lastTrackId = nowPlaying.song!.trackId;
		}

		// Voting close window is tracked per room and surfaced through /api/queue.
		roomClosedMap.set(roomId, remainingMs < 15000);

		if (state.nextTrackAdded && remainingMs > 12000) {
			state.nextTrackAdded = false;
		}

		if (!state.nextTrackAdded && remainingMs <= 12000) {
			state.nextTrackAdded = true;

			// Rank candidate tracks by (upvotes - downvotes), but only inside this room.
			const score = sql<number>`
          COUNT(*) FILTER (WHERE ${votes.is_upvote})
          - COUNT(*) FILTER (WHERE NOT ${votes.is_upvote})
        `.as('score');

			const nextSong = await db
				.select({
					song_id: songQueueItem.song_id,
					song_uri: songQueueItem.song_uri,
					score
				})
				.from(songQueueItem)
				.leftJoin(
					votes,
					and(eq(songQueueItem.room_id, votes.room_id), eq(songQueueItem.song_id, votes.song_id))
				)
				.where(eq(songQueueItem.room_id, roomId))
				.groupBy(songQueueItem.room_id, songQueueItem.song_id, songQueueItem.song_uri)
				.orderBy(desc(score));

			if (nextSong[0]) {
				// Keep current track and append top-ranked room track as next.
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

				// Remove only the consumed queue entry in this room.
				await db
					.delete(songQueueItem)
					.where(
						and(eq(songQueueItem.room_id, roomId), eq(songQueueItem.song_id, nextSong[0].song_id))
					);
			}
		}

		state.currentState = nowPlaying;
		broadcast(roomId);
	} catch (err) {
		console.error(`Spotify worker error for room ${roomId}:`, err);
	} finally {
		state.isPolling = false;
		clearTimeout(state.pollInterval);
		state.pollInterval = setTimeout(() => {
			void pollRoom(roomId);
		}, 5000);
	}
}

function broadcast(roomId: number) {
	const state = roomWatchers.get(roomId);
	if (!state) return;

	// Fan-out only to subscribers of this room.
	for (const cb of state.clients) {
		cb(state.currentState);
	}
}
