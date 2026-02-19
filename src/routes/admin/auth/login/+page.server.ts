import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password)
			return { status: 400, body: { error: 'Email and password are required' } };

		const authResponse = await auth.api.signInEmail({
			body: {
				email,
				password,
				rememberMe: true
			},
			asResponse: true
		});

		if (authResponse.ok) {
			console.log('User logged in successfully');
			return redirect(303, '/admin');
		} else {
			const authError = await authResponse.json();
			return fail(401, { error: authError.message });
		}
	}
} satisfies Actions;
