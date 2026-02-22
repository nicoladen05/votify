import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { setAccessToken } from '$lib/server/spotify';
import { error, json, redirect } from '@sveltejs/kit';

export async function GET({ url, locals }) {
	if (!locals.user) {
		throw error(403, '/admin');
	}

	const code = url.searchParams.get('code');
	if (!code) throw redirect(303, '/admin');

	const header = {
		Authorization: 'Basic ' + btoa(`${PUBLIC_SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
		'Content-Type': 'application/x-www-form-urlencoded'
	};

	const body = new URLSearchParams({
		grant_type: 'authorization_code',
		code: code,
		redirect_uri: 'http://127.0.0.1:5173/admin/spotify/callback'
	});

	const response = await fetch('https://accounts.spotify.com/api/token', {
		headers: header,
		method: 'POST',
		body: body
	});
	if (!response.ok)
		return json({ success: false, message: 'Failed to get authorization Token' }, { status: 500 });

	const data = await response.json();

	await setAccessToken(data.access_token, data.expires_in, data.refresh_token, locals.user.id);

	return redirect(303, '/admin');
}
