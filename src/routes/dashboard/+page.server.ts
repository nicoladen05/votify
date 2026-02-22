import { db } from '$lib/server/db';
import { room, spotifyTokens as spotifyTokensTable } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const rooms = await db
		.select({ id: room.id, name: room.name })
		.from(room)
		.where(eq(room.userId, locals.user!.id));

	const spotifyTokens = await db
		.select()
		.from(spotifyTokensTable)
		.where(eq(spotifyTokensTable.userId, locals.user!.id));

	const hasConnectedSpotify = spotifyTokens.length > 0;

	return { rooms, hasConnectedSpotify };
};

export const actions: Actions = {
	createRoom: async ({ request, locals }) => {
		const formData = await request.formData();
		const roomName = formData.get('room-name') as string;
		const userId = locals.user!.id;
		const token = await db
			.select({ id: spotifyTokensTable.id })
			.from(spotifyTokensTable)
			.where(eq(spotifyTokensTable.userId, userId))
			.limit(1)
			.then((rows) => rows[0]);

		await db.insert(room).values({ name: roomName, userId, spotifyTokens: token?.id ?? null });
	},

	deleteRoom: async ({ request, locals }) => {
		const formData = await request.formData();
		const roomId = parseInt(formData.get('room-id') as string);

		await db.delete(room).where(and(eq(room.id, roomId), eq(room.userId, locals.user!.id)));
	}
};
