import { db } from '$lib/server/db';
import { songQueueItem } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

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
	return json(
		await db
			.select()
			.from(songQueueItem)
			.orderBy(sql`${songQueueItem.upvotes} - ${songQueueItem.downvotes} DESC`)
	);
}
