<script lang="ts">
	import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
	import { ChevronLeftIcon } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';

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

	const { data }: PageProps = $props();
</script>

<main class="relative flex justify-center overflow-hidden px-4 pt-6 sm:pt-8">
	<div class="pointer-events-none absolute inset-x-0 -top-40 h-72 opacity-60"></div>

	<div class="relative w-full max-w-2xl">
		<section class="rounded-xl border border-border bg-secondary p-2">
			<div class="mb-3 flex items-start justify-between gap-3">
				<div class="flex min-w-0 flex-1 items-center gap-1">
					<a href={resolve('/')}>
						<ChevronLeftIcon
							class="h-6 w-6 rounded-md text-muted-foreground hover:cursor-pointer hover:bg-foreground/10"
						/>
					</a>
					<h1 class="text-xl font-semibold tracking-tight text-foreground">Settings</h1>
					<form method="post" action="?/logout" class="flex w-full justify-end">
						<button
							class="mx-0.5 ml-auto inline-flex items-center rounded-md bg-destructive px-2 py-0.5 text-sm hover:cursor-pointer hover:bg-destructive/80"
							>Log out</button
						>
					</form>
				</div>
			</div>

			{#if data.isLoggedIn}
				<div class="space-y-4">
					<div class="flex items-center gap-3 rounded-xl border border-border bg-primary/60 p-3">
						<img
							src={data.user!.image_url}
							alt="User avatar"
							class="h-16 w-16 rounded-full object-cover"
						/>
						<div class="min-w-0">
							<p class="truncate text-base font-semibold text-foreground">{data.user!.name}</p>
							<p class="text-sm text-muted-foreground">Authorized Spotify account</p>
						</div>
					</div>

					<form method="post" action="?/logoutSpotify" class="flex justify-end">
						<button
							class="inline-flex items-center rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-foreground transition-colors hover:cursor-pointer hover:bg-destructive/80"
						>
							Log out of Spotify
						</button>
					</form>
				</div>
			{:else}
				<div class="space-y-4">
					<div class="rounded-xl border border-border bg-primary/60 p-4">
						<p class="text-sm text-muted-foreground">Sign in with Spotify to use the app.</p>
					</div>

					<div class="flex justify-end">
						<button
							onclick={() => {
								window.location.href = url;
							}}
							class="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:cursor-pointer hover:bg-accent/80"
						>
							Log in with Spotify
						</button>
					</div>
				</div>
			{/if}
		</section>
	</div>
</main>
