<script lang="ts">
	import { fade } from 'svelte/transition';

	let { isOpen = $bindable(false), onClose = () => {} } = $props();
	let dropdownEl: HTMLDivElement | null = $state(null);

	// Schließt das Dropdown, wenn außerhalb geklickt wird
	function handleClickOutside(e: MouseEvent) {
		if (dropdownEl && !dropdownEl.contains(e.target as Node)) {
			isOpen = false;
			onClose?.();
		}
	}

	// Schließt das Dropdown mit ESC
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			isOpen = false;
			onClose?.();
		}
	}
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

{#if isOpen}
	<div bind:this={dropdownEl} class="dropdown-menu" transition:fade={{ duration: 150 }}>
		<ul>
			<li>1</li>
			<li>2</li>
			<li>3</li>
		</ul>
	</div>
{/if}

<style>
	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 0.5rem;
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		z-index: 1000;
		min-width: 150px;
	}
</style>
