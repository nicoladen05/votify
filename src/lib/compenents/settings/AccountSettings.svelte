<script lang="ts">
	import { MailIcon, SaveIcon, UserRoundIcon } from '@lucide/svelte';
	import Input from '../ui/Input.svelte';
	import Button from '../ui/Button.svelte';
	import { enhance } from '$app/forms';
	import Dialog from '../Dialog.svelte';

	type AccountData = { username: string; email: string };

	const { currentAccountData }: { currentAccountData: Promise<{ name: string; email: string }> } =
		$props();

	// svelte-ignore state_referenced_locally
	currentAccountData.then((user) => {
		initialAccountData = {
			username: user.name,
			email: user.email
		};
		accountData = {
			username: user.name,
			email: user.email
		};
		accountDataLoaded = true;
	});

	let initialAccountData: AccountData = $state({
		username: 'Loading...',
		email: 'Loading...'
	});

	let accountData: AccountData = $state({
		username: 'Loading...',
		email: 'Loading...'
	});

	let accountDataLoaded = $state(false);

	const isUsernameChanged = $derived(initialAccountData.username !== accountData.username);
	const isEmailChanged = $derived(initialAccountData.email !== accountData.email);

	let emailChangedDialogOpen = $state(false);
</script>

<section class="rounded-xl border border-border bg-secondary p-4 sm:p-5 md:p-6">
	<h2 class="mb-5 text-lg font-bold text-foreground">Account Management</h2>

	<form
		class="space-y-4"
		method="POST"
		action="?/updateAccount"
		use:enhance={() => {
			return async ({ update }) => {
				if (isEmailChanged) emailChangedDialogOpen = true;

				update({ reset: false });
				initialAccountData = { ...accountData };
			};
		}}
	>
		<div class="flex w-full flex-col gap-4 md:flex-row">
			<div class="w-full">
				<label for="username" class="mb-1.5 block text-sm font-medium text-foreground"
					>Username</label
				>
				<div class="relative">
					<UserRoundIcon
						class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
					/>

					<Input
						id="username"
						name="username"
						type="text"
						bind:value={accountData.username}
						disabled={!accountDataLoaded}
						class="bg-primary px-10 focus:ring-0"
					/>
				</div>
			</div>

			<div class="w-full">
				<label for="email" class="mb-1.5 block text-sm font-medium text-foreground">Email</label>
				<div class="relative">
					<MailIcon
						class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						id="email"
						type="email"
						name="email"
						bind:value={accountData.email}
						disabled={!accountDataLoaded}
						class="bg-primary px-10 focus:ring-0"
					/>
				</div>
			</div>
		</div>

		<div class="flex gap-4 pt-2">
			<Button
				variant="hero"
				size="sm"
				type="submit"
				class="ml-auto w-full md:w-auto"
				disabled={!isUsernameChanged && !isEmailChanged}
			>
				<SaveIcon class="h-4 w-4" />
				Save Account Changes
			</Button>
		</div>
	</form>
</section>

<Dialog
	title="Email Changed"
	subtitle="Please confirm your email change."
	bind:isOpen={emailChangedDialogOpen}
	onClose={() => (emailChangedDialogOpen = false)}
>
	<p class="mb-5">
		Please confirm your new email using the link that has been sent to you. Until you confirm your
		new email, the old email will continue to be used.
	</p>

	<Button
		variant="hero"
		class="ml-auto w-full md:w-auto"
		onclick={() => (emailChangedDialogOpen = false)}
	>
		Confirm
	</Button>
</Dialog>
