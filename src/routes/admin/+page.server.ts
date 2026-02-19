import { db } from '$lib/server/db';
import { spotifyTokens } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const spotifyCredentials = await db.select().from(spotifyTokens);

	if (spotifyCredentials.length === 1) {
		const userProfileRequest = await fetch('https://api.spotify.com/v1/me', {
			headers: { Authorization: `Bearer ${spotifyCredentials[0].access_token}` }
		});

		if (!userProfileRequest.ok) {
			return { isLoggedIn: false };
		}

		const userProfile = await userProfileRequest.json();

		return {
			isLoggedIn: true,
			user: { name: userProfile.display_name, image_url: userProfile.images[0].url }
		};
	} else {
		return { isLoggedIn: false };
	}
};

export const actions = {
	logout: async () => {
		await db.delete(spotifyTokens);
		return redirect(303, '/admin');
	}
};
