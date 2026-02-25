import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	plugins: [sveltekitCookies(getRequestEvent)], // make sure this is the last plugin in the array
	logger: {
		level: env.NODE_ENV === 'development' ? 'debug' : 'info'
	},

	emailAndPassword: { enabled: true },
	user: { changeEmail: { enabled: true }, updateEmailWithoutVerification: true },
  emailVerification: { sendVerificationEmail: async () => { } }
});
