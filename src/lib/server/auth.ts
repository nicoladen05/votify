import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { db } from '$lib/server/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { spotifyTokens } from './db/schema';
import { resend } from './email';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	plugins: [sveltekitCookies(getRequestEvent)], // make sure this is the last plugin in the array
	logger: {
		level: env.NODE_ENV === 'development' ? 'debug' : 'info'
	},

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			resend.emails.send({
				from: 'Votify <votify@skilldex.nicoladen.dev>',
				to: [user.email],
				subject: 'Reset your password',
				html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`
			});
		}
	},

	user: { changeEmail: { enabled: true } },

	emailVerification: {
		sendOnSignUp: false, // To avoid sending email on spotify sign up, send it manually for email signup
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			resend.emails.send({
				from: 'Votify <votify@skilldex.nicoladen.dev>',
				to: [user.email],
				subject: 'Verify your email',
				html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
			});
		}
	},

	socialProviders: {
		spotify: {
			clientId: PUBLIC_SPOTIFY_CLIENT_ID,
			clientSecret: SPOTIFY_CLIENT_SECRET
		}
	},

	// Store the users spotify token in the db, if they sign up via spotify
	databaseHooks: {
		account: {
			create: {
				after: async (account) => {
					if (
						account.providerId !== 'spotify' ||
						!account.accessToken ||
						!account.refreshToken ||
						!account.accessTokenExpiresAt ||
						!account.userId
					)
						return;

					await db.insert(spotifyTokens).values({
						access_token: account.accessToken,
						refresh_token: account.refreshToken,
						expires_at: account.accessTokenExpiresAt,
						userId: account.userId
					});
				}
			}
		}
	}
});
