import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const authResponse = await auth.api.signInEmail({
			body: { email, password },
			asResponse: true
		});

		if (authResponse.ok) {
			return redirect(303, '/dashboard');
		}

		const authError = await authResponse.json();
		return fail(401, { error: authError.message });
	},

	continueSpotify: async ({ request }) => {
		const authResponse = await auth.api.signInSocial({
			headers: request.headers,
			body: {
				provider: 'spotify',
				callbackURL: '/dashboard',
				errorCallbackURL: '/auth/login',
				scopes: [
					'user-read-playback-state',
					'user-modify-playback-state',
					'user-read-currently-playing'
				]
			}
		});

		if (!authResponse.url) return fail(400, { error: 'No URL provided' });

		return redirect(303, authResponse.url);
	}
};
