<script>
	import { enhance } from '$app/forms';
	import { PlayIcon, Trash2Icon, CircleStop } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import Button from '../ui/Button.svelte';
	import { goto } from '$app/navigation';
	import Dialog from '../Dialog.svelte';
	import SpotifyAccounts from '../settings/SpotifyAccounts.svelte';

	const { room, action, spotifyAccounts } = $props();

	let isOpen = $state(false);
	function handleButtonClick() {
		isOpen = !isOpen;
	}

	function handleMenuClose() {
		isOpen = false;
	}
</script>

<div
	class="card-hover rounded-xl border border-border bg-secondary p-6"
	onkeydown={() => {}}
	role="button"
	tabindex="0"
	onclick={() => {
		goto(resolve(`/room/${room.id}`));
	}}
>
	<div class="mb-4 flex items-center justify-between">
		<h3 class="truncate font-bold text-foreground">{room.name}</h3>

		<span
			class={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
				room.state === 'live' ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'
			}`}
		>
			<span
				class={`h-1.5 w-1.5 rounded-full ${
					room.state === 'live' ? 'animate-pulse bg-accent' : 'bg-muted-foreground'
				}`}
			></span>
			{room.state === 'live' ? 'Live' : 'Offline'}
		</span>
	</div>
	<div class="flex items-center gap-2">
		{#if room.state === 'offline'}
			<form method="post" action="?/launchRoom" use:enhance>
				<input value={room.id} name="room-id" type="hidden" />
				<input value={room.spotifyTokens} name="spotify-id" type="hidden" />
				<Button
					variant="hero"
					size="sm"
					type="submit"
					onclick={(e) => {
						e.stopPropagation();
					}}
				>
					<PlayIcon class="mr-1 h-3 w-3" />
					Launch
				</Button>
			</form>
		{:else if room.state === 'live'}
			<form method="post" action="?/stopRoom" use:enhance>
				<input value={room.id} name="room-id" type="hidden" />
				<input value={room.spotifyTokens} name="spotify-id" type="hidden" />
				<Button
					variant="destructive"
					size="sm"
					type="submit"
					onclick={(e) => {
						e.stopPropagation();
					}}
				>
					<CircleStop class="mr-1 h-3 w-3" />
					Stop
				</Button>
			</form>
		{:else if (room.state = 'missing_credentials')}
			<Button
				class="text-nowrap"
				variant="missing-credentials"
				size="sm"
				type="submit"
				onclick={(e) => {
					e.stopPropagation();
					handleButtonClick();
				}}
			>
				Connect Spotify
			</Button>
		{/if}

		<form method="post" class="ml-auto" {action} use:enhance>
			<input value={room.id} name="room-id" type="hidden" />
			<Button
				variant="ghost"
				type="submit"
				size="icon"
				class="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-destructive!"
				onclick={(e) => {
					e.stopPropagation();
				}}
			>
				<Trash2Icon class="h-4 w-4 transition-all duration-200" />
			</Button>
		</form>
	</div>
</div>

<Dialog bind:isOpen onClose={handleMenuClose}>
	<SpotifyAccounts
		onSelect={() => {
			isOpen = false;
		}}
		{spotifyAccounts}
		roomid={room.id}
	/>
</Dialog>
