import { getAccessToken } from '$lib/server/spotify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const accessToken = await getAccessToken();

	if (!accessToken) {
		return {
			is_playing: false
		};
	}

	const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing?market=DE', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok || response.status === 204) {
		return {
			is_playing: false
		};
	}

	const data = await response.json();

	if (data.is_playing) {
		return {
			is_playing: true,
			image: data.item.album.images[0].url,
			title: data.item.name,
			artist: data.item.artists[0].name,
			progress: (data.progress_ms / data.item.duration_ms) * 100
		};
	} else {
		return {
			is_playing: false,
			image: data.item.album.images[0].url,
			title: data.item.name,
			artist: data.item.artists[0].name,
			progress: (data.progress_ms / data.item.duration_ms) * 100
		};
	}
};
