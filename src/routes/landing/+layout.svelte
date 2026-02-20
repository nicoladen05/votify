<script lang="ts">
	let { children } = $props();
</script>

<div class="min-h-screen bg-primary text-foreground">
	{@render children()}
</div>
