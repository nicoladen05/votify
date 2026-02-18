<script lang="ts">
	const { data } = $props();
</script>

<div class="flex min-h-26 gap-1 rounded-xl border border-border bg-secondary p-1">
	{#if data.title}
		<img src={data.image} alt="Song Cover" class="h-24 w-24 rounded-lg object-cover" />

		<div class="mx-2 my-3 flex w-full flex-col justify-between">
			<div class="flex items-start justify-between gap-3">
				<div class="flex flex-col">
					<span class="text-[1.2rem]">{data.title}</span>
					<span class="text-muted-foreground">{data.artist}</span>
				</div>

				<!-- Playing Animation -->
				<div
					class="bg-background flex items-center gap-2 rounded-full px-2 py-1 text-xs text-muted-foreground"
				>
					<div class="flex h-3 items-end gap-0.5" aria-hidden="true">
						<span
							class="inline-block h-full w-0.5 origin-bottom rounded-sm bg-accent motion-safe:animate-[equalizer_900ms_ease-in-out_infinite]"
							class:opacity-40={!data.is_playing}
							class:[animation-play-state:paused]={!data.is_playing}
						></span>

						<span
							class="inline-block h-full w-0.5 origin-bottom rounded-sm bg-accent [animation-delay:120ms] motion-safe:animate-[equalizer_850ms_ease-in-out_infinite]"
							class:opacity-40={!data.is_playing}
							class:[animation-play-state:paused]={!data.is_playing}
						></span>

						<span
							class="inline-block h-full w-0.5 origin-bottom rounded-sm bg-accent [animation-delay:220ms] motion-safe:animate-[equalizer_1000ms_ease-in-out_infinite]"
							class:opacity-40={!data.is_playing}
							class:[animation-play-state:paused]={!data.is_playing}
						></span>
					</div>
					<span>{data.is_playing ? 'Playing...' : 'Paused'}</span>
				</div>
			</div>

			<!-- Progress Bar -->
			<div class="h-2 w-full rounded-full bg-foreground/20">
				<div class="h-full rounded-full bg-accent" style="width: {data.progress}%"></div>
			</div>
		</div>
	{:else}
		<div class="flex w-full items-center justify-center">
			<h1 class="text-[1.4rem]">No Song Playing</h1>
		</div>
	{/if}
</div>
