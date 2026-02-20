<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import {
		ArrowLeftIcon,
		CheckIcon,
		CopyIcon,
		ExternalLinkIcon,
		QrCodeIcon,
		RadioIcon
	} from '@lucide/svelte';
	import Button from '$lib/landing/components/ui/Button.svelte';

	const shortCode = $derived($page.params.roomId === '1' ? 'abc123' : $page.params.roomId);
	const votePath = $derived(`/landing/vote/${shortCode}`);

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
			href={resolve('/landing/dashboard')}
			class="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeftIcon class="h-4 w-4" />
			Back to Dashboard
		</a>

		<div class="mb-10 text-center" style="animation: fade-up 0.6s ease-out forwards;">
			<div
				class="glow-green-sm animate-glow-pulse mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-bold text-accent"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-accent"></span>
				Room is Live
			</div>
			<h1 class="mb-2 text-3xl font-bold text-foreground">Friday Night Vibes</h1>
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
					<QrCodeIcon class="h-24 w-24 text-muted-foreground" />
				</div>

				<div class="w-full">
					<p class="mb-2 block text-xs text-muted-foreground">Room Link</p>
					<div class="flex items-center gap-2 rounded-lg border border-border bg-primary p-3">
						<code class="flex-1 truncate text-sm text-foreground">{roomLink || votePath}</code>
						<Button variant="ghost" size="sm" class="shrink-0" onclick={copyLink}>
							{#if copied}
								<CheckIcon class="h-4 w-4 text-accent" />
							{:else}
								<CopyIcon class="h-4 w-4" />
							{/if}
							{copied ? 'Copied' : 'Copy'}
						</Button>
					</div>
				</div>

				<a class="w-full" href={resolve('/landing/vote/abc123')}>
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
		</div>
	</div>
</div>
