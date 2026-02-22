<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		class: className = '',
		value: value = $bindable(),
		type = 'text',
		...rest
	}: HTMLInputAttributes = $props();
</script>

<input
	{type}
	bind:value
	class={`h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none ${className}`}
	{...rest}
/>
