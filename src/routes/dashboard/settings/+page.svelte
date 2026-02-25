<script lang="ts">
	import {
		KeyRoundIcon,
		Link2OffIcon,
		MailIcon,
		PlusIcon,
		SaveIcon,
		UserRoundIcon
	} from '@lucide/svelte';
	import Button from '$lib/compenents/ui/Button.svelte';
	import Input from '$lib/compenents/ui/Input.svelte';
	import { getMobileSidebarOpenButton } from '$lib/context/sidebar-context';

	const spotifyAccounts = [
		{
			name: 'Nico Main',
			email: 'nico.main@spotify.mock',
			connectedAt: 'Connected 3 days ago'
		},
		{
			name: 'Workout Vibes',
			email: 'workout.vibes@spotify.mock',
			connectedAt: 'Connected 2 weeks ago'
		},
		{
			name: 'Sunday Chill',
			email: 'sunday.chill@spotify.mock',
			connectedAt: 'Connected 1 month ago'
		}
	];

	const openSidebarButton = getMobileSidebarOpenButton();
</script>

<div class="mx-auto w-full max-w-5xl">
	<div class="flex items-start gap-6">
		{@render openSidebarButton('mt-1.5')}
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-foreground md:text-4xl">Settings</h1>
			<p class="text-muted-foreground">Manage your account details and linked Spotify profiles.</p>
		</div>
	</div>

	<div class="space-y-6">
		<section class="rounded-xl border border-border bg-secondary p-4 sm:p-5 md:p-6">
			<h2 class="mb-5 text-lg font-bold text-foreground">Account Management</h2>

			<form class="space-y-4">
				<div class="flex w-full flex-col gap-4 md:flex-row">
					<div class="w-full">
						<label for="username" class="mb-1.5 block text-sm font-medium text-foreground"
							>Username</label
						>
						<div class="relative">
							<UserRoundIcon
								class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input id="username" type="text" value="nico" class="bg-primary px-10 focus:ring-0" />
						</div>
					</div>

					<div class="w-full">
						<label for="email" class="mb-1.5 block text-sm font-medium text-foreground">Email</label
						>
						<div class="relative">
							<MailIcon
								class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								id="email"
								type="email"
								value="nico@votify.app"
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
							placeholder="Enter a new password"
							class="bg-primary px-10 focus:ring-0"
						/>
					</div>
				</div>

				<div class="flex pt-2">
					<Button variant="hero" size="sm" class="ml-auto w-full md:w-auto">
						<SaveIcon class="h-4 w-4" />
						Save Account Changes
					</Button>
				</div>
			</form>
		</section>

		<section class="rounded-xl border border-border bg-secondary p-4 sm:p-5 md:p-6">
			<div class="mb-5 flex flex-wrap justify-between gap-3 sm:gap-4">
				<div>
					<h2 class="text-lg font-bold text-foreground">Spotify Accounts</h2>
					<p class="mt-1 text-sm text-muted-foreground">
						You can link multiple Spotify accounts to your profile.
					</p>
				</div>
				<Button variant="hero" size="sm" class="w-full sm:w-auto">
					<PlusIcon class="h-4 w-4" />
					Add Account
				</Button>
			</div>

			<div class="space-y-2.5">
				{#each spotifyAccounts as account (account.email)}
					<div class="rounded-lg border border-border bg-primary p-3">
						<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div class="flex items-center gap-3">
								<!-- Profile Picture -->
								<div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/80">
									<UserRoundIcon class="h-4 w-4 text-muted-foreground" />
								</div>

								<!-- Keine Ahnung ob Email hier geht, sonst connectedAt -->
								<div>
									<p class="text-sm font-semibold text-foreground">{account.name}</p>
									<p class="text-xs text-muted-foreground">{account.email}</p>
								</div>
							</div>

							<div class="flex items-center justify-between gap-2 sm:justify-start">
								<p class="text-xs text-muted-foreground">{account.connectedAt}</p>
								<Button variant="ghost" size="icon" class="h-8 w-8" aria-label="Unlink account">
									<Link2OffIcon class="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>
