<script lang="ts">
	import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
	const queryparams = {
		response_type: 'code',
		redirect_uri: 'http://127.0.0.1:5173/admin/spotify/callback',
		scope: 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
	};
	const url =
		`https://accounts.spotify.com/authorize?client_id=${PUBLIC_SPOTIFY_CLIENT_ID}` +
		`&response_type=${queryparams.response_type}` +
		`&redirect_uri=${queryparams.redirect_uri}` +
		`&scope=${encodeURIComponent(queryparams.scope)}`;
</script>

<button
	onclick={() => {
		window.location.href = url;
	}}
	>LogIn with Spotify
</button>
