<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { qr } from '@svelte-put/qr/svg';
	import {
		ArrowLeftIcon,
		CheckIcon,
		CopyIcon,
		ExternalLinkIcon,
		FileExclamationPoint,
		KeyRound,
		RadioIcon
	} from '@lucide/svelte';
	import Button from '$lib/compenents/ui/Button.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const votePath = $derived(`/room/${$page.params.roomId}/guest`);

	let copied = $state(false);
	let roomLink = $state('');

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
			{#if data.room.status === 'live'}
				<div
					class="glow-green-sm animate-glow-pulse mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-bold text-accent"
				>
					<span class="h-2 w-2 animate-pulse rounded-full bg-accent"></span>
					Room is Live
				</div>
			{:else if data.room.status === 'offline'}
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-2 text-sm font-bold text-muted-foreground"
				>
					<span class="h-2 w-2 rounded-full bg-muted-foreground"></span>
					Room is unable to play
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

				<a class="w-full" href={resolve(`/room/${$page.params.roomId}/guest`)}>
					<Button variant="hero" class="w-full">
						<ExternalLinkIcon class="mr-2 h-4 w-4" />
						Open Guest View
					</Button>
				</a>
			</div>
		</div>

		<div
			class="rounded-2xl border border-border bg-secondary p-6"
			style="animation: fade-up 0.6s ease-out 0.2s forwards; opacity: 0;"
		>
			{#if data.room.status === 'missing_credentials'}
				<h3
					class="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-muted-foreground uppercase"
				>
					Credentials Missing
				</h3>

				<div class="flex items-center gap-4">
					<div class="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
						<KeyRound class="h-8 w-8 text-muted-foreground" />
					</div>
					<div>
						<p class="font-bold text-foreground">Waiting for credentials...</p>
						<p class="text-sm text-muted-foreground">
							Please log in to your Spotify account to start playing music
						</p>
					</div>
				</div>
			{:else}
				<h3
					class="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-muted-foreground uppercase"
				>
					<RadioIcon class="h-4 w-4 text-accent" />
					Now Playing
				</h3>
				<div class="flex items-center gap-4">
					<div class="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
						<RadioIcon class="h-8 w-8 text-muted-foreground" />
					</div>
					<div>
						<p class="font-bold text-foreground">Waiting for votes...</p>
						<p class="text-sm text-muted-foreground">The top-voted track will play next</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
