<script lang="ts">
	import { getMobileSidebarOpenButton } from '$lib/context/sidebar-context';
	import type { PageProps } from './$types';
	import AccountSettings from '$lib/compenents/settings/AccountSettings.svelte';
	import SpotifyAccounts from '$lib/compenents/settings/SpotifyAccounts.svelte';
	import DangerZone from '$lib/compenents/settings/DangerZone.svelte';

	const { data }: PageProps = $props();

	const openSidebarButton = getMobileSidebarOpenButton();
</script>

<div class="mx-auto w-full max-w-5xl">
	<div class="flex items-start gap-6">
		{@render openSidebarButton('mt-1.5')}
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-foreground md:text-4xl">Settings</h1>
			<p class="text-muted-foreground">Manage your account details and linked Spotify profiles.</p>
		</div>
	</div>

	<div class="space-y-6">
		<AccountSettings currentAccountData={data.accountData} />

		<SpotifyAccounts />

		<DangerZone />
	</div>
</div>
