import { db } from '$lib/server/db';
import { songQueueItem } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

let _isClosed = false;

export function _setClosed(bool: boolean) {
	_isClosed = bool;
}

export function _getClosed() {
	return _isClosed;
}

export async function POST({ url }) {
	const uri = url.searchParams.get('uri');
	const id = url.searchParams.get('id');
	const img = url.searchParams.get('img');
	const title = url.searchParams.get('title');
	const artist = url.searchParams.get('artist');

	if (!uri || !id || !img || !title || !artist)
		return json({ success: false, message: 'Missing Parameters' });

	await db.insert(songQueueItem).values({
		song_uri: uri,
		song_id: id,
		img_url: img,
		title: title,
		artist: artist
	});
	return json({ success: true });
}

export async function GET() {
	const queueItems = await db
		.select()
		.from(songQueueItem)
		.orderBy(sql`${songQueueItem.upvotes} - ${songQueueItem.downvotes} DESC`);

	return json({ queueItems, isClosed: _isClosed });
}

export async function PATCH({ url }) {
	const song_id = url.searchParams.get('song_id');
	const type = url.searchParams.get('type');
	const action = url.searchParams.get('action');

	if (_getClosed()) return json({ success: false, message: 'Voting Closed' });

	if (!song_id || !type || !action) return json({ success: false, message: 'Missing Parameters' });

	if (action === 'add' && type === 'upvote') {
		await db
			.update(songQueueItem)
			.set({ upvotes: sql`${songQueueItem.upvotes} + 1` })
			.where(eq(songQueueItem.song_id, song_id));
	} else if (action === 'remove' && type === 'upvote') {
		await db
			.update(songQueueItem)
			.set({ upvotes: sql`${songQueueItem.upvotes} - 1` })
			.where(eq(songQueueItem.song_id, song_id));
	} else if (action === 'add' && type === 'downvote') {
		await db
			.update(songQueueItem)
			.set({ downvotes: sql`${songQueueItem.downvotes} + 1` })
			.where(eq(songQueueItem.song_id, song_id));
	} else if (action === 'remove' && type === 'downvote') {
		await db
			.update(songQueueItem)
			.set({ downvotes: sql`${songQueueItem.downvotes} - 1` })
			.where(eq(songQueueItem.song_id, song_id));
	} else {
		return json({ success: false, message: 'Invalid vote type' });
	}
	return json({ success: true });
}
