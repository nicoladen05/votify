<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { qr } from '@svelte-put/qr/svg';
	import {
		ArrowLeftIcon,
		CheckIcon,
		CopyIcon,
		ExternalLinkIcon,
		KeyRound,
		PlayIcon,
		RadioIcon
	} from '@lucide/svelte';
	import Button from '$lib/compenents/ui/Button.svelte';
	import type { PageProps } from './$types';
	import NowPlaying from '$lib/compenents/NowPlaying.svelte';
	import Dialog from '$lib/compenents/Dialog.svelte';
	import { enhance } from '$app/forms';
	import SpotifyAccounts from '$lib/compenents/settings/SpotifyAccounts.svelte';
	const { data }: PageProps = $props();

	const votePath = $derived(`/room/${data.room.roomid}/guest`);
	const hasCredentials = $derived(data.room.status !== 'missing_credentials');

	let copied = $state(false);
	let roomLink = $state('');
	let RoomState = $derived(data.room.status);
	let isOpen = $state(false);
	onMount(() => {
		roomLink = `${window.location.origin}${votePath}`;
	});

	const copyLink = async () => {
		await navigator.clipboard.writeText(roomLink || votePath);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	};

	function openDialog() {
		isOpen = true;
	}

	function closeDialog() {
		isOpen = false;
	}
</script>

<div class="min-h-screen bg-primary p-4 md:p-10">
	<div class="mx-auto max-w-2xl">
		<a
			href={resolve('/dashboard')}
			class="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeftIcon class="h-4 w-4" />
			Back to Dashboard
		</a>

		<div class="mb-10 text-center" style="animation: fade-up 0.6s ease-out forwards;">
			{#if RoomState === 'live'}
				<div
					class="glow-green-sm animate-glow-pulse mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-bold text-accent"
				>
					<span class="h-2 w-2 animate-pulse rounded-full bg-accent"></span>
					Room is Live
				</div>
			{:else if RoomState === 'offline'}
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-2 text-sm font-bold text-muted-foreground"
				>
					<span class="h-2 w-2 rounded-full bg-muted-foreground"></span>
					Room is offline
				</div>
			{:else}
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full bg-destructive/20 px-4 py-2 text-sm font-bold text-destructive"
				>
					<span class="h-2 w-2 rounded-full bg-destructive"></span>
					Room is unable to play
				</div>
			{/if}

			<h1 class="mb-2 text-3xl font-bold text-foreground">{data.room.name}</h1>
			<p class="text-muted-foreground">Share the link or QR code with your guests</p>
		</div>

		<div
			class="mb-6 rounded-2xl border border-border bg-secondary p-8"
			style="animation: fade-up 0.6s ease-out 0.1s forwards; opacity: 0;"
		>
			<div class="flex flex-col items-center gap-6">
				<div
					class="flex h-48 w-48 items-center justify-center rounded-2xl border border-border bg-primary"
				>
					<svg
						class="p-2 text-foreground"
						use:qr={{
							data: roomLink,
							shape: 'circle'
						}}
					/>
				</div>

				<div class="w-full">
					<p class="mb-2 block text-xs text-muted-foreground">Room Link</p>
					<div class="flex items-center gap-2 rounded-lg border border-border bg-primary p-3">
						<code class="flex-1 truncate text-sm text-foreground">{roomLink || votePath}</code>
						<Button variant="ghost" size="xs" class="h-8 shrink-0" onclick={copyLink}>
							{#if copied}
								<CheckIcon class="h-4 w-4 text-accent" />
							{:else}
								<CopyIcon class="h-4 w-4" />
							{/if}
							{copied ? 'Copied' : 'Copy'}
						</Button>
					</div>
				</div>
				{#if RoomState === 'offline'}
					<form method="post" action="?/launchRoom" class="w-full">
						<Button variant="hero" class="w-full">
							<PlayIcon class="mr-2 h-4 w-4" />
							Launch
						</Button>
					</form>
				{:else}
					<a class="w-full" href={resolve(`/room/${data.room.roomid}/guest`)}>
						<Button variant="hero" class="w-full">
							<ExternalLinkIcon class="mr-2 h-4 w-4" />
							Open Guest View
						</Button>
					</a>
				{/if}
			</div>
		</div>

		<div
			class="flex flex-col gap-4 rounded-2xl border border-border bg-secondary p-6"
			style="animation: fade-up 0.6s ease-out 0.2s forwards; opacity: 0; will-change: opacity, transform;"
		>
			{#if hasCredentials}
				<div>
					<h3
						class="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-muted-foreground uppercase"
					>
						<RadioIcon class="h-4 w-4 text-accent" />
						Now Playing
					</h3>
					<NowPlaying roomId={data.room.roomid} isGuest={false} />
				</div>
			{/if}
			<div>
				<h2
					class="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-muted-foreground uppercase"
				>
					<KeyRound class="h-4 w-4 text-accent" />
					{#if hasCredentials}
						Spotify Account
					{:else}
						Credentials Missing
					{/if}
				</h2>
				<div
					class=" flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-secondary p-6 sm:flex-row sm:items-center"
				>
					<div class="flex items-center gap-4">
						{#if !hasCredentials}
							<div
								class="flex min-h-12 min-w-12 items-center justify-center rounded-full bg-accent/10"
							>
								<RadioIcon class="h-6 w-6 text-accent" />
							</div>
							<div>
								<h3 class="font-bold text-nowrap text-foreground">Spotify Connection</h3>
								<p class="line-clamp-2 text-sm text-muted-foreground">
									Connect your account to start playing music in rooms.
								</p>
							</div>
						{:else}
							<div class="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
								<img
									src={data.user?.account_img}
									alt="User avatar"
									class="h-12 w-12 rounded-full object-cover"
								/>
							</div>
							<div>
								<p class="font-bold text-foreground">{data.user?.account_name}</p>
								<p class="text-sm text-muted-foreground">Authorized Spotify account</p>
							</div>
						{/if}
					</div>

					{#if !hasCredentials}
						<Button
							class="w-full text-nowrap md:w-auto"
							variant="hero"
							size="sm"
							onclick={openDialog}>Connect Spotify</Button
						>
					{:else}
						<form method="post" action="?/logoutSpotify" class="flex justify-end" use:enhance>
							<input type="hidden" value={data.room.roomid} name="room-id" />
							<Button type="submit" variant="destructive" class="text-nowrap" size="sm"
								>Disconnect Spotify</Button
							>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<Dialog bind:isOpen onClose={closeDialog}>
	<SpotifyAccounts spotifyAccounts={data.spotifyAccounts} />
</Dialog>
