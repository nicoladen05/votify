import { db } from '$lib/server/db';
import { room as roomTable, spotifyTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getAccessTokenByTokenId } from '$lib/server/spotify';

export const load: PageServerLoad = async ({ params, locals }) => {
	const roomIdParam = parseInt(params.roomId);

	if (!Number.isInteger(roomIdParam) || roomIdParam <= 0) error(404, 'This room does not exist');

	const dbrooms = await db.select().from(roomTable).where(eq(roomTable.id, roomIdParam));
	const room = dbrooms[0];

	const spotifyAccount = room.spotifyTokens ? await getAccountData(room.spotifyTokens!) : null;

	const getStatus = () => {
		if (!spotifyAccount) return 'missing_credentials';
		return 'live';
	};

	if (!room) {
		return error(404, 'This room does not exist');
	}

	if (locals.user!.id !== room.userId) {
		return error(403, 'You are not authorized to access this room');
	}

	return {
		room: {
			roomid: roomIdParam,
			name: room.name,
			status: getStatus()
		},
		spotifyAccount
	};
};

async function getAccountData(
	accountid: number
): Promise<{ name: string; image_url: string } | null> {
	const spotifyCredentials = await db
		.select()
		.from(spotifyTokens)
		.where(eq(spotifyTokens.id, accountid));

	if (spotifyCredentials.length === 1) {
		console.log(spotifyCredentials);
		console.log(await getAccessTokenByTokenId(spotifyCredentials[0].id));
		const userProfileRequest = await fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: `Bearer ${await getAccessTokenByTokenId(spotifyCredentials[0].id)}`
			}
		});
		console.log(userProfileRequest);
		if (!userProfileRequest.ok) return null;

		const userProfile = await userProfileRequest.json();

		return { name: userProfile.display_name, image_url: userProfile.images[0].url };
	} else {
		return null;
	}
}

export const actions: Actions = {
	logoutSpotify: async () => {
		await db.delete(spotifyTokens);
	}
};
