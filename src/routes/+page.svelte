<script lang="ts">
	import { resolve } from '$app/paths';
	import NowPlaying from '$lib/compenents/NowPlaying.svelte';
	import Queue from '$lib/compenents/Queue.svelte';
	import SearchBar from '$lib/compenents/SearchBar.svelte';

	const { data } = $props();

	const isLoggedIn = $derived(data.isLoggedIn);
</script>

<main class="flex flex-col items-center gap-5.5 px-4 pt-6 sm:pt-8 md:gap-0">
	{#if isLoggedIn}
		<a class="flex w-full justify-end md:w-auto" href={resolve('/admin')}>
			<button
				class="top-5 right-5 z-50 inline-flex items-center rounded-lg bg-secondary px-4 py-2 font-medium text-foreground transition-colors hover:cursor-pointer hover:bg-secondary/80 md:absolute md:text-sm"
				>Admin</button
			>
		</a>
	{/if}

	<div class="w-full max-w-2xl">
		<SearchBar />

		<hr class="my-4 opacity-0" />

		<NowPlaying />

		<hr class="my-4 opacity-0" />

		<Queue />
	</div>
</main>
