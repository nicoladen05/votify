import { fail, type RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { room } from './db/schema';

export async function launchRoom(event: RequestEvent) {
	const formData = await event.request.formData();
	const id = parseInt(formData.get('room-id') as string);
	const spotifyid = parseInt(formData.get('spotify-id') as string);
	const userId = event.locals.user?.id;

	if (!spotifyid) return;
	if (!userId) return fail(403);

	await Promise.all([
		(db
			.update(room)
			.set({ state: 'offline' })
			.where(
				and(eq(room.spotifyTokens, spotifyid), eq(room.state, 'live'), eq(room.userId, userId))
			),
		db
			.update(room)
			.set({ state: 'live' })
			.where(and(eq(room.id, id), eq(room.userId, userId))))
	]);
}

export async function stopRoom(event: RequestEvent) {
	const formData = await event.request.formData();
	const id = parseInt(formData.get('room-id') as string);

	const userId = event.locals.user?.id;
	if (!userId) return fail(403);

	await db
		.update(room)
		.set({ state: 'offline' })
		.where(and(eq(room.id, id), eq(room.userId, userId)));
}

export async function selectAccount(event: RequestEvent) {
	const formData = await event.request.formData();
	const roomid = parseInt(formData.get('room-id') as string);
	const accountid = parseInt(formData.get('account-id') as string);

	const userId = event.locals.user?.id;
	if (!userId) return fail(403);

	await db
		.update(room)
		.set({ spotifyTokens: accountid, state: 'offline' })
		.where(and(eq(room.id, roomid), eq(room.userId, userId)));
}
