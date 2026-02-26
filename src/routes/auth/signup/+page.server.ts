import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!username) {
			return fail(400, { error: 'Username is required' });
		}

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const authResponse = await auth.api.signUpEmail({
			body: { name: username, email, password },
			asResponse: true
		});

		if (authResponse.ok) {
			return redirect(303, '/auth/signup/complete');
		}

		const authError = await authResponse.json();
		return fail(401, { error: authError.message });
	}
};
