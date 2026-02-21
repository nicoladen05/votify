import { db } from '$lib/server/db/index.js';
import { guest } from '$lib/server/db/schema.js';
import { randomUUID } from 'node:crypto';

export const load = async ({ cookies, locals }) => {
	let guest_id = cookies.get('guest_id');

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

	return { isLoggedIn: locals.session ? true : false };
};
