<script>
	import { enhance } from '$app/forms';
	import Dialog from '../Dialog.svelte';
	import Button from '../ui/Button.svelte';
	import Input from '../ui/Input.svelte';

	let resetDialogOpen = $state(false);
	let deletionDialogOpen = $state(false);

	let deleteAccountConfirmationText = $state('');
</script>

<section class="rounded-xl border border-border bg-secondary p-4 sm:p-5 md:p-6">
	<h2 class="text-lg font-bold text-foreground">Danger Zone</h2>
	<p class="mt-1 mb-5 text-sm text-muted-foreground">Use with caution.</p>

	<div class="flex w-full flex-col gap-4 md:flex-row">
		<Button
			variant="hero-outline"
			size="md"
			class="hover:border-destructive! hover:bg-destructive/10! md:flex-1"
			type="submit"
			onclick={() => (resetDialogOpen = true)}>Reset Password</Button
		>
		<Button
			variant="destructive"
			size="md"
			class="md:flex-1"
			onclick={() => (deletionDialogOpen = true)}>Delete Account</Button
		>
	</div>
</section>

<Dialog
	title="Reset Password"
	subtitle="Are you sure you want to reset your password?"
	bind:isOpen={resetDialogOpen}
	onClose={() => {
		resetDialogOpen = false;
	}}
>
	<p>You will receive an email with instructions on how to reset your password.</p>

	<div class="mt-auto flex flex-col-reverse gap-2 pt-6 sm:flex-row sm:justify-end">
		<Button variant="hero-outline">Cancel</Button>

		<form
			method="post"
			action="?/resetPassword"
			use:enhance={() => {
				resetDialogOpen = false;
			}}
		>
			<Button variant="destructive" type="submit">Reset</Button>
		</form>
	</div>
</Dialog>

<Dialog
	title="Delete Account"
	subtitle="Are you sure you want to delete your account? This action cannot be undone."
	bind:isOpen={deletionDialogOpen}
	onClose={() => {
		deletionDialogOpen = false;
	}}
>
	<div>
		<label for="delte" class="mb-1.5 block text-sm font-medium text-foreground"
			>Type "Delete my account" to confirm.</label
		>
		<Input id="delete" bind:value={deleteAccountConfirmationText} placeholder="Delete my account" />
	</div>

	<div class="mt-auto flex flex-col-reverse gap-2 pt-6 sm:flex-row sm:justify-end">
		<Button variant="hero-outline">Cancel</Button>
		<Button variant="destructive" disabled={deleteAccountConfirmationText !== 'Delete my account'}
			>Delete</Button
		>
	</div>
</Dialog>
