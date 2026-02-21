<script lang="ts">
	import { XIcon } from '@lucide/svelte';
	import Button from '$lib/compenents/ui/Button.svelte';
	import Input from '$lib/compenents/ui/Input.svelte';

	let {
		open = false,
		createAction,
		onClose = () => {}
	}: {
		open?: boolean;
		createAction: string;
		onClose?: () => void;
	} = $props();

	let roomName = $state('');

	function closeDialog() {
		roomName = '';
		onClose();
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') {
			closeDialog();
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if open}
	<div class="fixed inset-0 z-50 md:flex md:items-center md:justify-center md:p-6">
		<button
			type="button"
			class="absolute inset-0 bg-primary/80 backdrop-blur-sm"
			aria-label="Close create room dialog"
			onclick={closeDialog}
		></button>
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="create-room-title"
			class="relative flex h-full w-full flex-col bg-secondary p-6 md:h-auto md:max-h-[90vh] md:w-full md:max-w-lg md:rounded-2xl md:border md:border-border md:p-7"
		>
			<div class="mb-6 flex items-start justify-between gap-4">
				<div>
					<h3 id="create-room-title" class="text-xl font-bold text-foreground">Create room</h3>
					<p class="mt-1 text-sm text-muted-foreground">
						Name your room to get it ready for your listeners.
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon"
					class="h-9 w-9 shrink-0 rounded-full hover:bg-primary"
					onclick={closeDialog}
				>
					<XIcon class="h-4 w-4" />
				</Button>
			</div>

			<form class="flex flex-1 flex-col" method="post" action={createAction}>
				<label for="room-name" class="mb-2 text-sm font-medium text-foreground">Room name</label>
				<Input
					id="room-name"
					name="room-name"
					placeholder="Late Night Jams"
					value={roomName}
					oninput={(event) => {
						roomName = (event.currentTarget as HTMLInputElement).value;
					}}
					autofocus
				/>

				<div class="mt-auto flex flex-col-reverse gap-2 pt-6 sm:flex-row sm:justify-end">
					<Button variant="hero-outline" onclick={closeDialog}>Cancel</Button>
					<Button type="submit" variant="hero" disabled={!roomName.trim()}>Create room</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
