<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		BarChart3Icon,
		CreditCardIcon,
		CrownIcon,
		LayoutDashboardIcon,
		LockIcon,
		LogOutIcon,
		MusicIcon,
		PlayIcon,
		PlusIcon,
		RadioIcon,
		Settings2Icon,
		SettingsIcon,
		SparklesIcon,
		Trash2Icon,
		ZapIcon
	} from '@lucide/svelte';
	import Button from '$lib/compenents/ui/Button.svelte';
	import CreateRoomDialog from '$lib/compenents/dashboard/CreateRoomDialog.svelte';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	type Plan = 'free' | 'pro' | 'premium';

	const { data }: PageProps = $props();

	const sidebarItems = [
		{ icon: LayoutDashboardIcon, label: 'Dashboard', path: '/dashboard' },
		{ icon: CreditCardIcon, label: 'Pricing', path: '/' },
		{ icon: SettingsIcon, label: 'Settings', path: '/dashboard' }
	] as const;

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
</script>

<div class="flex min-h-screen bg-primary">
	<aside class="hidden w-60 flex-col border-r border-border bg-secondary/50 p-4 md:flex">
		<div class="mb-8 flex items-center gap-2 px-2">
			<MusicIcon class="h-6 w-6 text-accent" />
			<span class="text-lg font-bold text-foreground">Votify</span>
		</div>
		<nav class="flex-1 space-y-1">
			{#each sidebarItems as item (item)}
				<a
					href={resolve(item.path)}
					class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
		<div class="mb-10 flex flex-wrap items-start justify-between gap-4">
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
				<div class="card-hover rounded-xl border border-border bg-secondary p-6">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="font-bold text-foreground">{room.name}</h3>
						<!-- <span
							class={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
								room.status === 'live'
									? 'bg-accent/20 text-accent'
									: 'bg-secondary text-muted-foreground'
							}`}
						>
							<span
								class={`h-1.5 w-1.5 rounded-full ${
									room.status === 'live' ? 'animate-pulse bg-accent' : 'bg-muted-foreground'
								}`}
							></span>
							{room.status === 'live' ? 'Live' : 'Offline'}
						</span> -->
					</div>
					<div class="flex items-center gap-2">
						<a href={resolve(`/room/${room.id}`)}>
							<Button variant="hero" size="sm">
								<PlayIcon class="mr-1 h-3 w-3" />
								Launch
							</Button>
						</a>
						<Button
							variant="ghost"
							size="icon"
							class="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
						>
							<Settings2Icon class="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							class="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
						>
							<BarChart3Icon class="h-4 w-4" />
						</Button>
						<form method="post" action="?/deleteRoom" use:enhance>
							<input bind:value={room.id} name="room-id" type="hidden" />
							<Button
								variant="ghost"
								type="submit"
								size="icon"
								class="hover:color-destructive h-8 w-8 text-muted-foreground hover:bg-transparent"
							>
								<Trash2Icon class="h-4 w-4" />
							</Button>
						</form>
					</div>
				</div>
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

		<div
			class="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-secondary p-6 sm:flex-row sm:items-center"
		>
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
					<RadioIcon class="h-6 w-6 text-accent" />
				</div>
				<div>
					<h3 class="font-bold text-foreground">Spotify Connection</h3>
					<p class="text-sm text-muted-foreground">
						Connect your account to start playing music in rooms.
					</p>
				</div>
			</div>
			<Button variant="hero" size="sm">Connect Spotify</Button>
		</div>

		<CreateRoomDialog
			open={isCreateRoomDialogOpen}
			onClose={closeCreateRoomDialog}
			createAction="?/createRoom"
		/>
	</main>
</div>
