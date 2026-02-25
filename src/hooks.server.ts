import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const PUBLIC_ROUTES = ['/', '/auth', '/room/[roomId]/guest'];

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const routeId = event.route.id;
	const isPublic = routeId ? PUBLIC_ROUTES.includes(routeId) : false;
	const isAuthRoute =
		routeId?.startsWith('/api/auth') || event.url.pathname.startsWith('/api/auth');

	if (!event.locals.user && !isPublic && !isAuthRoute) {
		return redirect(302, '/auth');
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
