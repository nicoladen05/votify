<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen items-center justify-center bg-secondary">
	<div class="text-center">
		<h1 class="mb-4 text-4xl font-bold">404</h1>
		<p class="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
		<p class="mb-6 text-sm text-muted-foreground">Unknown route: {$page.url.pathname}</p>
		<a href={resolve('/landing')} class="text-accent underline hover:text-accent/90"
			>Return to Home</a
		>
	</div>
</div>
