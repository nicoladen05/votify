import { db } from '$lib/server/db';
import { songQueueItem } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

export async function POST({ url }) {
	const song_id = url.searchParams.get('song_id');
	const type = url.searchParams.get('type');
	const action = url.searchParams.get('action');

	console.log('Received vote:', { song_id, type, action });

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
