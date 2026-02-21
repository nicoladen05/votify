<script lang="ts">
	import { Search } from '@lucide/svelte';
	interface Track {
		uri: string;
		image: string | null;
		name: string;
		artist: string;
		context: string;
		id: string;
	}
	let value = $state('');
	let data: Track[] = $state([]);
	let loading = $state(false);
	let timeout: NodeJS.Timeout;
	let controller: AbortController;
	let visible = $state(false);

	$effect(() => {
		const val = value;

		visible = true;
		clearTimeout(timeout);
		timeout = setTimeout(async () => {
			if (val) {
				await search();
			}
		}, 300);
	});

	async function search() {
		if (controller) controller.abort();
		controller = new AbortController();
		loading = true;
		if (value.length <= 2) return;
		try {
			const res = await fetch(`/api/search?q=${value}&limit=5`, {
				signal: controller.signal
			});
			const results = await res.json();
			data = results;
		} catch (err: unknown) {
			if (err instanceof DOMException && err.name === 'AbortError') {
				return;
			}

			console.error(err);
		} finally {
			loading = false;
		}
	}
	async function handleClick(
		uri: string,
		id: string,
		img: string | null,
		title: string,
		artist: string
	) {
		await fetch(`/api/queue?uri=${uri}&id=${id}&img=${img}&title=${title}&artist=${artist}`, {
			method: 'POST'
		});
		visible = false;
	}

	function windowClick() {
		visible = false;
	}

	function searchBarClick() {
		if (value) visible = true;
	}
</script>

<svelte:window onclick={windowClick} />

<div
	class="relative w-full"
	onclick={(e) => {
		e.stopPropagation();
		searchBarClick();
	}}
	onkeydown={(event) => {
		if (event.key === 'Esc' || event.key === 'Escape') visible = false;
	}}
	role="button"
	tabindex="0"
>
	<div
		class="flex items-center gap-2.5 rounded-2xl border border-border bg-secondary px-4 py-3 transition-all duration-200 focus-within:border-accent/45 focus-within:bg-secondary/90"
	>
		<div class="rounded-lg border border-border bg-primary p-1.5 text-muted-foreground">
			<Search class="h-4 w-4" />
		</div>

		<input
			type="text"
			placeholder="Search songs to add..."
			bind:value
			class="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
		/>
	</div>

	{#if value && visible}
		<div
			class="animate-scale-in absolute top-full left-0 z-50 mt-2 max-h-76 w-full overflow-y-auto rounded-2xl border border-border bg-primary p-1.5 shadow-2xl backdrop-blur"
			style="
           		scrollbar-color: var(--accent-color) transparent;
                scrollbar-width: thin;
            "
		>
			{#if loading}
				<div class="p-4 text-sm text-muted-foreground">Searching...</div>
			{:else if data.length > 0}
				{#each data as item (item.uri)}
					<div
						class="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-150 hover:border-border hover:bg-secondary"
						onclick={() => {
							handleClick(item.uri, item.id, item.image, item.name, item.artist);
						}}
						onkeydown={() => {}}
						aria-label="Add Song to queue"
						role="button"
						tabindex="0"
					>
						{#if item.image}
							<img src={item.image} alt={item.name} class="h-11 w-11 rounded-lg object-cover" />
						{/if}
						<div class="flex min-w-0 flex-col">
							<span class="truncate text-sm font-semibold text-foreground">{item.name}</span>
							<span class="truncate text-xs text-muted-foreground">
								{item.artist} • {item.context}
							</span>
						</div>
					</div>
				{/each}
			{:else}
				<div class="p-4 text-sm text-muted-foreground">No results</div>
			{/if}
		</div>
	{/if}
</div>
