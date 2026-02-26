import { launchRoom } from '$lib/server/actions';
import { db } from '$lib/server/db';
import { room, room as roomTable, spotifyTokens } from '$lib/server/db/schema';
import { getAccessTokenByTokenId } from '$lib/server/spotify';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const roomIdParam = parseInt(params.roomId);

	if (!Number.isInteger(roomIdParam) || roomIdParam <= 0) error(404, 'This room does not exist');

	const dbrooms = await db.select().from(roomTable).where(eq(roomTable.id, roomIdParam));
	let singleRoom = dbrooms[0];
	let user;

	if (singleRoom.spotifyTokens) {
		user = await getAccountData(singleRoom.spotifyTokens!);
	} else {
		singleRoom = (
			await db
				.update(room)
				.set({ state: 'missing_credentials' })
				.where(eq(room.id, singleRoom.id))
				.returning()
		)[0];
	}

	if (!singleRoom) {
		return error(404, 'This room does not exist');
	}

	if (locals.user!.id !== singleRoom.userId) {
		return error(403, 'You are not authorized to access this room');
	}

	return {
		room: {
			roomid: roomIdParam,
			name: singleRoom.name,
			status: singleRoom!.state
		},
		user
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
		const userProfileRequest = await fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: `Bearer ${await getAccessTokenByTokenId(spotifyCredentials[0].id)}`
			}
		});
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
	},

	launchRoom
};
