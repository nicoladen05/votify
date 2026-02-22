import {
	type NowPlaying,
	ensureRoomWorker,
	registerClient,
	unregisterClient
} from '$lib/server/spotify/queueWatcher';
import { db } from '$lib/server/db';
import { room } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, url }) => {
	// Accept both roomId and roomid for backward compatibility.
	const roomIdParam = Number.parseInt(
		url.searchParams.get('roomId') ?? url.searchParams.get('roomid') ?? ''
	);

	if (!Number.isInteger(roomIdParam) || roomIdParam <= 0) {
		return new Response('Missing or invalid roomId', { status: 400 });
	}

	// Resolve which Spotify token this room should use.
	const roomData = await db
		.select({ spotifyTokenId: room.spotifyTokens })
		.from(room)
		.where(eq(room.id, roomIdParam))
		.limit(1)
		.then((rows) => rows[0]);

	if (!roomData) {
		return new Response('Room not found', { status: 404 });
	}

	if (!roomData.spotifyTokenId) {
		return new Response('Room has no Spotify token', { status: 409 });
	}

	// Ensure the room-specific worker is alive before subscribing.
	ensureRoomWorker({ roomId: roomIdParam, tokenId: roomData.spotifyTokenId });

	const encoder = new TextEncoder();
	let closed = false;

	const stream = new ReadableStream({
		start(controller) {
			// Push watcher updates as SSE messages.
			const sendUpdate = (data: NowPlaying) => {
				if (!closed) {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
				}
			};

			// Attach this connection to the room channel.
			registerClient(roomIdParam, sendUpdate);

			// On disconnect, detach callback to avoid leaked subscribers.
			request.signal.addEventListener('abort', () => {
				if (!closed) {
					unregisterClient(roomIdParam, sendUpdate);
					controller.close();
					closed = true;
				}
			});
		},
		cancel() {
			closed = true;
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
