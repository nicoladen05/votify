<script lang="ts">
	import { resolve } from '$app/paths';
	import { Check, EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from '@lucide/svelte';
	import Button from '$lib/compenents/ui/Button.svelte';
	import Input from '$lib/compenents/ui/Input.svelte';

	type Mode = 'login' | 'signup';
	type AuthFormData = { error?: string } | null | undefined;

	interface Props {
		mode: Mode;
		form?: AuthFormData;
	}

	const { mode, form }: Props = $props();

	let showPassword = $state(false);

	const isLogin = $derived(mode === 'login');
	const heading = $derived(isLogin ? 'Welcome back' : 'Create your account');
	const subheading = $derived(
		isLogin ? 'Log in to manage your rooms' : 'Start hosting music rooms today'
	);
	const submitText = $derived(isLogin ? 'Log In' : 'Create Account');
	const switchPrompt = $derived(isLogin ? "Don't have an account?" : 'Already have an account?');
	const switchText = $derived(isLogin ? 'Sign up' : 'Log in');
	const switchHref = $derived(isLogin ? '/auth/signup' : '/auth/login');
</script>

<div class="rounded-2xl border border-border bg-secondary p-8 shadow-xl">
	<h2 class="mb-2 text-center text-2xl font-bold text-foreground">{heading}</h2>
	<p class="mb-8 text-center text-sm text-muted-foreground">{subheading}</p>

	<form method="POST" action="?/continueSpotify">
		<Button variant="hero-outline" class="mb-6 w-full gap-2" type="submit">
			<svg viewBox="0 0 24 24" class="h-5 w-5 fill-accent" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
				/>
			</svg>
			Continue with Spotify
		</Button>
	</form>

	<div class="relative mb-6">
		<div class="absolute inset-0 flex items-center">
			<div class="w-full border-t border-border"></div>
		</div>
		<div class="relative flex justify-center text-xs">
			<span class="bg-secondary px-4 text-muted-foreground">or continue with email</span>
		</div>
	</div>

	<form class="space-y-4" method="post" action={mode === 'login' ? '?/login' : '?/signUp'}>
		{#if !isLogin}
			<div class="relative">
				<UserIcon class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					name="username"
					placeholder="Username"
					class="bg-primary pl-10"
					required
				/>
			</div>
		{/if}

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

		<div>
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

			{#if mode === 'login'}
				<div class="mx-0.5 mt-1 flex justify-between">
					<div class="flex items-center gap-1">
						<input
							type="checkbox"
							id="remember"
							name="remember"
							class="peer h-4 w-4 appearance-none rounded-sm border border-border bg-secondary checked:bg-accent"
						/>
						<label for="remember" class="text-sm text-muted-foreground">Remember me</label>
						<Check
							class="pointer-events-none absolute h-4 w-4 text-primary opacity-0 peer-checked:opacity-100"
						/>
					</div>

					<div class="flex justify-center text-center text-sm text-muted-foreground">
						<p>
							<a href={resolve('/auth/forgot-password')} class=" text-accent hover:underline"
								>Forgot password</a
							>
						</p>
					</div>
				</div>
			{/if}
		</div>

		{#if form?.error}
			<p class="my-6 text-center text-sm text-destructive">{form.error}</p>
		{/if}

		<Button variant="hero" class="w-full" type="submit">{submitText}</Button>
	</form>

	<p class="mt-6 text-center text-sm text-muted-foreground">
		{switchPrompt}
		<a href={resolve(switchHref)} class="ml-1 font-medium text-accent hover:underline"
			>{switchText}</a
		>
	</p>
</div>
