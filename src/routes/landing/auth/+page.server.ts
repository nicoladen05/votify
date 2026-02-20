import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();
		const action = data.get('action')?.toString();

		if (!email || !password)
			return { status: 400, body: { error: 'Email and password are required' } };

		let authResponse;
		if (action === 'login') {
			authResponse = await auth.api.signInEmail({ body: { email, password }, asResponse: true });
		} else if (action === 'signup') {
			const username = data.get('username')?.toString();
			if (!username) return { status: 400, body: { error: 'Username is required' } };
			authResponse = await auth.api.signUpEmail({
				body: { name: username, email, password },
				asResponse: true
			});
		} else {
			return { status: 400, body: { error: 'Wrong action' } };
		}

		if (authResponse.ok) {
			return redirect(303, '/landing/dashboard');
		} else {
			const authError = await authResponse.json();
			return fail(401, { error: authError.message });
		}
	}
};
