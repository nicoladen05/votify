import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;

		const token = url.searchParams.get('token');
		if (!token) return { status: 400, error: 'Invalid token' };

		const response = await auth.api.resetPassword({
			headers: request.headers,
			body: { newPassword: password, token },
			asResponse: true
		});

		if (response.ok) {
			return redirect(303, '/dashboard');
		} else {
			const authError = await response.json();
			return fail(401, { error: authError.message });
		}
	}
};
