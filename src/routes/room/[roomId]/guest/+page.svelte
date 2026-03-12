<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowLeftIcon, MusicIcon, PlusIcon } from '@lucide/svelte';
	import NowPlaying from '$lib/compenents/NowPlaying.svelte';
	import Queue from '$lib/compenents/Queue.svelte';
	import SearchBar from '$lib/compenents/SearchBar.svelte';

	const { data } = $props();

	const isLoggedIn = $derived(data.isLoggedIn);
	const roomName = $derived(data.room.name);
	const roomId = $derived(data.room.id);
</script>

<main class="relative min-h-screen overflow-x-clip bg-primary px-4 pt-6 pb-10 sm:pt-8">
	<div class="mx-auto flex w-full max-w-2xl flex-col">
		{#if isLoggedIn}
			<a
				href={resolve(`/room/${roomId}`)}
				class="top-5 left-5 mb-8 flex items-center justify-start gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:flex"
			>
				<ArrowLeftIcon class="h-4 w-4" />
				Back to Overview
			</a>
		{/if}
		<header
			class="sticky top-4 z-20 mb-5 rounded-2xl border border-border/80 bg-secondary/80 p-4 backdrop-blur-lg"
		>
			<div class="mb-1 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<MusicIcon class="h-4.5 w-4.5 text-accent" />
					<span class="text-sm font-bold tracking-wide text-foreground">Votify</span>
				</div>
				<span
					class={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold
				          ${data.room.state === 'live' ? 'border-accent/25 bg-accent/10 text-accent ' : 'border-muted-foreground/25 bg-muted-foreground/10 text-muted-foreground'}`}
				>
					<span
						class={`h-1.5 w-1.5 rounded-full ${data.room.state === 'live' ? 'animate-pulse bg-accent' : 'bg-muted-foreground'} `}
					></span>
					{data.room.state === 'live' ? 'Live' : 'Offline'}
				</span>
			</div>
			<h1 class="truncate text-xl font-bold text-foreground">{roomName}</h1>
		</header>

		<div
			class={`flex flex-col gap-4 rounded-2xl border border-border/70 bg-secondary/25 p-3 sm:p-4 ${data.room.state !== 'live' ? 'pointer-events-none blur-sm' : ''} `}
		>
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
