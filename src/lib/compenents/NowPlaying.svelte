<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';

	let { roomId } = $props();

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

		const evt = new EventSource(`/api/now-playing-sse?roomId=${roomId}`);
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

<section class="rounded-2xl border border-border bg-secondary/90 p-3">
	<div class="mb-2 flex items-center justify-between px-1">
		<p
			class={`flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase ${$playbackState.state === 'playing' ? 'text-accent  ' : ''}`}
		>
			<span
				class={`h-1.5 w-1.5 rounded-full ${$playbackState.state === 'playing' ? 'animate-pulse bg-accent' : 'hidden'}`}
			></span>
			Now Playing
		</p>
	</div>

	{#if $playbackState.state !== 'stopped'}
		<div class="flex min-h-26 gap-2 rounded-xl border border-border/80 bg-secondary p-1.5">
			<img
				src={$playbackState.song?.coverImage}
				alt="Song Cover"
				class="h-24 w-24 rounded-xl object-cover"
			/>

			<div class="mx-2 my-2 flex min-w-0 flex-1 flex-col justify-between">
				<div class="flex items-start justify-between gap-3">
					<div class="flex min-w-0 flex-col">
						<span class="truncate text-[1.1rem] font-semibold">{$playbackState.song?.title}</span>
						<span class="truncate text-sm text-muted-foreground">{$playbackState.song?.artist}</span
						>
					</div>

					<div
						class="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 text-xs text-muted-foreground"
					>
						<div class="flex h-3 items-end gap-0.5" aria-hidden="true">
							<span
								class="inline-block h-full w-0.5 origin-bottom rounded-full bg-accent motion-safe:animate-[equalizer_900ms_ease-in-out_infinite]"
								class:opacity-40={!($playbackState.state === 'playing')}
								style:animation-play-state={$playbackState.state === 'playing'
									? 'running'
									: 'paused'}
							></span>

							<span
								class="inline-block h-full w-0.5 origin-bottom rounded-full bg-accent [animation-delay:120ms] motion-safe:animate-[equalizer_850ms_ease-in-out_infinite]"
								class:opacity-40={!($playbackState.state === 'playing')}
								style:animation-play-state={$playbackState.state === 'playing'
									? 'running'
									: 'paused'}
							></span>

							<span
								class="inline-block h-full w-0.5 origin-bottom rounded-full bg-accent [animation-delay:220ms] motion-safe:animate-[equalizer_1000ms_ease-in-out_infinite]"
								class:opacity-40={!($playbackState.state === 'playing')}
								style:animation-play-state={$playbackState.state === 'playing'
									? 'running'
									: 'paused'}
							></span>
						</div>
						<span>{$playbackState.state === 'playing' ? 'Playing' : 'Paused'}</span>
					</div>
				</div>

				<div class="h-2 w-full rounded-full bg-foreground/20">
					<div
						class="bg-gradient-green h-full rounded-full"
						style="width: {$playbackState.song?.progress}%"
					></div>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex w-full items-center justify-center rounded-xl bg-primary/40 p-6">
			<h1 class="text-lg font-medium text-muted-foreground">No song is playing right now</h1>
		</div>
	{/if}
</section>
