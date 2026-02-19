<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';

	type PlaybackState = {
		state: 'playing' | 'paused' | 'stopped';
		song?: {
			trackId: string;
			title: string;
			artist: string;
			coverImage: string;
			duration: number;
			progress: number; // 0-100
		};
	};

	const playbackState = writable<PlaybackState>({ state: 'stopped' });

	let animationFrame: number;
	let baseProgress = 0;
	let baseTime = 0;

	function updateProgress() {
		playbackState.update((state) => {
			if (state.state === 'playing' && state.song) {
				const elapsed = Date.now() - baseTime;
				const progressMs = baseProgress + elapsed;
				const progress = Math.min((progressMs / state.song.duration) * 100, 100);

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

		const evt = new EventSource('/api/now-playing-sse');
		evt.onmessage = (e) => {
			const data: PlaybackState = JSON.parse(e.data);
			playbackState.set(data);

			if (data.song) {
				baseProgress = (data.song.progress / 100) * data.song.duration;
				baseTime = Date.now();
			}
		};

		updateProgress();

		return () => {
			evt.close();
			cancelAnimationFrame(animationFrame);
		};
	});
</script>

<div class="flex min-h-26 gap-1 rounded-xl border border-border bg-secondary p-1">
	{#if $playbackState.state !== 'stopped'}
		<img
			src={$playbackState.song?.coverImage}
			alt="Song Cover"
			class="h-24 w-24 rounded-lg object-cover"
		/>

		<div class="mx-2 my-3 flex w-full flex-col justify-between">
			<div class="flex items-start justify-between gap-3">
				<div class="flex flex-col">
					<span class="text-[1.2rem]">{$playbackState.song?.title}</span>
					<span class="text-muted-foreground">{$playbackState.song?.artist}</span>
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
					style="width: {$playbackState.song?.progress}%"
				></div>
			</div>
		</div>
	{:else}
		<div class="flex w-full items-center justify-center">
			<h1 class="text-[1.4rem]">No Song Playing</h1>
		</div>
	{/if}
</div>
