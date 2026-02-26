import { auth } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email) fail(400, 'Email is required');

		const response = await auth.api.requestPasswordReset({ body: { email }, asResponse: true });
		const message = await response.json();

		if (!response.ok) fail(400, message.error);
	}
};
