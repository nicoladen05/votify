<script>
	import Input from '$lib/compenents/ui/Input.svelte';
	import Button from '$lib/compenents/ui/Button.svelte';
	import { MailIcon } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	let success = $state(false);
</script>

<div class="rounded-2xl border border-border bg-secondary p-8 shadow-xl">
	{#if !success}
		<h2 class="mb-2 text-center text-2xl font-bold text-foreground">Reset Password</h2>
		<p class="mb-8 text-center text-sm text-muted-foreground">
			If you forgot your password, you can reset it here.
		</p>
		<form
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					if (result.type === 'success') success = true;
				};
			}}
		>
			<div class="relative">
				<MailIcon class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="email"
					name="email"
					placeholder="Email address"
					class="bg-primary pl-10"
					required
				/>
			</div>

			<Button type="submit" class="mt-6 w-full">Send reset link</Button>
		</form>
	{:else}
		<h2 class="mb-2 text-center text-2xl font-bold text-foreground">Success!</h2>
		<p class="mb-6 text-center text-sm text-muted-foreground">
			Password reset link sent! Check your inbox.
		</p>

		<a href={resolve('/auth/login')}>
			<Button class="w-full">Return to login</Button>
		</a>
	{/if}
</div>
