import { db } from '$lib/server/db';
import { room } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const rooms = await db
		.select({ id: room.id, name: room.name })
		.from(room)
		.where(eq(room.userId, locals.user!.id));

	console.log(rooms);

	return { rooms };
};

export const actions = {
	createRoom: async ({ request, locals }) => {
		const formData = await request.formData();
		const roomName = formData.get('room-name') as string;
		const userId = locals.user!.id;

		await db.insert(room).values({ name: roomName, userId });
	},

	deleteRoom: async ({ request, locals }) => {
		const formData = await request.formData();
		const roomId = parseInt(formData.get('room-id') as string);

		await db.delete(room).where(and(eq(room.id, roomId), eq(room.userId, locals.user!.id)));
	}
};
