<script lang="ts">
	import { resolve } from '$app/paths';
	import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, MusicIcon, User } from '@lucide/svelte';
	import Button from '$lib/landing/components/ui/Button.svelte';
	import Input from '$lib/landing/components/ui/Input.svelte';

	let isLogin = $state(true);
	let showPassword = $state(false);
</script>

<div class="relative flex min-h-screen items-center justify-center bg-primary p-4">
	<div
		class="pointer-events-none absolute top-1/3 left-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-[100px]"
	></div>

	<div class="animate-scale-in relative w-full max-w-md">
		<div class="mb-8 text-center">
			<a class="inline-flex cursor-pointer items-center gap-2" href={resolve('/landing')}>
				<MusicIcon class="h-8 w-8 text-accent" />
				<span class="text-2xl font-bold text-foreground">Votify</span>
			</a>
		</div>

		<div class="rounded-2xl border border-border bg-secondary p-8 shadow-xl">
			<h2 class="mb-2 text-center text-2xl font-bold text-foreground">
				{isLogin ? 'Welcome back' : 'Create your account'}
			</h2>
			<p class="mb-8 text-center text-sm text-muted-foreground">
				{isLogin ? 'Log in to manage your rooms' : 'Start hosting music rooms today'}
			</p>

			<a href={resolve('/landing/dashboard')}>
				<Button variant="hero-outline" class="mb-6 w-full gap-2">
					<svg viewBox="0 0 24 24" class="h-5 w-5 fill-accent" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
						/>
					</svg>
					Continue with Spotify
				</Button>
			</a>

			<div class="relative mb-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-border"></div>
				</div>
				<div class="relative flex justify-center text-xs">
					<span class="bg-secondary px-4 text-muted-foreground">or continue with email</span>
				</div>
			</div>

			<form class="space-y-4" method="post">
				<input type="hidden" name="action" value={isLogin ? 'login' : 'signup'} />
				{#if !isLogin}
					<div class="relative">
						<User class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="username"
							name="username"
							placeholder="Username"
							class="bg-primary pl-10"
							required
						/>
					</div>
				{/if}
				<div class="relative">
					<MailIcon
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						type="email"
						name="email"
						placeholder="Email address"
						class="bg-primary pl-10"
						required
					/>
				</div>
				<div class="relative">
					<LockIcon
						class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
					/>
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
					>
						{#if showPassword}
							<EyeOffIcon class="h-4 w-4" />
						{:else}
							<EyeIcon class="h-4 w-4" />
						{/if}
					</button>
				</div>
				<Button variant="hero" class="w-full" type="submit">
					{isLogin ? 'Log In' : 'Create Account'}
				</Button>
			</form>

			<p class="mt-6 text-center text-sm text-muted-foreground">
				{isLogin ? "Don't have an account?" : 'Already have an account?'}
				<button
					onclick={() => (isLogin = !isLogin)}
					class="ml-1 font-medium text-accent hover:underline"
				>
					{isLogin ? 'Sign up' : 'Log in'}
				</button>
			</p>
		</div>
	</div>
</div>
