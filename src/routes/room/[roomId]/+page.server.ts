import { launchRoom, stopRoom } from '$lib/server/actions';
import { db } from '$lib/server/db';
import { room, room as roomTable, spotifyTokens } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const roomIdParam = parseInt(params.roomId);

	if (!Number.isInteger(roomIdParam) || roomIdParam <= 0) error(404, 'This room does not exist');

	const spotifyAccounts = await db
		.select()
		.from(spotifyTokens)
		.where(eq(spotifyTokens.userId, locals.user!.id));
	const dbrooms = await db.select().from(roomTable).where(eq(roomTable.id, roomIdParam));
	let singleRoom = dbrooms[0];
	let user;

	if (singleRoom.spotifyTokens) {
		user = (
			await db.select().from(spotifyTokens).where(eq(spotifyTokens.id, singleRoom.spotifyTokens))
		)[0];
	} else {
		singleRoom = (
			await db
				.update(room)
				.set({ state: 'missing_credentials' })
				.where(eq(room.id, singleRoom.id))
				.returning()
		)[0];
	}

	if (!singleRoom) {
		return error(404, 'This room does not exist');
	}

	if (locals.user!.id !== singleRoom.userId) {
		return error(403, 'You are not authorized to access this room');
	}

	return {
		room: {
			roomid: roomIdParam,
			name: singleRoom.name,
			status: singleRoom!.state,
			spotifyTokens: singleRoom.spotifyTokens
		},
		user,
		spotifyAccounts
	};
};

export const actions: Actions = {
	logoutSpotify: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('room-id') as string);
		await db.update(room).set({ spotifyTokens: null }).where(eq(room.id, id));
	},

	launchRoom,

	stopRoom
};
