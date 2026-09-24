<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/compenents/ui/Button.svelte';
</script>

<div class="rounded-2xl border border-border bg-secondary p-8 shadow-xl">
	<h2 class="mb-2 text-center text-2xl font-bold text-foreground">Signup Complete</h2>
	<p class="mb-8 text-center text-sm text-muted-foreground">
		Please check your email for a verification link.
	</p>

	<a href={resolve('/auth/login')}>
		<Button variant="hero" class="w-full">Return to login</Button>
	</a>
</div>
