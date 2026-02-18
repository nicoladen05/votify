import { getAccessToken } from '$lib/server/spotify';
import { json } from '@sveltejs/kit';

export async function GET() {
	const accessToken = await getAccessToken();
	const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing?market=DE', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok || response.status === 204) {
		return json({ state: 'stopped' });
	}

	const data = await response.json();

	return json({
		state: data.is_playing ? 'playing' : 'paused',
		song: {
			title: data.item.name,
			artist: data.item.artists[0].name,
			coverImage: data.item.album.images[0].url,
			duration: data.item.duration_ms,
			progress: (data.progress_ms / data.item.duration_ms) * 100
		}
	});
}
