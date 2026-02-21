<script lang="ts">
	import { resolve } from '$app/paths';
	import { MusicIcon } from '@lucide/svelte';
	import Button from '$lib/compenents/ui/Button.svelte';
</script>

<nav class="glass fixed top-0 right-0 left-0 z-50 border-b border-border/50">
	<div class="container mx-auto flex h-16 items-center justify-between px-4">
		<a class="flex items-center gap-2" href={resolve('/')}>
			<MusicIcon class="h-6 w-6 text-accent" />
			<span class="text-xl font-bold text-foreground">Votify</span>
		</a>
		<div class="flex items-center gap-3">
			<a href={resolve('/auth')}>
				<Button variant="ghost" size="sm">Log in</Button>
			</a>
			<a href={resolve('/auth')}>
				<Button variant="hero" size="sm">Get Started</Button>
			</a>
		</div>
	</div>
</nav>
