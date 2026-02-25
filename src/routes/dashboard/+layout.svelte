<script lang="ts">
	import type { LayoutProps } from './$types';
	import { LayoutDashboardIcon, SettingsIcon } from '@lucide/svelte';
	import type { Pathname } from '$app/types';
	import type { Component } from 'svelte';
	import Sidebar from '$lib/compenents/dashboard/Sidebar.svelte';

	type SidebarItem = {
		icon: Component;
		label: string;
		path: Pathname;
	};

	let { children }: LayoutProps = $props();

	const sidebarItems: SidebarItem[] = [
		{ icon: LayoutDashboardIcon, label: 'Dashboard', path: '/dashboard' },
		{ icon: SettingsIcon, label: 'Settings', path: '/dashboard/settings' }
	];
</script>

<div class="flex min-h-screen bg-primary">
	<Sidebar items={sidebarItems}>
		<main class="flex-1 overflow-auto p-6 md:p-10">
			{@render children()}
		</main>
	</Sidebar>
</div>
