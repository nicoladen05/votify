import { ADMIN_EMAIL, ADMIN_PASSWORD } from '$env/static/private';
import { sql } from 'drizzle-orm';
import { auth } from './auth';
import { db } from './db';

let checkedForUser = false;

async function userExists(email: string, password: string): Promise<boolean> {
	// Attempt to sign in, to check if the credentials are valid
	try {
		const authResponse = await auth.api.signInEmail({
			body: { email, password }
		});

		if (authResponse.user) {
			return true;
		} else {
			return false;
		}
	} catch {
		return false;
	}
}

export async function generateAdminUser() {
	if (checkedForUser) return;

	if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
		throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
	}

	if (!(await userExists(ADMIN_EMAIL, ADMIN_PASSWORD))) {
		// Remove previous user data
		await db.execute(sql`SET client_min_messages TO WARNING`);
		await db.execute(sql`TRUNCATE TABLE session CASCADE`);
		await db.execute(sql`TRUNCATE TABLE account CASCADE`);
		await db.execute(sql`TRUNCATE TABLE "user" CASCADE`);

		// Create new admin user
		try {
			const user = await auth.api.signUpEmail({
				body: {
					name: 'Admin',
					email: ADMIN_EMAIL,
					password: ADMIN_PASSWORD
				}
			});
		} catch (error) {
			console.error('Failed to create admin user:', error);
		}
	}

	checkedForUser = true;
}
