<script lang="ts">
	import { resolve } from '$app/paths';
	import { MusicIcon } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<div class="relative flex min-h-screen items-center justify-center bg-primary p-4">
	<div
		class="pointer-events-none absolute top-1/3 left-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-[100px]"
	></div>

	<div class="animate-scale-in relative w-full max-w-md">
		<div class="mb-8 text-center">
			<a class="inline-flex cursor-pointer items-center gap-2" href={resolve('/')}>
				<MusicIcon class="h-8 w-8 text-accent" />
				<span class="text-2xl font-bold text-foreground">Votify</span>
			</a>
		</div>

		{@render children()}
	</div>
</div>
