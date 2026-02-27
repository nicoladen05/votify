<script lang="ts">
	import { Link2OffIcon, PlusIcon } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';
	import { spotifyAuthUrl } from '$lib';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	let {
		onSelect = () => {},
		selected = $bindable(NaN),
		isSettings = false,
		spotifyAccounts,
		roomid = null
	} = $props();
</script>

<section class="rounded-lg border border-border bg-secondary p-4 sm:p-5 md:p-6">
	<div class="mb-5 flex flex-wrap justify-between gap-3 sm:gap-4">
		{#if isSettings}
			<div>
				<h2 class="text-lg font-bold text-foreground">Spotify Accounts</h2>
				<p class="mt-1 text-sm text-muted-foreground">
					You can link multiple Spotify accounts to your profile.
				</p>
			</div>
		{/if}
		{#if page.url.pathname.includes('settings')}
			<Button
				onclick={() => {
					window.location.href = spotifyAuthUrl + '&state=' + page.url.pathname;
				}}
				variant="hero"
				size="sm"
				class="w-full sm:w-auto"
			>
				<PlusIcon class="h-4 w-4" />
				Add Account
			</Button>
		{/if}
	</div>

	<div class="space-y-2.5">
		{#each spotifyAccounts as account (account.id)}
			{#if isSettings}
				{@render accountlistItem(account, false)}
			{:else}
				<form
					method="post"
					action="?/selectAccount"
					use:enhance={async ({ formData, cancel }) => {
						const id = formData.get('account-id') as string;
						selected = parseInt(id); // optimistic UI update
						if (!roomid) cancel();

						return ({ result, update }) => {
							if (result.type === 'success') {
								update();
								onSelect();
							}
						};
					}}
				>
					<input type="hidden" value={account.id} name="account-id" />
					<input type="hidden" value={roomid} name="room-id" />
					<button type="submit" class="w-full text-left">
						{@render accountlistItem(account, account.id === selected)}
					</button>
				</form>
			{/if}
		{/each}
	</div>
</section>

{#snippet accountlistItem(
	account: {
		account_name: string;
		account_mail: string;
		connectedAt: string;
		account_img: string;
		account_id: string;
	},
	isSelected: boolean
)}
	<div
		class={`rounded-lg border p-3 transition-colors
			${isSelected ? 'border-green-500 bg-green-500/10' : 'border-border bg-primary'}`}
	>
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-3">
				<!-- Profile Picture -->
				<div class="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
					<img
						src={account.account_img}
						alt="User avatar"
						class="h-9 w-9 rounded-full object-cover"
					/>
				</div>

				<!-- Keine Ahnung ob account_mail hier geht, sonst connectedAt -->
				<div>
					<p class="text-sm font-semibold text-foreground">{account.account_name}</p>
					<p class="text-xs text-muted-foreground">{account.account_mail}</p>
				</div>
			</div>

			<div class="flex items-center justify-between gap-2 sm:justify-start">
				<p class="text-xs text-muted-foreground">{account.connectedAt}</p>
				{#if isSettings}
					<form method="post" action="?/unlinkSpotify" use:enhance>
						<input type="hidden" name="account-id" value={account.account_id} />
						<Button
							type="submit"
							variant="ghost"
							size="icon"
							class="h-8 w-8"
							aria-label="Unlink account"
						>
							<Link2OffIcon class="h-4 w-4" />
						</Button>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/snippet}
