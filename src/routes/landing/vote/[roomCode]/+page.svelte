<script lang="ts">
	import { MusicIcon, PlusIcon, RadioIcon, SearchIcon, ThumbsUpIcon } from '@lucide/svelte';
	import Button from '$lib/landing/components/ui/Button.svelte';
	import Input from '$lib/landing/components/ui/Input.svelte';

	type Track = {
		id: string;
		title: string;
		artist: string;
		votes: number;
		voted: boolean;
	};

	let tracks = $state<Track[]>([
		{ id: '1', title: 'Blinding Lights', artist: 'The Weeknd', votes: 12, voted: false },
		{ id: '2', title: 'Levitating', artist: 'Dua Lipa', votes: 9, voted: false },
		{ id: '3', title: 'Save Your Tears', artist: 'The Weeknd', votes: 7, voted: false },
		{ id: '4', title: "Don't Start Now", artist: 'Dua Lipa', votes: 5, voted: false },
		{ id: '5', title: 'Watermelon Sugar', artist: 'Harry Styles', votes: 3, voted: false }
	]);

	let search = $state('');

	const handleVote = (id: string) => {
		tracks = tracks
			.map((track) =>
				track.id === id
					? {
							...track,
							votes: track.voted ? track.votes - 1 : track.votes + 1,
							voted: !track.voted
						}
					: track
			)
			.sort((a, b) => b.votes - a.votes);
	};
</script>

<div class="min-h-screen bg-primary">
	<div class="sticky top-0 z-10 border-b border-border bg-secondary/80 backdrop-blur-lg">
		<div class="mx-auto max-w-lg px-4 py-4">
			<div class="mb-1 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<MusicIcon class="h-5 w-5 text-accent" />
					<span class="font-bold text-foreground">Votify</span>
				</div>
				<div class="flex items-center gap-1.5 text-xs font-medium text-accent">
					<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
					Live
				</div>
			</div>
			<h1 class="text-xl font-bold text-foreground">Friday Night Vibes</h1>
		</div>
	</div>

	<div class="mx-auto max-w-lg px-4 py-6">
		<div class="mb-8 rounded-2xl border border-border bg-secondary p-6 text-center">
			<p
				class="mb-4 flex items-center justify-center gap-2 text-xs font-bold tracking-wider text-accent uppercase"
			>
				<RadioIcon class="h-3.5 w-3.5" />
				Now Playing
			</p>
			<div
				class="glow-green-sm mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-xl bg-primary"
			>
				<MusicIcon class="h-16 w-16 text-muted-foreground" />
			</div>
			<h2 class="text-lg font-bold text-foreground">Blinding Lights</h2>
			<p class="text-sm text-muted-foreground">The Weeknd</p>
		</div>

		<div class="relative mb-6">
			<SearchIcon class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				placeholder="Search songs to add..."
				class="border-border bg-secondary pl-10"
				value={search}
				oninput={(event) => (search = (event.currentTarget as HTMLInputElement).value)}
			/>
		</div>

		<h3 class="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
			Up Next - Vote for your favorite
		</h3>
		<div class="space-y-3">
			{#each tracks as track, i (track)}
				<div
					class="flex items-center gap-4 rounded-xl border border-border bg-secondary p-4 transition-all duration-200 hover:-translate-y-0.5"
					style={`animation: fade-up 0.4s ease-out ${i * 0.05}s forwards; opacity: 0;`}
				>
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-muted-foreground"
					>
						{i + 1}
					</div>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-bold text-foreground">{track.title}</p>
						<p class="truncate text-xs text-muted-foreground">{track.artist}</p>
					</div>
					<Button
						variant={track.voted ? 'hero' : 'hero-outline'}
						size="sm"
						onclick={() => handleVote(track.id)}
						class="min-w-17.5 shrink-0 gap-1.5"
					>
						<ThumbsUpIcon class="h-3.5 w-3.5" />
						{track.votes}
					</Button>
				</div>
			{/each}
		</div>

		<Button variant="hero-outline" class="mt-6 w-full gap-2">
			<PlusIcon class="h-4 w-4" />
			Add a Song to the Queue
		</Button>
	</div>
</div>
