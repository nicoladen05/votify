<script lang="ts">
	import { browser } from '$app/environment';
	import { ChevronUp, ChevronDown } from '@lucide/svelte';
	import { onMount } from 'svelte';

	type QueueSong = {
		song_uri: string;
		song_id: string;
		img_url: string;
		title: string;
		artist: string;
		upvotes: number;
		downvotes: number;
	};

	let queue = $state<QueueSong[]>([]);

	async function fetchQueue() {
		const response = await fetch('/api/queue');
		queue = await response.json();
	}

	// Refresh queue every 5 seconds
	onMount(() => {
		const interval = setInterval(async () => {
			fetchQueue();
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	});

	// Refresh queue on state change
	$effect(() => {
		if (!browser) return;

		const votes = userVotes;
		if (!votes) return;

		fetchQueue();
	});

	let userVotes = $state<Record<string, 'upvote' | 'downvote' | undefined>>({});

	const vote = async (id: string, type: 'upvote' | 'downvote') => {
		if (userVotes[id] !== type) {
			// User wants to upvote but has already downvoted
			if (type === 'upvote' && userVotes[id] == 'downvote') {
				await fetch(`/api/queue/vote?song_id=${id}&type=downvote&action=remove`, {
					method: 'POST'
				});
			} // User wants to downvote but has already upvoted
			else if (type === 'downvote' && userVotes[id] == 'upvote') {
				await fetch(`/api/queue/vote?song_id=${id}&type=upvote&action=remove`, { method: 'POST' });
			}

			await fetch(`/api/queue/vote?song_id=${id}&type=${type}&action=add`, {
				method: 'POST'
			});

			userVotes = { ...userVotes, [id]: type };
		} else {
			// User has already voted this option, remove their vote
			await fetch(`/api/queue/vote?song_id=${id}&type=${type}&action=remove`, {
				method: 'POST'
			});

			userVotes = { ...userVotes, [id]: undefined };
		}
	};
</script>

<div class="rounded-xl border border-border bg-secondary p-2">
	<div class="mb-2 flex items-center justify-between px-2">
		<h2 class="text-[1.1rem]">Up Next</h2>
		<span class="bg-background rounded-full px-2 py-1 text-xs text-muted-foreground">
			{queue.length} songs
		</span>
	</div>

	<div class="flex flex-col gap-1">
		{#each queue as song, i (song.song_id)}
			<div class="flex items-center gap-2 rounded-xl border border-border bg-secondary p-1">
				<!-- Cover -->
				<img
					src={song.img_url}
					alt={`${song.title} cover`}
					class="h-16 w-16 rounded-lg object-cover"
				/>

				<!-- Main -->
				<div class="flex w-full items-center justify-between gap-3 px-1">
					<div class="flex min-w-0 flex-col">
						<div class="flex items-center gap-2">
							<span class="text-xs text-muted-foreground">#{i + 1}</span>
							<span class="truncate text-[1rem]">{song.title}</span>
						</div>
						<span class="truncate text-sm text-muted-foreground">{song.artist}</span>
					</div>

					<!-- Votes -->
					<div class="flex shrink-0 items-center gap-2">
						<div class="bg-background flex items-center rounded-full px-2 py-1">
							<button
								type="button"
								class="rounded-lg p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
								class:bg-accent={userVotes[song.song_id] === 'upvote'}
								aria-label="Upvote"
								onclick={() => vote(song.song_id, 'upvote')}
							>
								<ChevronUp class="h-4 w-4" />
							</button>

							<span class="w-8 text-center text-xs text-muted-foreground">
								{song.upvotes - song.downvotes}
							</span>

							<button
								type="button"
								class="rounded-lg p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
								class:bg-accent={userVotes[song.song_id] === 'downvote'}
								aria-label="Downvote"
								onclick={() => vote(song.song_id, 'downvote')}
							>
								<ChevronDown class="h-4 w-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		{/each}

		{#if queue.length === 0}
			<div
				class="flex min-h-20 items-center justify-center rounded-xl border border-border bg-secondary"
			>
				<h3 class="text-[1.1rem]">Queue is empty</h3>
			</div>
		{/if}
	</div>
</div>
