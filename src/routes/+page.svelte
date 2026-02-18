<script lang="ts">
	import NowPlaying from '$lib/compenents/NowPlaying.svelte';
	import Queue from '$lib/compenents/Queue.svelte';
	import SearchBar from '$lib/compenents/SearchBar.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<main class="flex justify-center px-4 pt-6 sm:pt-8">
	<div class="w-full max-w-2xl">
		<SearchBar />

		<hr class="my-4 opacity-0" />

		<NowPlaying {data} />

		<hr class="my-4 opacity-0" />

		<Queue />
	</div>
</main>
