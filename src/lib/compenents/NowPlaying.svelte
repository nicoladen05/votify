<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment'; // nur im Browser

	// Lokaler State für die Komponente
	const playbackState = writable({
		state: 'stopped',
		song: {
			title: '',
			artist: '',
			coverImage: '',
			duration: 0, // in ms
			progress: 0 // 0-100 (%)
		}
	});

	let pollInterval: ReturnType<typeof setInterval>;
	let animationFrame: number;

	let baseProgress = 0;
	let baseTime = 0;
	let crossFadeBase = 0;

	// Polling: ruft /api/now-playing alle 5 Sekunden ab
	async function fetchNowPlaying() {
		try {
			const res = await fetch('/api/now-playing');
			const data = await res.json();

			if (!data) return;

			playbackState.update((prev) => {
				// Trackwechsel erkennen
				if (data.song.title !== prev.song.title) {
					crossFadeBase = 0;
					baseTime = Date.now();
				}
				baseProgress = (data.song.progress / 100) * data.song.duration; // progress in ms

				return {
					state: data.state,
					song: {
						...data.song
					}
				};
			});
		} catch (err) {
			console.error(err);
		}
	}

	// Progressbar Animation / Aktualisierung
	function updateProgress() {
		playbackState.update((state) => {
			if (state.state === 'playing') {
				const elapsed = Date.now() - baseTime;
				const progressMs = baseProgress + elapsed;
				const progress = Math.min((progressMs / state.song.duration) * 100, 100);

				if (progressMs >= state.song.duration && crossFadeBase === 0) {
					crossFadeBase = Date.now();
				}
				if (crossFadeBase > 0 && Date.now() - crossFadeBase > 3000) {
					crossFadeBase = Date.now();
					fetchNowPlaying();
				}
				// neues Objekt zurückgeben für Reaktivität
				return {
					...state,
					song: {
						...state.song,
						progress
					}
				};
			}
			return state;
		});

		if (browser) animationFrame = requestAnimationFrame(updateProgress);
	}

	onMount(() => {
		if (!browser) return;

		// sofort initial fetch
		fetchNowPlaying();

		// Polling alle 5 Sekunden
		pollInterval = setInterval(fetchNowPlaying, 5000);

		// Animation / Progressbar starten
		updateProgress();
	});

	onDestroy(() => {
		if (!browser) return;
		clearInterval(pollInterval);
		cancelAnimationFrame(animationFrame);
	});
</script>

<div class="flex min-h-26 gap-1 rounded-xl border border-border bg-secondary p-1">
	{#if $playbackState.state !== 'stopped'}
		<img
			src={$playbackState.song.coverImage}
			alt="Song Cover"
			class="h-24 w-24 rounded-lg object-cover"
		/>

		<div class="mx-2 my-3 flex w-full flex-col justify-between">
			<div class="flex items-start justify-between gap-3">
				<div class="flex flex-col">
					<span class="text-[1.2rem]">{$playbackState.song.title}</span>
					<span class="text-muted-foreground">{$playbackState.song.artist}</span>
				</div>

				<!-- Playing Animation -->
				<div
					class="bg-background flex items-center gap-2 rounded-full px-2 py-1 text-xs text-muted-foreground"
				>
					<div class="flex h-3 items-end gap-0.5" aria-hidden="true">
						<span
							class="inline-block h-full w-0.5 origin-bottom rounded-full bg-accent motion-safe:animate-[equalizer_900ms_ease-in-out_infinite]"
							class:opacity-40={!($playbackState.state === 'playing')}
							style:animation-play-state={$playbackState.state === 'playing' ? 'running' : 'paused'}
						></span>

						<span
							class="inline-block h-full w-0.5 origin-bottom rounded-full bg-accent [animation-delay:120ms] motion-safe:animate-[equalizer_850ms_ease-in-out_infinite]"
							class:opacity-40={!($playbackState.state === 'playing')}
							style:animation-play-state={$playbackState.state === 'playing' ? 'running' : 'paused'}
						></span>

						<span
							class="inline-block h-full w-0.5 origin-bottom rounded-full bg-accent [animation-delay:220ms] motion-safe:animate-[equalizer_1000ms_ease-in-out_infinite]"
							class:opacity-40={!($playbackState.state === 'playing')}
							style:animation-play-state={$playbackState.state === 'playing' ? 'running' : 'paused'}
						></span>
					</div>
					<span>{$playbackState.state === 'playing' ? 'Playing...' : 'Paused'}</span>
				</div>
			</div>

			<!-- Progress Bar -->
			<div class="h-2 w-full rounded-full bg-foreground/20">
				<div
					class="h-full rounded-full bg-accent"
					style="width: {$playbackState.song.progress}%"
				></div>
			</div>
		</div>
	{:else}
		<div class="flex w-full items-center justify-center">
			<h1 class="text-[1.4rem]">No Song Playing</h1>
		</div>
	{/if}
</div>
