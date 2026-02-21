import { db } from '$lib/server/db';
import { room as roomTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const roomIdParam = parseInt(params.roomId);

	const rooms = await db.select().from(roomTable).where(eq(roomTable.id, roomIdParam));
	const room = rooms[0];

	if (!room) {
		return error(404, 'This room does not exist');
	}

	if (locals.user!.id !== room.userId) {
		return error(403, 'You are not authorized to access this room');
	}

	return {
		room: {
			name: room.name
		}
	};
};
