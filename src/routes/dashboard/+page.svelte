<script lang="ts">
	import { CrownIcon, LockIcon, PlusIcon, SparklesIcon, ZapIcon } from '@lucide/svelte';
	import Button from '$lib/compenents/ui/Button.svelte';
	import CreateRoomDialog from '$lib/compenents/dashboard/CreateRoomDialog.svelte';
	import type { PageProps } from './$types';
	import { getMobileSidebarOpenButton } from '$lib/context/sidebar-context';
	import RoomCard from '$lib/compenents/dashboard/RoomCard.svelte';

	type Plan = 'free' | 'pro' | 'premium';

	const { data }: PageProps = $props();

	const rooms = $derived(data.rooms);

	const plan: Plan = 'premium';

	const planBadges = {
		free: { label: 'Free', icon: ZapIcon, color: 'bg-secondary text-muted-foreground' },
		pro: { label: 'Pro', icon: CrownIcon, color: 'bg-accent/20 text-accent' },
		premium: { label: 'Premium', icon: SparklesIcon, color: 'bg-accent/20 text-accent' }
	};

	const badge = planBadges[plan];
	// const maxRooms = plan === 'free' ? 1 : plan === 'pro' ? 5 : Number.POSITIVE_INFINITY;
	const maxRooms = 5;

	let isCreateRoomDialogOpen = $state(false);

	function openCreateRoomDialog() {
		isCreateRoomDialogOpen = true;
	}

	function closeCreateRoomDialog() {
		isCreateRoomDialogOpen = false;
	}

	const openSidebarButton = getMobileSidebarOpenButton();
</script>

<div class="flex w-full items-start gap-6">
	{@render openSidebarButton('mt-1.5')}
	<div class="mb-10 flex w-full flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="mb-1 text-3xl font-bold text-foreground">Welcome back 👋</h1>
			<p class="text-muted-foreground">Manage your music rooms and settings.</p>
		</div>
		<div
			class={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${badge.color}`}
		>
			<badge.icon class="h-3.5 w-3.5" />
			{badge.label} Plan
		</div>
	</div>
</div>

<div class="mb-6 flex items-center justify-between">
	<h2 class="text-xl font-bold text-foreground">My Rooms</h2>
	<Button
		variant="hero"
		size="sm"
		disabled={rooms.length >= maxRooms}
		onclick={openCreateRoomDialog}
	>
		<PlusIcon class="mr-1 h-4 w-4" />
		Create Room
	</Button>
</div>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each rooms as room (room)}
		<RoomCard {room} spotifyAccounts={data.spotifyTokens} action="?/deleteRoom" />
	{/each}

	{#if rooms.length >= maxRooms}
		<div
			class="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/50 p-6 text-center"
		>
			<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
				<LockIcon class="h-5 w-5 text-muted-foreground" />
			</div>
			<p class="mb-3 text-sm font-medium text-muted-foreground">Upgrade to create more rooms</p>
			<Button variant="hero-outline" size="sm">
				<CrownIcon class="mr-1 h-3 w-3" />
				Upgrade Plan
			</Button>
		</div>
	{/if}
</div>
<CreateRoomDialog
	bind:isOpen={isCreateRoomDialogOpen}
	spotifyAccounts={data.spotifyTokens}
	onClose={closeCreateRoomDialog}
	createAction="?/createRoom"
/>
