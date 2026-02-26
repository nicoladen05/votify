import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { resend } from './email';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	plugins: [sveltekitCookies(getRequestEvent)], // make sure this is the last plugin in the array
	logger: {
		level: env.NODE_ENV === 'development' ? 'debug' : 'info'
	},

	emailAndPassword: { enabled: true, requireEmailVerification: true },
  user: { changeEmail: { enabled: true } },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails.send({
        from: "Votify <votify@skilldex.nicoladen.dev>",
        to: [user.email],
        subject: 'Verify your email',
        html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
      })
    }
  }
});
