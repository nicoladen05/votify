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
	let value = '';
	let data: Track[] = [];
	let loading = false;
	let timeout: NodeJS.Timeout;
	let controller: AbortController;
	let visible = false;

	$: {
		visible = true;
		clearTimeout(timeout);
		timeout = setTimeout(async () => {
			if (value) {
				await search();
			}
		}, 300);
	}

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
	async function handleClick(uri: string, id: string) {
		await fetch(`/api/queue?uri=${uri}&id=${id}`, {
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
	onkeydown={() => {}}
	role="button"
	tabindex="0"
>
	<!-- Input Wrapper -->
	<div
		class="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 transition"
	>
		<!-- Search Icon -->
		<Search />

		<!-- Input Field -->
		<input
			type="text"
			placeholder="Suchen..."
			bind:value
			class="w-full bg-transparent focus:outline-none"
		/>
	</div>

	<!-- Dropdown -->
	{#if value && visible}
		<div
			class="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-b-xl border border-border bg-primary shadow-lg"
			style="
          		scrollbar-color: var(--accent-color) transparent;
                scrollbar-width: thin;
            "
		>
			{#if loading}
				<div class="p-4 text-sm text-muted-foreground">Suche...</div>
			{:else if data.length > 0}
				{#each data as item (item.uri)}
					<div
						class="flex cursor-pointer items-center gap-3 px-4 py-2 transition"
						onclick={() => {
							handleClick(item.uri, item.id);
						}}
						onkeydown={() => {}}
						aria-label="Add Song to queue"
						role="button"
						tabindex="0"
					>
						{#if item.image}
							<img src={item.image} alt={item.name} class="h-10 w-10 rounded" />
						{/if}
						<div class="flex flex-col">
							<span class="font-medium">{item.name}</span>
							<span class="text-sm text-muted-foreground">
								{item.artist} • {item.context}
							</span>
						</div>
					</div>
				{/each}
			{:else}
				<div class="p-4 text-sm text-muted-foreground">Keine Ergebnisse</div>
			{/if}
		</div>
	{/if}
</div>
