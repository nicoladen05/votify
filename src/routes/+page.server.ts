import { db } from '$lib/server/db';
import { spotifyTokens } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const accessToken = db.select({ accessToken: spotifyTokens.access_token }).from(spotifyTokens);

	const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing?market=DE', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const data = await response.json();
	return {
		image: data.item.album.images.url,
		title: data.item.name,
		artist: data.item.artist.name,
		progress: data.progress_ms,
		is_playing: data.is_playing
	};
};
