import { getAccessToken } from '$lib/server/spotify';
import type { PageServerLoad } from './$types';

async function getPlaybackState(accessToken: string): Promise<{
	state: string;
	song?: { title: string; artist: string; coverImage: string; progress: number };
}> {
	const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing?market=DE', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok || response.status === 204) {
		return { state: 'stopped' };
	}

	const data = await response.json();

	return {
		state: data.is_playing ? 'playing' : 'paused',
		song: {
			title: data.item.name,
			artist: data.item.artists[0].name,
			coverImage: data.item.album.images[0].url,
			progress: (data.progress_ms / data.item.duration_ms) * 100
		}
	};
}

export const load: PageServerLoad = async () => {
	const accessToken = await getAccessToken();

	if (!accessToken) {
		return {
			is_playing: false
		};
	}

	const playbackState = await getPlaybackState(accessToken);

	return {
		playbackState
	};
};
