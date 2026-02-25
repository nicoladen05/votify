<script lang="ts">
	import { enhance } from '$app/forms';
	import { spotifyAuthUrl } from '$lib';
	import { RadioIcon } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';
	import { page } from '$app/state';

	const { hasConnectedSpotify, user, action } = $props();
</script>

<div
	class=" flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-secondary p-6 sm:flex-row sm:items-center"
>
	<div class="flex items-center gap-4">
		{#if !hasConnectedSpotify}
			<div class="flex min-h-12 min-w-12 items-center justify-center rounded-full bg-accent/10">
				<RadioIcon class="h-6 w-6 text-accent" />
			</div>
			<div>
				<h3 class="font-bold text-nowrap text-foreground">Spotify Connection</h3>
				<p class="line-clamp-2 text-sm text-muted-foreground">
					Connect your account to start playing music in rooms.
				</p>
			</div>
		{:else}
			<div class="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
				<img src={user?.image_url} alt="User avatar" class="h-12 w-12 rounded-full object-cover" />
			</div>
			<div>
				<p class="font-bold text-foreground">{user?.name}</p>
				<p class="text-sm text-muted-foreground">Authorized Spotify account</p>
			</div>
		{/if}
	</div>

	{#if !hasConnectedSpotify}
		<Button
			class="w-full text-nowrap md:w-auto"
			variant="hero"
			size="sm"
			onclick={() => {
				window.location.href = spotifyAuthUrl + '&state=' + page.url.pathname;
			}}>Connect Spotify</Button
		>
	{:else}
		<form method="post" {action} class="flex justify-end" use:enhance>
			<Button type="submit" variant="destructive" class="text-nowrap" size="sm"
				>Disconnect Spotify</Button
			>
		</form>
	{/if}
</div>
