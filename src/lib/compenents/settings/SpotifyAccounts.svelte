<script lang="ts">
	import { Link2OffIcon, PlusIcon, UserRoundIcon } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';

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
</script>

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
