<script lang="ts">
	import { KeyRoundIcon, MailIcon, SaveIcon, UserRoundIcon } from '@lucide/svelte';
	import Input from '../ui/Input.svelte';
	import Button from '../ui/Button.svelte';
	import { enhance } from '$app/forms';

	type AccountData = { username: string; email: string; password: string };

	const { currentAccountData }: { currentAccountData: Promise<{ name: string; email: string }> } =
		$props();

	// svelte-ignore state_referenced_locally
	currentAccountData.then((user) => {
		initialAccountData = {
			username: user.name,
			email: user.email,
			password: ''
		};
		accountData = {
			username: user.name,
			email: user.email,
			password: ''
		};
		accountDataLoaded = true;
	});

	let initialAccountData: AccountData = $state({
		username: 'Loading...',
		email: 'Loading...',
		password: ''
	});

	let accountData: AccountData = $state({
		username: 'Loading...',
		email: 'Loading...',
		password: ''
	});

	let accountDataLoaded = $state(false);

	const isChanged = $derived(JSON.stringify(initialAccountData) !== JSON.stringify(accountData));
</script>

<section class="rounded-xl border border-border bg-secondary p-4 sm:p-5 md:p-6">
	<h2 class="mb-5 text-lg font-bold text-foreground">Account Management</h2>

	<form
		class="space-y-4"
		method="POST"
		action="?/updateAccount"
		use:enhance={() => {
			return async ({ update }) => {
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

		<div>
			<label for="password" class="mb-1.5 block text-sm font-medium text-foreground"
				>New password</label
			>
			<div class="relative">
				<KeyRoundIcon
					class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					id="password"
					type="password"
					name="password"
					placeholder="Enter a new password"
					bind:value={accountData.password}
					class="bg-primary px-10 focus:ring-0"
				/>
			</div>
		</div>

		<div class="flex pt-2">
			<Button
				variant="hero"
				size="sm"
				type="submit"
				class="ml-auto w-full md:w-auto"
				disabled={!isChanged}
			>
				<SaveIcon class="h-4 w-4" />
				Save Account Changes
			</Button>
		</div>
	</form>
</section>
