import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { generateAdminUser } from '$lib/server/generateAdminUser';

const PUBLIC_ROUTES = ['/', '/auth', '/room/[roomId]/guest'];

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	generateAdminUser();

	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const routeId = event.route.id;
	const isPublic = routeId ? PUBLIC_ROUTES.includes(routeId) : false;

	if (!event.locals.user && !isPublic) {
		return redirect(302, '/auth');
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
