import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const accountData = db.select().from(user).where(eq(user.id, locals.user!.id));

	return {
		accountData: accountData.then((account) => ({
			email: account[0].email,
			name: account[0].name
		}))
	};
};

export const actions: Actions = {
	updateAccount: async ({ request, locals }) => {
		const formData = await request.formData();
		const userName = formData.get('username') as string;
		const email = formData.get('email') as string;

		if (!userName || !email) {
			return error(400, 'Missing parameters');
		}

		if (locals.user!.name !== userName)
			auth.api.updateUser({ body: { name: userName }, headers: request.headers });

		if (locals.user!.email !== email)
			auth.api.changeEmail({ body: { newEmail: email }, headers: request.headers });
	},

	resetPassword: async ({ request, locals }) => {
		await auth.api.requestPasswordReset({
			headers: request.headers,
			body: { email: locals.user!.email, redirectTo: '/auth/reset-password' }
		});
	}
};
