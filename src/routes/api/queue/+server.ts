import { db } from '$lib/server/db';
import { songQueueItem } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export async function POST({ url }) {
	const uri = url.searchParams.get('uri');
	const id = url.searchParams.get('id');

	if (!uri || !id) return json({ success: false, message: 'Missing Parameters' });

	await db.insert(songQueueItem).values({
		song_uri: uri,
		song_id: id
	});
	return json({ success: true });
}
