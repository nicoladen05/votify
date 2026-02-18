<script lang="ts">
	import { ChevronUp, ChevronDown } from '@lucide/svelte';

	type QueueSong = {
		id: string;
		image: string;
		title: string;
		artist: string;
		votes: number;
		userVote: 'up' | 'down' | null;
	};

	// Example data (no logic yet)
	const queue: QueueSong[] = [
		{
			id: '1',
			image: 'https://picsum.photos/seed/spotify-queue-1/200/200',
			title: 'Midnight City',
			artist: 'M83',
			votes: 12,
			userVote: 'up'
		},
		{
			id: '2',
			image: 'https://picsum.photos/seed/spotify-queue-2/200/200',
			title: 'Instant Crush',
			artist: 'Daft Punk (feat. Julian Casablancas)',
			votes: 8,
			userVote: null
		},
		{
			id: '3',
			image: 'https://picsum.photos/seed/spotify-queue-3/200/200',
			title: '505',
			artist: 'Arctic Monkeys',
			votes: 3,
			userVote: 'down'
		},
		{
			id: '4',
			image: 'https://picsum.photos/seed/spotify-queue-4/200/200',
			title: 'Breathe',
			artist: 'Telepopmusik',
			votes: 1,
			userVote: null
		}
	];
</script>

<div class="rounded-xl border border-border bg-secondary p-2">
	<div class="mb-2 flex items-center justify-between px-2">
		<h2 class="text-[1.1rem]">Up Next</h2>
		<span class="bg-background rounded-full px-2 py-1 text-xs text-muted-foreground">
			{queue.length} songs
		</span>
	</div>

	<div class="flex flex-col gap-1">
		{#each queue as song, i (song.id)}
			<div class="flex items-center gap-2 rounded-xl border border-border bg-secondary p-1">
				<!-- Cover -->
				<img
					src={song.image}
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
								class="rounded-md p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
								aria-label="Upvote"
							>
								<ChevronUp class="h-4 w-4" />
							</button>

							<span class="w-8 text-center text-xs text-muted-foreground">
								{song.votes}
							</span>

							<button
								type="button"
								class="rounded-md p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
								aria-label="Downvote"
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
