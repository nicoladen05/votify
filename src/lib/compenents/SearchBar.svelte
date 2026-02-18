<script lang="ts">
	interface Track {
		uri: string;
		image: string | null;
		name: string;
		artist: string;
		context: string;
	}
	let value = '';
	let data: Track[] = [];
	let loading = false;
	let timeout: NodeJS.Timeout;
	let controller: AbortController;

	$: {
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
		try {
			const res = await fetch(`/api/search?q=${value}&limit=5`, {
				signal: controller.signal
			});
			const results = await res.json();
			data = results;
			console.log(data);
		} catch (err: unknown) {
			if (err instanceof DOMException && err.name === 'AbortError') {
				return;
			}

			console.error(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="relative w-full">
	<!-- Input Wrapper -->
	<div
		class="flex items-center rounded-full border px-4 py-2 transition"
		style="border-color: var(--border-color); background-color: var(--secondary-color);"
	>
		<!-- Search Icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="mr-3 h-5 w-5 text-[var(--muted-foreground-color)]"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>

		<!-- Input Field -->
		<input
			type="text"
			placeholder="Suchen..."
			bind:value
			class="w-full bg-transparent focus:outline-none"
			style="color: var(--foreground-color); caret-color: var(--accent-color);"
		/>
	</div>

	<!-- Dropdown -->
	{#if value}
		<div
			class="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-b-xl border shadow-lg"
			style="border-color: var(--border-color); background-color: var(--primary-color);"
		>
			{#if loading}
				<div class="p-4 text-sm" style="color: var(--muted-foreground-color)">Suche...</div>
			{:else if data.length > 0}
				{#each data as item (item.uri)}
					<div
						class="flex cursor-pointer items-center gap-3 px-4 py-2 transition"
						style="color: var(--foreground-color);"
					>
						{#if item.image}
							<img src={item.image} alt={item.name} class="h-10 w-10 rounded" />
						{/if}
						<div class="flex flex-col">
							<span class="font-medium">{item.name}</span>
							<span class="text-sm" style="color: var(--muted-foreground-color)">
								{item.artist} • {item.context}
							</span>
						</div>
					</div>
				{/each}
			{:else}
				<div class="p-4 text-sm" style="color: var(--muted-foreground-color)">Keine Ergebnisse</div>
			{/if}
		</div>
	{/if}
</div>
