import { db } from '$lib/server/db';
import { songQueueItem, votes } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { and, sql, desc, eq } from 'drizzle-orm';
import { getRoomClosed } from '$lib/server/spotify/queueWatcher';

function getRoomId(url: URL): number | null {
	const roomId = Number.parseInt(
		url.searchParams.get('roomId') ?? url.searchParams.get('roomid') ?? '',
		10
	);
	if (!Number.isInteger(roomId) || roomId <= 0) return null;
	return roomId;
}

export async function POST({ url }: { url: URL }) {
	const roomId = getRoomId(url);
	const uri = url.searchParams.get('uri');
	const id = url.searchParams.get('id');
	const img = url.searchParams.get('img');
	const title = url.searchParams.get('title');
	const artist = url.searchParams.get('artist');

	if (!roomId || !uri || !id || !img || !title || !artist)
		return json({ success: false, message: 'Missing Parameters' });

	await db.insert(songQueueItem).values({
		room_id: roomId,
		song_uri: uri,
		song_id: id,
		img_url: img,
		title: title,
		artist: artist
	});
	return json({ success: true });
}

export async function GET(event?: { url: URL }) {
	const url = event?.url ?? new URL('http://localhost/api/queue');
	const roomId = getRoomId(url);

	if (!roomId) {
		return json({ success: false, message: 'Missing or invalid roomId' }, { status: 400 });
	}

	const score = sql<number>`
  COUNT(*) FILTER (WHERE ${votes.is_upvote})
  - COUNT(*) FILTER (WHERE NOT ${votes.is_upvote})
`.as('score');

	const queueItems = await db
		.select({
			song_id: songQueueItem.song_id,
			song_uri: songQueueItem.song_uri,
			img_url: songQueueItem.img_url,
			title: songQueueItem.title,
			artist: songQueueItem.artist,
			score
		})
		.from(songQueueItem)
		.leftJoin(
			votes,
			and(eq(songQueueItem.room_id, votes.room_id), eq(songQueueItem.song_id, votes.song_id))
		)
		.where(eq(songQueueItem.room_id, roomId))
		.groupBy(
			songQueueItem.room_id,
			songQueueItem.song_id,
			songQueueItem.song_uri,
			songQueueItem.img_url,
			songQueueItem.title,
			songQueueItem.artist
		)
		.orderBy(desc(score));

	return json({ queueItems, isClosed: getRoomClosed(roomId) });
}
