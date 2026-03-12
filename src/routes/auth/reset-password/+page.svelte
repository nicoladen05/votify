<script lang="ts">
	import Button from '$lib/compenents/ui/Button.svelte';
	import Input from '$lib/compenents/ui/Input.svelte';
	import { EyeIcon, EyeOffIcon, LockIcon } from '@lucide/svelte';

	let showPassword = $state(false);

	const { form }: { form?: { error: string } | null | undefined } = $props();
</script>

<div class="rounded-2xl border border-border bg-secondary p-8 shadow-xl">
	<h2 class="mb-2 text-center text-2xl font-bold text-foreground">Reset Password</h2>
	<p class="mb-8 text-center text-sm text-muted-foreground">Choose your new password.</p>

	<form method="POST">
		<div class="space-y-4">
			<div class="relative">
				<LockIcon class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type={showPassword ? 'text' : 'password'}
					name="password"
					placeholder="Password"
					class="bg-primary pr-10 pl-10"
					required
				/>
				<button
					type="button"
					onclick={() => (showPassword = !showPassword)}
					class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
					aria-label="Toggle password visibility"
				>
					{#if showPassword}
						<EyeOffIcon class="h-4 w-4" />
					{:else}
						<EyeIcon class="h-4 w-4" />
					{/if}
				</button>
			</div>
		</div>

		{#if form?.error}
			<p class="mt-6 text-center text-sm text-destructive">{form.error}</p>
		{/if}

		<Button variant="hero" type="submit" class="mt-6 w-full">Set new password</Button>
	</form>
</div>
