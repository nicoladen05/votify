<script lang="ts">
	import { resolve } from '$app/paths';
	import { MusicIcon, PlusIcon } from '@lucide/svelte';
	import NowPlaying from '$lib/compenents/NowPlaying.svelte';
	import Queue from '$lib/compenents/Queue.svelte';
	import SearchBar from '$lib/compenents/SearchBar.svelte';

	const { data } = $props();

	const isLoggedIn = $derived(data.isLoggedIn);
	const roomName = $derived(data.roomName);
	const roomId = $derived(data.roomId);
</script>

<main class="relative min-h-screen overflow-x-clip bg-primary px-4 pt-6 pb-10 sm:pt-8">
	{#if isLoggedIn}
		<a class="absolute top-5 right-5 hidden justify-end md:flex" href={resolve('/admin')}>
			<button
				class="inline-flex items-center rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:cursor-pointer hover:bg-secondary/70"
				>Admin</button
			>
		</a>
	{/if}

	<div class="mx-auto flex w-full max-w-2xl flex-col">
		<header
			class="sticky top-4 z-20 mb-5 rounded-2xl border border-border/80 bg-secondary/80 p-4 backdrop-blur-lg"
		>
			<div class="mb-1 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<MusicIcon class="h-4.5 w-4.5 text-accent" />
					<span class="text-sm font-bold tracking-wide text-foreground">Votify</span>
				</div>
				<span
					class="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-1 text-[11px] font-semibold text-accent"
				>
					<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
					Live
				</span>
			</div>
			<h1 class="truncate text-xl font-bold text-foreground">{roomName}</h1>
		</header>

		<div class="flex flex-col gap-4 rounded-2xl border border-border/70 bg-secondary/25 p-3 sm:p-4">
			<div class="animate-scale-in z-10" style="animation-delay: 40ms;">
				<SearchBar {roomId} />
			</div>

			<div class="animate-scale-in" style="animation-delay: 80ms;">
				<NowPlaying {roomId} />
			</div>

			<div class="animate-scale-in" style="animation-delay: 120ms;">
				<Queue {roomId} />
			</div>

			<button
				type="button"
				class="animate-scale-in bg-gradient-green mt-1 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-accent/35 px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:brightness-110"
				style="animation-delay: 160ms;"
				onclick={() => {
					const searchInput = document.querySelector(
						'input[type="text"]'
					) as HTMLInputElement | null;
					searchInput?.focus();
				}}
			>
				<PlusIcon class="h-4 w-4" />
				Add a Song to the Queue
			</button>
		</div>
	</div>
</main>
