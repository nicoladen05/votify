<script lang="ts">
	let value = '';
	let data: string | unknown[] = [];
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
			const res = await fetch(`/api/search?input=${value}`, {
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
</script>

<div
	class="flex items-center rounded-full border border-[#2a2a2a]
                bg-secondary px-4 py-2
                transition
                focus-within:border-accent focus-within:ring-2
                focus-within:ring-accent/40"
>
	<!-- Search Icon -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="mr-3 h-5 w-5 text-muted-foreground"
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
		class="w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
		bind:value
	/>
	{#if (value && data.length > 0) || loading}
		<div
			class="absolute top-full z-50 mt-1
                max-h-60
                w-full overflow-y-auto
                rounded-b-xl
                border
                border-border bg-primary shadow-lg"
		>
			{#if loading}
				<div class="p-4 text-sm text-muted-foreground">Suche...</div>
			{/if}

			{#each data as item (item.id)}
				<div
					class="cursor-pointer px-4 py-2
					text-foreground
                    transition hover:bg-secondary"
				>
					{item.name}
				</div>
			{/each}

			{#if !loading && data.length === 0}
				<div class="p-4 text-sm text-muted-foreground">Keine Ergebnisse</div>
			{/if}
		</div>
	{/if}
</div>
