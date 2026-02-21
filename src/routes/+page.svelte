<script lang="ts">
	import {
		ArrowRightIcon,
		CheckIcon,
		MusicIcon,
		QrCodeIcon,
		RadioIcon,
		SparklesIcon,
		UsersIcon,
		VoteIcon,
		ZapIcon
	} from '@lucide/svelte';
	import LandingFooter from '$lib/compenents/LandingFooter.svelte';
	import LandingHeader from '$lib/compenents/LandingHeader.svelte';
	import Button from '$lib/compenents/ui/Button.svelte';

	import { resolve } from '$app/paths';

	const steps = [
		{
			icon: MusicIcon,
			title: 'Create a Room',
			desc: 'Set up your music room in seconds with a custom name and settings.'
		},
		{
			icon: RadioIcon,
			title: 'Connect Spotify',
			desc: 'Link your Spotify account to access your playlists and library.'
		},
		{
			icon: QrCodeIcon,
			title: 'Share & Play',
			desc: 'Share a link or QR code. Guests vote, you play the winners.'
		}
	];

	const features = [
		{
			icon: VoteIcon,
			title: 'Real-time Voting',
			desc: 'Guests upvote tracks live. Top votes play next.'
		},
		{
			icon: RadioIcon,
			title: 'Spotify Integration',
			desc: 'Seamless playback from your Spotify account.'
		},
		{
			icon: ZapIcon,
			title: 'Live Queue Updates',
			desc: 'Watch the queue shift in real-time as votes come in.'
		},
		{
			icon: QrCodeIcon,
			title: 'QR Code Access',
			desc: 'Instant room access - no downloads, no sign-ups.'
		},
		{
			icon: UsersIcon,
			title: 'Multiple Rooms',
			desc: 'Host multiple rooms for different vibes. Pro+'
		},
		{
			icon: SparklesIcon,
			title: 'Smart Filtering',
			desc: 'Filter explicit content and set genre boundaries. Coming soon.'
		}
	];

	const plans = [
		{
			name: 'Free',
			price: '$0',
			period: 'forever',
			features: [
				'1 Room',
				'Basic voting',
				'Spotify connect',
				'QR code sharing',
				'Limited analytics'
			],
			cta: 'Get Started',
			highlight: false
		},
		{
			name: 'Pro',
			price: '$9',
			period: '/month',
			features: [
				'5 Rooms',
				'Advanced controls',
				'Custom room names',
				'Room themes',
				'Priority support'
			],
			cta: 'Go Pro',
			highlight: true
		},
		{
			name: 'Premium',
			price: '$24',
			period: '/month',
			features: [
				'Unlimited rooms',
				'Advanced moderation',
				'Voting weight controls',
				'Party analytics',
				'Branding removal'
			],
			cta: 'Go Premium',
			highlight: false
		}
	];

	const scrollToHowItWorks = () => {
		document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
	};
</script>

<div class="min-h-screen bg-primary">
	<LandingHeader />

	<section class="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
		<div
			class="animate-glow-pulse pointer-events-none absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[120px]"
		></div>

		<div class="relative z-10 container mx-auto px-4 text-center">
			<div class="mx-auto max-w-3xl" style="animation: fade-up 0.8s ease-out forwards;">
				<!-- <div
					class="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm text-accent"
				>
					<SparklesIcon class="h-3.5 w-3.5" />
					Powered by Spotify
				</div> -->
				<h1
					class="mb-6 text-5xl leading-tight font-black tracking-tight text-foreground md:text-7xl"
				>
					Let Your Guests <br /> <span class="text-gradient-green">Control the Music.</span>
				</h1>
				<p class="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
					Create a Spotify-powered voting room for your party in seconds. No downloads, no sign-ups
					for guests - just great music, chosen together.
				</p>
				<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
					<a href={resolve('/auth')}>
						<Button variant="hero" size="lg" class="px-8 py-6 text-base">
							Create Your Room
							<ArrowRightIcon class="ml-2 h-5 w-5" />
						</Button>
					</a>
					<Button
						variant="hero-outline"
						size="lg"
						class="px-8 py-6 text-base"
						onclick={scrollToHowItWorks}>See How It Works</Button
					>
				</div>
			</div>
		</div>
	</section>

	<section id="how-it-works" class="border-t border-border/30 py-24">
		<div class="container mx-auto px-4">
			<h2 class="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">How It Works</h2>
			<p class="mx-auto mb-16 max-w-lg text-center text-muted-foreground">
				Three simple steps to transform any gathering into a collaborative music experience.
			</p>
			<div class="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
				{#each steps as step, i (step)}
					<div
						class="group text-center"
						style={`animation: fade-up 0.6s ease-out ${i * 0.15}s forwards; opacity: 0;`}
					>
						<div
							class="group-hover:glow-green-sm mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-200 group-hover:bg-accent/20"
						>
							<svelte:component this={step.icon} class="h-7 w-7" />
						</div>
						<div class="mb-2 text-sm font-bold text-accent">Step {i + 1}</div>
						<h3 class="mb-2 text-xl font-bold text-foreground">{step.title}</h3>
						<p class="text-sm text-muted-foreground">{step.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="border-t border-border/30 py-24">
		<div class="container mx-auto px-4">
			<h2 class="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
				Everything You Need
			</h2>
			<p class="mx-auto mb-16 max-w-lg text-center text-muted-foreground">
				Powerful features to make every party unforgettable.
			</p>
			<div class="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature, i (feature)}
					<div
						class="card-hover rounded-xl border border-border bg-secondary p-6"
						style={`animation: fade-up 0.5s ease-out ${i * 0.1}s forwards; opacity: 0;`}
					>
						<div
							class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent"
						>
							<svelte:component this={feature.icon} class="h-5 w-5" />
						</div>
						<h3 class="mb-2 text-lg font-bold text-foreground">{feature.title}</h3>
						<p class="text-sm text-muted-foreground">{feature.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="border-t border-border/30 py-24">
		<div class="container mx-auto px-4">
			<h2 class="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
				Simple Pricing
			</h2>
			<p class="mx-auto mb-16 max-w-lg text-center text-muted-foreground">
				Start free, upgrade when you need more.
			</p>
			<div class="mx-auto grid max-w-5xl items-start gap-8 md:grid-cols-3">
				{#each plans as plan, i (plan)}
					<div
						class={`relative rounded-2xl border p-8 transition-all duration-200 ${
							plan.highlight
								? 'glow-green scale-105 border-accent bg-secondary'
								: 'card-hover border-border bg-secondary'
						}`}
						style={`animation: fade-up 0.5s ease-out ${i * 0.15}s forwards; opacity: 0;`}
					>
						{#if plan.highlight}
							<div
								class="bg-gradient-green absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-foreground"
							>
								Most Popular
							</div>
						{/if}
						<h3 class="mb-1 text-xl font-bold text-foreground">{plan.name}</h3>
						<div class="mb-6">
							<span class="text-4xl font-extrabold text-foreground">{plan.price}</span>
							<span class="text-sm text-muted-foreground">{plan.period}</span>
						</div>
						<ul class="mb-8 space-y-3">
							{#each plan.features as feature (feature)}
								<li class="flex items-center gap-2 text-sm text-muted-foreground">
									<CheckIcon class="h-4 w-4 shrink-0 text-accent" />
									{feature}
								</li>
							{/each}
						</ul>
						<a href={resolve('/auth')}>
							<Button variant={plan.highlight ? 'hero' : 'hero-outline'} class="w-full"
								>{plan.cta}</Button
							>
						</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="border-t border-border/30 py-24">
		<div class="container mx-auto px-4 text-center">
			<div class="mx-auto max-w-2xl">
				<h2 class="mb-4 text-3xl font-bold text-foreground md:text-4xl">Ready to Drop the Beat?</h2>
				<p class="mb-8 text-muted-foreground">
					Join thousands of hosts who let their guests decide the vibe.
				</p>
				<a href={resolve('/auth')}>
					<Button variant="hero" size="lg" class="px-10 py-6 text-base">
						Create Your Room - It's Free
						<ArrowRightIcon class="ml-2 h-5 w-5" />
					</Button>
				</a>
			</div>
		</div>
	</section>

	<LandingFooter />
</div>
