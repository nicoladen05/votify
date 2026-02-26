<script lang="ts">
	import type { Pathname } from '$app/types';
	import { LogOutIcon, MusicIcon, TextAlignJustify } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { type Component, type Snippet } from 'svelte';
	import { page } from '$app/state';
	import { setMobileSidebarOpenButton } from '$lib/context/sidebar-context';

	type SidebarItem = {
		icon: Component;
		label: string;
		path: Pathname;
	};

	const { children, items }: { children: Snippet; items: SidebarItem[] } = $props();

	function isActive(path: string) {
		if (path === '/') return page.url.pathname === '/';

		return path === '/dashboard'
			? page.url.pathname === '/dashboard'
			: page.url.pathname.startsWith(path);
	}

	// Mobile Sidebar Logic
	let mobileSidebarOpen = $state(false);

	setMobileSidebarOpenButton(openSidebarButton);
</script>

{#snippet openSidebarButton(className: string = '')}
	<button
		aria-label="Open sidebar"
		class={`${className} md:hidden`}
		onclick={() => {
			mobileSidebarOpen = !mobileSidebarOpen;
		}}
	>
		<TextAlignJustify />
	</button>
{/snippet}

<aside
	class="fixed inset-y-0 left-0 z-50 flex w-full -translate-x-full flex-col border-r border-border bg-primary p-6 transition-transform duration-200 md:static md:z-auto md:w-60 md:translate-x-0 md:bg-secondary/50"
	class:translate-x-0={mobileSidebarOpen}
>
	<div class="mt-1.5 mb-8 flex items-center gap-2 px-2 md:mt-0">
		{#if mobileSidebarOpen}
			{@render openSidebarButton('mr-1.5')}
		{/if}
		<MusicIcon class="h-6 w-6 text-accent" />
		<span class="text-lg font-bold text-foreground">Votify</span>
	</div>
	<nav class="flex-1 space-y-1">
		{#each items as item (item.path)}
			<a
				href={resolve(item.path)}
				onclick={() => {
					mobileSidebarOpen = false;
				}}
				class={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
					isActive(item.path)
						? 'bg-secondary text-foreground'
						: 'text-muted-foreground hover:bg-secondary hover:text-foreground'
				}`}
			>
				<item.icon class="h-4 w-4" />
				{item.label}
			</a>
		{/each}
	</nav>

	<form method="POST" action="/dashboard/signOut" class="w-full">
		<button
			class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:cursor-pointer hover:bg-destructive/10 hover:text-destructive"
		>
			<LogOutIcon class="h-4 w-4" />
			Logout
		</button>
	</form>
</aside>

{@render children()}
