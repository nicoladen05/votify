import type { RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { room } from './db/schema';

export async function launchRoom(event: RequestEvent) {
	const formData = await event.request.formData();
	const id = parseInt(formData.get('room-id') as string);
	const spotifyid = parseInt(formData.get('spotify-id') as string);
	if (!spotifyid) return;
	await db
		.update(room)
		.set({ state: 'offline' })
		.where(and(eq(room.spotifyTokens, spotifyid), eq(room.state, 'live')));
	await db.update(room).set({ state: 'live' }).where(eq(room.id, id));
}

export async function stopRoom(event: RequestEvent) {
	const formData = await event.request.formData();
	const id = parseInt(formData.get('room-id') as string);

	await db.update(room).set({ state: 'offline' }).where(eq(room.id, id));
}

export async function selectAccount(event: RequestEvent) {
	const formData = await event.request.formData();
	const roomid = parseInt(formData.get('room-id') as string);
	const accountid = parseInt(formData.get('account-id') as string);

	await db
		.update(room)
		.set({ spotifyTokens: accountid, state: 'offline' })
		.where(eq(room.id, roomid));
}
