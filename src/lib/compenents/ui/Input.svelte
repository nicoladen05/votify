<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		class: className = '',
		type = 'text',
		...rest
	}: HTMLInputAttributes = $props();
</script>

<input
	{type}
	class={`h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ${className}`}
	{...rest}
/>
