<script lang="ts">
	import Button from '$lib/compenents/ui/Button.svelte';
	import Input from '$lib/compenents/ui/Input.svelte';
	import { enhance } from '$app/forms';
	import Dialog from '../Dialog.svelte';
	import SpotifyAccounts from '../settings/SpotifyAccounts.svelte';

	let { isOpen = $bindable(false), spotifyAccounts, createAction, onClose = () => {} } = $props();

	let roomName = $state('');
	let selected = $state(NaN);

	function closeDialog() {
		roomName = '';
		onClose();
		isOpen = false;
	}
</script>

<Dialog
	bind:isOpen
	title="Create room"
	subtitle="Name your room to get it ready for your listeners."
	onClose={closeDialog}
>
	<form
		class="flex flex-1 flex-col"
		method="post"
		action={createAction}
		use:enhance={() => {
			closeDialog();
		}}
	>
		<label for="room-name" class="mb-2 text-sm font-medium text-foreground">Room name</label>
		<Input id="room-name" name="room-name" placeholder="Late Night Jams" bind:value={roomName} />
		<input type="hidden" name="selected-account" value={selected} />

		<SpotifyAccounts bind:selected {spotifyAccounts} />
		<div class="mt-auto flex flex-col-reverse gap-2 pt-6 sm:flex-row sm:justify-end">
			<Button variant="hero-outline" onclick={closeDialog}>Cancel</Button>
			<Button type="submit" variant="hero" disabled={!roomName.trim()}>Create room</Button>
		</div>
	</form>
</Dialog>
