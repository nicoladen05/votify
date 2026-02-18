import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { db } from '$lib/server/db';
import { spotifyTokens } from '$lib/server/db/schema';

async function getAccessTokenFromRefreshToken(
	refreshToken: string
): Promise<{ accessToken: string; expiresIn: number } | null> {
	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: refreshToken
	});

	const header = {
		Authorization: 'Basic ' + btoa(`${PUBLIC_SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
		'Content-Type': 'application/x-www-form-urlencoded'
	};

	const response = await fetch('https://accounts.spotify.com/api/token', {
		headers: header,
		method: 'POST',
		body: body
	});

	if (!response.ok) return null;

	const data = await response.json();

	if (!data.access_token) return null;

	return { accessToken: data.access_token, expiresIn: data.expires_in };
}

/**
 * Saves a token set in the database
 * @param accessToken The spotify access token
 * @param expiresIn The number of seconds the token is valid for
 * @param refreshToken The spotify refresh token
 */
export async function setAccessToken(accessToken: string, expiresIn: number, refreshToken: string) {
	const expiresAt = new Date(Date.now() + expiresIn * 1000);

	await db.insert(spotifyTokens).values({
		access_token: accessToken,
		refresh_token: refreshToken,
		expires_at: expiresAt
	});
}

/**
 * Retrieves the access token from the database
 * @returns The access token or null if not found
 */
export async function getAccessToken(): Promise<string | null> {
	const spotifyToken = await db
		.select()
		.from(spotifyTokens)
		.limit(1)
		.then((tokens) => tokens[0]);

	if (!spotifyToken) {
		return null;
	}

	const accessTokenIsValid = spotifyToken.expires_at >= new Date();

	if (accessTokenIsValid) {
		return spotifyToken.access_token;
	} else {
		const { accessToken, expiresIn } = (await getAccessTokenFromRefreshToken(
			spotifyToken.refresh_token
		)) ?? { accessToken: '', expiresIn: 0 };

		await db.update(spotifyTokens).set({
			access_token: accessToken,
			expires_at: new Date(Date.now() + expiresIn * 1000)
		});

		return accessToken;
	}
}
