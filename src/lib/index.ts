// place files you want to import through the `$lib` alias in this folder.
import { page } from '$app/state';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';

const queryparams = new URLSearchParams({
	client_id: PUBLIC_SPOTIFY_CLIENT_ID,
	response_type: 'code',
	redirect_uri: page.url.origin + '/admin/spotify/callback',
	scope:
		'user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-email'
});

export const spotifyAuthUrl = 'https://accounts.spotify.com/authorize?' + queryparams.toString();
