import { db } from '$lib/server/db/index.js';
import { spotifyTokens } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const params = {
		q: url.searchParams.get('q'),
		type: 'track',
		market: 'DE',
		limit: url.searchParams.get('limit')
	};

	const accessToken = await db
		.select({ accessToken: spotifyTokens.access_token })
		.from(spotifyTokens)
		.limit(1);

	if (!params.q) return json([]);

	const results = await fetch(
		`https://api.spotify.com/v1/search?q=${params.q}&type=${params.type}&market=${params.market}&limit=${params.limit}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken[0].accessToken}`
			}
		}
	);
	if (!results.ok) {
		return json({ error: 'Spotify error' }, { status: results.status });
	}

	const data = await results.json();

	const simplifiedTracks = data.tracks.items.map((track) => ({
		uri: track.uri,
		image: track.album.images?.[0]?.url || null,
		name: track.name,
		artist: track.artists?.[0]?.name || 'Unknown',
		context: track.album.album_type === 'album' ? track.album.name : 'single'
	}));

	return json(simplifiedTracks);
}
