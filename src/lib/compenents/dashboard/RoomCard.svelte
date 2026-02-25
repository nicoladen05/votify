<script>
	import { enhance } from '$app/forms';
	import { PlayIcon, Settings2Icon, Trash2Icon } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import Button from '../ui/Button.svelte';
	import { goto } from '$app/navigation';

	const { room, action } = $props();
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
		<h3 class="font-bold text-foreground">{room.name}</h3>
	</div>
	<div class="flex items-center gap-2">
		<Button
			variant="hero"
			size="sm"
			onclick={(e) => {
				e.stopPropagation();
			}}
		>
			<PlayIcon class="mr-1 h-3 w-3" />
			Launch
		</Button>

		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
			onclick={(e) => {
				e.stopPropagation();
			}}
		>
			<Settings2Icon class="h-4 w-4" />
		</Button>
		<form method="post" {action} use:enhance>
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
