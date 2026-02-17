<script lang="ts">
	const { data } = $props();
</script>

<div class="flex gap-1 rounded-xl border border-border bg-secondary p-1">
	<img src={data.image} alt="Song Cover" class="h-24 w-24 rounded-lg object-cover" />

	<div class="mx-2 my-3 flex w-full flex-col justify-between">
		<div class="flex">
			<div class="flex flex-col">
				<span class="text-[1.2rem]">{data.title}</span>
				<span class="text-muted-foreground">{data.artist}</span>
			</div>
		</div>

		<!-- Progress Bar -->
		<div class="h-2 w-full rounded-full bg-foreground/20">
			<div class="h-full rounded-full bg-accent" style="width: {data.progress}%"></div>
		</div>
	</div>
</div>
