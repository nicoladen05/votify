import { db } from '$lib/server/db';
import { votes } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

function getRoomId(url: URL): number | null {
	const roomId = Number.parseInt(
		url.searchParams.get('roomId') ?? url.searchParams.get('roomid') ?? '',
		10
	);
	if (!Number.isInteger(roomId) || roomId <= 0) return null;
	return roomId;
}

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const data = await request.json();
	const roomId = getRoomId(url);

	const song_id = data.song_id;
	const is_upvote = data.is_upvote;
	const guest_id = cookies.get('guest_id');

	if (!roomId) return json({ success: false, message: 'Missing roomId' });
	if (!song_id) return json({ success: false, message: 'Missing parameters' });
	if (!guest_id) return json({ success: false, message: 'No cookie found' });

	await db.insert(votes).values({
		room_id: roomId,
		song_id: song_id,
		is_upvote: is_upvote,
		guest_cookie: guest_id
	});
	return json({ success: true });
};

export const PATCH: RequestHandler = async ({ request, cookies, url }) => {
	const data = await request.json();
	const roomId = getRoomId(url);
	const song_id = data.song_id;
	const is_upvote = data.is_upvote;
	const guest_id = cookies.get('guest_id');

	if (!roomId) return json({ success: false, message: 'Missing roomId' });
	if (!song_id) return json({ success: false, message: 'Missing parameters' });
	if (!guest_id) return json({ success: false, message: 'No cookie found' });

	await db
		.update(votes)
		.set({ is_upvote: is_upvote })
		.where(
			and(eq(votes.room_id, roomId), eq(votes.song_id, song_id), eq(votes.guest_cookie, guest_id))
		);
	return json({ success: true });
};

export const GET: RequestHandler = async ({ cookies, url }) => {
	const roomId = getRoomId(url);
	const guest_cookie = cookies.get('guest_id');
	if (!roomId) return json({ success: false, message: 'Missing roomId' });
	if (!guest_cookie) return json({ success: false, message: 'No cookie found' });
	const data = await db
		.select()
		.from(votes)
		.where(and(eq(votes.room_id, roomId), eq(votes.guest_cookie, guest_cookie)));
	return json(data);
};

export const DELETE: RequestHandler = async ({ request, cookies, url }) => {
	const data = await request.json();
	const roomId = getRoomId(url);
	const song_id = data.song_id;
	const guest_cookie = cookies.get('guest_id');

	if (!roomId) return json({ success: false, message: 'Missing roomId' });
	if (!song_id) return json({ success: false, message: 'Missing parameters' });
	if (!guest_cookie) return json({ success: false, message: 'No cookie found' });

	await db
		.delete(votes)
		.where(
			and(
				eq(votes.room_id, roomId),
				eq(song_id, votes.song_id),
				eq(votes.guest_cookie, guest_cookie)
			)
		);
	return json({ success: true });
};
