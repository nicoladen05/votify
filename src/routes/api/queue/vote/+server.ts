import { db } from '$lib/server/db';
import { votes } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function POST({ request, cookies }) {
	const data = await request.json();

	const song_id = data.song_id;
	const is_upvote = data.is_upvote;
	const guest_id = cookies.get('guest_id');

	if (!song_id) return json({ success: false, message: 'Missing parameters' });
	if (!guest_id) return json({ success: false, message: 'No cookie found' });

	await db.insert(votes).values({
		song_id: song_id,
		is_upvote: is_upvote,
		guest_cookie: guest_id
	});
	return json({ success: true });
}

export async function PATCH({ request, cookies }) {
	const data = await request.json();
	const song_id = data.song_id;
	const is_upvote = data.is_upvote;
	const guest_id = cookies.get('guest_id');

	if (!song_id) return json({ success: false, message: 'Missing parameters' });
	if (!guest_id) return json({ success: false, message: 'No cookie found' });

	await db
		.update(votes)
		.set({ is_upvote: is_upvote })
		.where(and(eq(votes.song_id, song_id), eq(votes.guest_cookie, guest_id)));
	return json({ success: true });
}

export async function GET({ cookies }) {
	const guest_cookie = cookies.get('guest_id');
	if (!guest_cookie) return json({ success: false, message: 'No cookie found' });
	const data = await db.select().from(votes).where(eq(votes.guest_cookie, guest_cookie));
	return json(data);
}
