<script lang="ts">
	import { LayoutDashboardIcon, LogOutIcon, MusicIcon, SettingsIcon } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import type { Component } from 'svelte';

	let { children } = $props();

	type SidebarItem = {
		icon: Component;
		label: string;
		path: Pathname;
	};

	const sidebarItems: SidebarItem[] = [
		{ icon: LayoutDashboardIcon, label: 'Dashboard', path: '/dashboard' },
		{ icon: SettingsIcon, label: 'Settings', path: '/dashboard/settings' }
	];

	function isActive(path: string) {
		if (path === '/') return page.url.pathname === '/';

		return path === '/dashboard'
			? page.url.pathname === '/dashboard'
			: page.url.pathname.startsWith(path);
	}
</script>

<div class="flex min-h-screen bg-primary">
	<aside class="hidden w-60 flex-col border-r border-border bg-secondary/50 p-4 md:flex">
		<div class="mb-8 flex items-center gap-2 px-2">
			<MusicIcon class="h-6 w-6 text-accent" />
			<span class="text-lg font-bold text-foreground">Votify</span>
		</div>
		<nav class="flex-1 space-y-1">
			{#each sidebarItems as item (item.path)}
				<a
					href={resolve(item.path)}
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
		<a
			href={resolve('/')}
			class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
		>
			<LogOutIcon class="h-4 w-4" />
			Logout
		</a>
	</aside>

	<main class="flex-1 overflow-auto p-6 md:p-10">
		{@render children()}
	</main>
</div>
