<script lang="ts">
	import { XIcon } from '@lucide/svelte';
	import Button from '$lib/compenents/ui/Button.svelte';

	let {
		title = null,
		subtitle = null,
		children,
		isOpen = $bindable(false),
		onClose = () => {}
	} = $props();

	function closeDialog() {
		onClose();
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (isOpen && event.key === 'Escape') {
			closeDialog();
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if isOpen}
	<div class="fixed inset-0 z-50 md:flex md:items-center md:justify-center md:p-6">
		<button
			type="button"
			class="absolute inset-0 bg-primary/80 backdrop-blur-sm"
			aria-label="Close create room dialog"
			onclick={closeDialog}
		></button>
		{#if title && subtitle}
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="create-room-title"
				class="relative flex h-full w-full flex-col bg-secondary p-6 md:h-auto md:max-h-[90vh] md:w-full md:max-w-lg md:rounded-2xl md:border md:border-border md:p-7"
			>
				<div class="mb-6 flex items-start justify-between gap-4">
					<div>
						<h3 id="create-room-title" class="text-xl font-bold text-foreground">{title}</h3>
						<p class="mt-1 text-sm text-muted-foreground">
							{subtitle} test
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
				{@render children?.()}
			</div>
		{:else}
			<div
				class="relative flex h-full w-full flex-col bg-secondary md:h-auto md:max-h-[90vh] md:w-full md:max-w-lg md:rounded-2xl md:border md:border-border"
			>
				{@render children?.()}
				<Button variant="hero" class="mx-6 mt-auto mb-6 max-w-lvw md:hidden" onclick={closeDialog}
					>Close</Button
				>
			</div>
		{/if}
	</div>
{/if}
