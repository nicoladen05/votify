<script lang="ts">
	import { browser } from '$app/environment';
	import { ChevronUp, ChevronDown } from '@lucide/svelte';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	type QueueSong = {
		song_uri: string;
		song_id: string;
		img_url: string;
		title: string;
		artist: string;
		score: number;
	};

	let queue = $state<QueueSong[]>([]);
	let votingClosed = $state(false);

	// State to trigger css animation classes
	let voteFeedback = $state<Record<string, 'upvote' | 'downvote' | undefined>>({});
	let movedSongs = $state<Record<string, 'up' | 'down' | undefined>>({});

	function animateVoteButton(id: string, type: 'upvote' | 'downvote') {
		// Remove the animation class, so the animation can play on add
		voteFeedback = { ...voteFeedback, [id]: undefined };

		// Reapply the class to start the animation
		voteFeedback = { ...voteFeedback, [id]: type };

		// After 450ms, remove the class again
		setTimeout(() => {
			if (voteFeedback[id] !== type) return;
			const next = { ...voteFeedback };
			delete next[id];
			voteFeedback = next;
		}, 450);
	}

	function animateSongMove(nextQueue: QueueSong[]) {
		// Store the current song positions in the queue
		const previousPositions = new Map(queue.map((song, index) => [song.song_id, index]));

		const moved: Record<string, 'up' | 'down'> = {};
		for (const [index, song] of nextQueue.entries()) {
			const previousIndex = previousPositions.get(song.song_id);
			if (previousIndex === undefined || previousIndex === index) continue;

			// If the position of the song changed, add it to moved
			moved[song.song_id] = index < previousIndex ? 'up' : 'down';
		}

		// Return of no song moved
		if (Object.keys(moved).length === 0) return;

		// Add css classes to the songs that moved to start the animation
		movedSongs = { ...movedSongs, ...moved };

		// Remove the classes again after the animation is done
		for (const [songId, direction] of Object.entries(moved)) {
			setTimeout(() => {
				if (movedSongs[songId] !== direction) return;
				const next = { ...movedSongs };
				delete next[songId];
				movedSongs = next;
			}, 650);
		}
	}

	async function fetchQueue() {
		const response = await fetch('/api/queue');
		const { queueItems, isClosed } = await response.json();

		votingClosed = isClosed;

		const nextQueue: QueueSong[] = queueItems;
		animateSongMove(queueItems);
		queue = nextQueue;
	}

	async function getVotes() {
		const res = await fetch('/api/queue/vote');
		const data = await res.json();
		for (const vote of data) {
			userVotes[vote.song_id] = vote.is_upvote ? 'upvote' : 'downvote';
		}
	}

	// Refresh queue every 5 seconds
	onMount(() => {
		getVotes();
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

		const closed = votingClosed;
		const votes = userVotes;
		if (!votes || closed === null) return;

		fetchQueue();
	});

	let userVotes = $state<Record<string, 'upvote' | 'downvote' | undefined>>({});

	const vote = async (id: string, type: 'upvote' | 'downvote') => {
		if (votingClosed && queue[0]?.song_id === id) return;

		if (userVotes[id] !== type) {
			const is_upvote = type === 'upvote';
			// User wants to change vote
			if (!userVotes[id]) {
				await fetch('/api/queue/vote', {
					method: 'POST',
					body: JSON.stringify({
						song_id: id,
						is_upvote: is_upvote
					})
				});
			} // User hasn't voted anything and votes
			else {
				await fetch('/api/queue/vote', {
					method: 'PATCH',
					body: JSON.stringify({
						song_id: id,
						is_upvote: is_upvote
					})
				});
			}

			userVotes = { ...userVotes, [id]: type };
		} else {
			// User takes back vote
			await fetch('/api/queue/vote', {
				method: 'DELETE',
				body: JSON.stringify({
					song_id: id
				})
			});

			userVotes = { ...userVotes, [id]: undefined };
		}
		animateVoteButton(id, type);
	};
</script>

<div class="rounded-xl border border-border bg-secondary p-2">
	<div class="mb-2 flex items-center justify-between px-2">
		<h2 class="text-[1.1rem]">Up Next</h2>

		{#if votingClosed}
			<div
				class="ml-auto rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold tracking-wide text-foreground uppercase"
			>
				Voting Closed
			</div>
		{/if}

		<span class="bg-background rounded-full px-2 py-1 text-xs text-muted-foreground">
			{queue.length} songs
		</span>
	</div>

	<div class="flex flex-col gap-1">
		{#each queue as song, i (song.song_id)}
			<div
				class="relative flex items-center gap-2 rounded-xl border border-border bg-secondary p-1"
				class:queue-move-up={movedSongs[song.song_id] === 'up'}
				class:queue-move-down={movedSongs[song.song_id] === 'down'}
				animate:flip={{ duration: 420, easing: cubicOut }}
			>
				<!-- Cover -->
				<img
					src={song.img_url}
					alt={`${song.title} cover`}
					class="h-16 w-16 rounded-lg object-cover"
				/>

				<!-- Main -->
				<div class="flex min-w-0 flex-1 items-center justify-between gap-3 px-1">
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
								disabled={votingClosed}
								class:cursor-not-allowed={votingClosed}
								class:opacity-50={votingClosed}
								class:queue-vote-up={voteFeedback[song.song_id] === 'upvote'}
								aria-label="Upvote"
								onclick={() => vote(song.song_id, 'upvote')}
							>
								<ChevronUp class="h-4 w-4" />
							</button>

							<span class="w-8 text-center text-xs text-muted-foreground">
								{song.score}
							</span>

							<button
								type="button"
								class="rounded-lg p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
								class:bg-destructive={userVotes[song.song_id] === 'downvote'}
								disabled={votingClosed}
								class:cursor-not-allowed={votingClosed}
								class:opacity-50={votingClosed}
								class:queue-vote-down={voteFeedback[song.song_id] === 'downvote'}
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
