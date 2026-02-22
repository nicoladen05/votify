import { db } from '$lib/server/db/index.js';
import { guest, room } from '$lib/server/db/schema.js';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, locals, params }) => {
	let guest_id = cookies.get('guest_id');
	const roomId = Number.parseInt(params.roomId, 10);
	if (!Number.isInteger(roomId) || roomId <= 0) {
		throw error(404, 'This room does not exist');
	}

	const roomData = await db
		.select({ name: room.name })
		.from(room)
		.where(eq(room.id, roomId))
		.limit(1)
		.then((rows) => rows[0]);

	if (!roomData) {
		throw error(404, 'This room does not exist');
	}

	if (!guest_id) {
		guest_id = randomUUID();
		cookies.set('guest_id', guest_id, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false, // in production
			maxAge: 60 * 60 * 24 * 365
		});
		await db.insert(guest).values({ cookie: guest_id });
	}

	return {
		isLoggedIn: locals.session ? true : false,
		roomId,
		roomName: roomData.name
	};
};
