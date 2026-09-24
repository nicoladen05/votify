import { db } from '$lib/server/db/index.js';
import { room } from '$lib/server/db/schema.js';
import { getAccessTokenByTokenId } from '$lib/server/spotify';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	const roomId = Number.parseInt(
		url.searchParams.get('roomId') ?? url.searchParams.get('roomid') ?? '',
		10
	);
	if (!Number.isInteger(roomId) || roomId <= 0) {
		return json({ error: 'Missing or invalid roomId' }, { status: 400 });
	}

	const params = {
		q: url.searchParams.get('q'),
		type: 'track',
		market: 'DE',
		limit: url.searchParams.get('limit')
	};

	const roomData = await db
		.select({ spotifyTokenId: room.spotifyTokens })
		.from(room)
		.where(eq(room.id, roomId))
		.limit(1);

	if (!roomData[0]?.spotifyTokenId) {
		return json({ error: 'Room has no Spotify token' }, { status: 409 });
	}

	const accessToken = await getAccessTokenByTokenId(roomData[0].spotifyTokenId);
	if (!accessToken) {
		return json({ error: 'Failed to get Spotify access token' }, { status: 500 });
	}

	if (!params.q) return json([]);

	const results = await fetch(
		`https://api.spotify.com/v1/search?q=${params.q}&type=${params.type}&market=${params.market}&limit=${params.limit}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	);
	if (!results.ok) {
		return json({ error: 'Spotify error' }, { status: results.status });
	}

	const data = await results.json();

	const simplifiedTracks = data.tracks.items.map(
		(track: {
			uri: string;
			album: { images: { url: string }[]; album_type: string; name: string };
			name: string;
			artists: { name: string }[];
			id: string;
		}) => ({
			uri: track.uri,
			image: track.album.images?.[0]?.url || null,
			name: track.name,
			artist: track.artists?.[0]?.name || 'Unknown',
			context: track.album.album_type === 'album' ? track.album.name : 'single',
			id: track.id
		})
	);

	return json(simplifiedTracks);
};
