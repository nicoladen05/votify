<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen items-center justify-center bg-background">
	<div class="text-center">
		<h1 class="mb-4 text-4xl font-bold">{page.status}</h1>
		<p class="mb-4 text-xl text-muted-foreground">
			{page.status === 404 ? 'Oops! Page not found' : 'Server error'}
		</p>
		<p class="mb-6 text-sm text-muted-foreground">
			{page.error?.message ?? 'Something went wrong'}
		</p>
		<a href={resolve('/landing')} class="text-accent underline hover:text-accent/90"
			>Return to Home</a
		>
	</div>
</div>
