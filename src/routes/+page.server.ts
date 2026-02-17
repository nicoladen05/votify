import { db } from '$lib/server/db';
import { spotifyTokens } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const accessToken = await db
		.select({ accessToken: spotifyTokens.access_token })
		.from(spotifyTokens)
		.limit(1);

	const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing?market=DE', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken[0].accessToken}`
		}
	});
	const data = await response.json();

	console.log(data);

	return {
		image: data.item.album.images[0].url,
		title: data.item.name,
		artist: data.item.artists[0].name,
		progress: (data.progress_ms / data.item.duration_ms) * 100,
		is_playing: data.is_playing
	};
};
