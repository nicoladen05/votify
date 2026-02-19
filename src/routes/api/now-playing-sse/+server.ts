import {
	type NowPlaying,
	registerClient,
	unregisterClient
} from '$lib/server/spotify/queueWatcher';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => {
	const encoder = new TextEncoder();
	let closed = false;

	const stream = new ReadableStream({
		start(controller) {
			const sendUpdate = (data: NowPlaying) => {
				if (!closed) {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
				}
			};

			registerClient(sendUpdate);

			// Abort-Signal
			request.signal.addEventListener('abort', () => {
				if (!closed) {
					unregisterClient(sendUpdate);
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
