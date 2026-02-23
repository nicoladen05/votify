import { db } from '$lib/server/db';
import { room, spotifyTokens, spotifyTokens as spotifyTokensTable } from '$lib/server/db/schema';
import { stopAndRemoveRoomWorker } from '$lib/server/spotify/queueWatcher';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const rooms = await db
		.select({ id: room.id, name: room.name })
		.from(room)
		.where(eq(room.userId, locals.user!.id));

	const spotifyTokens = await db
		.select()
		.from(spotifyTokensTable)
		.where(eq(spotifyTokensTable.userId, locals.user!.id));

	const hasConnectedSpotify = spotifyTokens.length > 0;
	const user = await getAccountData();

	return { rooms, hasConnectedSpotify, user };
};

async function getAccountData(): Promise<{ name: string; image_url: string } | null> {
	const spotifyCredentials = await db.select().from(spotifyTokens);

	if (spotifyCredentials.length === 1) {
		const userProfileRequest = await fetch('https://api.spotify.com/v1/me', {
			headers: { Authorization: `Bearer ${spotifyCredentials[0].access_token}` }
		});

		const userProfile = await userProfileRequest.json();

		return { name: userProfile.display_name, image_url: userProfile.images[0].url };
	} else {
		return null;
	}
}

export const actions: Actions = {
	createRoom: async ({ request, locals }) => {
		const formData = await request.formData();

		const roomName = formData.get('room-name') as string;
		if (!roomName) error(400, 'Room name is required');

		const userId = locals.user!.id;
		const token = await db
			.select({ id: spotifyTokensTable.id })
			.from(spotifyTokensTable)
			.where(eq(spotifyTokensTable.userId, userId))
			.limit(1)
			.then((rows) => rows[0]);

		await db.insert(room).values({ name: roomName, userId, spotifyTokens: token?.id ?? null });
	},

	deleteRoom: async ({ request, locals }) => {
		const formData = await request.formData();
		const roomId = parseInt(formData.get('room-id') as string);

		stopAndRemoveRoomWorker(roomId);

		await db.delete(room).where(and(eq(room.id, roomId), eq(room.userId, locals.user!.id)));
	},

	logoutSpotify: async () => {
		await db.delete(spotifyTokens);
		return redirect(303, '/dashboard');
	}
};
