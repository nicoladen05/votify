<script lang="ts">
	export let form;
</script>

<main class="relative flex justify-center overflow-hidden pt-6 sm:pt-8">
	<section class="flex flex-col gap-2 rounded-xl border border-border bg-secondary p-4 shadow-lg">
		<div class="mb-5 space-y-1 text-center">
			<h1 class="text-xl font-semibold text-foreground">Admin Login</h1>
		</div>

		<form class="space-y-4" method="post">
			<div class="space-y-2">
				<label for="email" class="font-medium text-foreground">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					placeholder="you@example.com"
					class="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
				/>
			</div>

			<div class="space-y-2">
				<label for="password" class="font-medium text-foreground">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					placeholder="Enter your password"
					class="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/80"
			>
				Log in
			</button>
		</form>
	</section>
</main>
