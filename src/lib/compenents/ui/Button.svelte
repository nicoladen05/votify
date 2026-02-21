<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'hero' | 'hero-outline' | 'ghost';
	type Size = 'xs' | 'sm' | 'md' | 'lg' | 'icon';

	let {
		variant = 'hero',
		size = 'md',
		class: className = '',
		type = 'button',
		children,
		...rest
	}: HTMLButtonAttributes & { variant?: Variant; size?: Size; children?: Snippet } = $props();

	const variantClasses: Record<Variant, string> = {
		hero: 'bg-accent text-primary hover:bg-accent/85',
		'hero-outline':
			'border border-border bg-transparent text-foreground hover:border-accent hover:bg-accent/10',
		ghost: 'bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground'
	};

	const sizeClasses: Record<Size, string> = {
		xs: 'h-5 px-4 text-sm',
		sm: 'h-9 px-4 text-sm',
		md: 'h-10 px-4 text-sm',
		lg: 'h-12 px-6 text-base',
		icon: 'h-10 w-10'
	};
</script>

<button
	{type}
	class={`inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-200 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
	{...rest}
>
	{@render children?.()}
</button>
