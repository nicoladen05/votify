import { db } from '$lib/server/db/index.js';
import { spotifyTokens } from '$lib/server/db/schema.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const params = {
		q: url.searchParams.get('q'),
		type: 'album%2Cartist%2Cplaylist%2Ctrack',
		market: 'DE',
		limit: url.searchParams.get('limit'),
		offset: url.searchParams.get('offset') ?? 0
	};

	const accessToken = await db
		.select({ accessToken: spotifyTokens.access_token })
		.from(spotifyTokens)
		.limit(1);

	if (!params.q) return json([]);

	const results = await fetch(
		`https://api.spotify.com/v1/search?q=${params.q}&type=${params.type}&market=${params.market}&limit=${params.limit}&offset=${params.offset}`,
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

	return json(data);
}
