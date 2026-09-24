import { launchRoom, selectAccount, stopRoom } from '$lib/server/actions';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { room, spotifyTokens as spotifyTokensTable } from '$lib/server/db/schema';
import { stopAndRemoveRoomWorker } from '$lib/server/spotify/queueWatcher';
import { error, redirect } from '@sveltejs/kit';
import { and, asc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const roomsPromise = db
		.select({ id: room.id, name: room.name, state: room.state, spotifyTokens: room.spotifyTokens })
		.from(room)
		.where(eq(room.userId, locals.user!.id))
		.orderBy(asc(room.state));

	const spotifyTokensPromise = db
		.select()
		.from(spotifyTokensTable)
		.where(eq(spotifyTokensTable.userId, locals.user!.id));

	const userPromise = getAccountData();

	const [rooms, spotifyTokens, user] = await Promise.all([
		roomsPromise,
		spotifyTokensPromise,
		userPromise
	]);

	rooms.forEach(async (singleRoom) => {
		if (singleRoom.spotifyTokens === null) {
			await db.update(room).set({ state: 'missing_credentials' }).where(eq(room.id, singleRoom.id));
			singleRoom.state = 'missing_credentials';
		}
	});

	return { rooms, spotifyTokens, user };
};

async function getAccountData(): Promise<{ name: string; image_url: string } | null> {
	const spotifyCredentials = await db.select().from(spotifyTokensTable);

	if (spotifyCredentials.length === 1) {
		const userProfileRequest = await fetch('https://api.spotify.com/v1/me', {
			headers: { Authorization: `Bearer ${spotifyCredentials[0].access_token}` }
		});

		if (!userProfileRequest.ok) return null;

		const userProfile = await userProfileRequest.json();

		return { name: userProfile.display_name, image_url: userProfile.images[0].url };
	} else {
		return null;
	}
}

export const actions: Actions = {
	createRoom: async ({ request, locals }) => {
		const formData = await request.formData();

		const selectedID = parseInt(formData.get('selected-account') as string);
		const roomName = formData.get('room-name') as string;
		if (!roomName) error(400, 'Room name is required');
		console.log(selectedID);

		const userId = locals.user!.id;
		let token;
		if (selectedID) {
			token = await db
				.select({ id: spotifyTokensTable.id })
				.from(spotifyTokensTable)
				.where(eq(spotifyTokensTable.id, selectedID))
				.limit(1)
				.then((rows) => rows[0]);
		}

		await db
			.insert(room)
			.values({ name: roomName, userId, spotifyTokens: token?.id ?? null })
			.returning({ id: room.id });
	},

	deleteRoom: async ({ request, locals }) => {
		const formData = await request.formData();
		const roomId = parseInt(formData.get('room-id') as string);
		if (!formData) return;

		const deletedRooms = await db
			.delete(room)
			.where(and(eq(room.id, roomId), eq(room.userId, locals.user!.id)))
			.returning({ id: room.id });

		// Room was removed successfully
		if (deletedRooms.length > 1) {
			stopAndRemoveRoomWorker(roomId);
		}
	},

	signOut: async ({ request }) => {
		const result = await auth.api.signOut({ headers: request.headers });

		if (result.success) return redirect(303, '/');
	},
	selectAccount,

	launchRoom,

	stopRoom
};
