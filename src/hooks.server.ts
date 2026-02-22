import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { generateAdminUser } from '$lib/server/generateAdminUser';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	generateAdminUser();

	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	// Protect the admin page
	if (!event.locals.user && event.url.pathname === '/admin') {
		return redirect(302, '/admin/auth/login');
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
