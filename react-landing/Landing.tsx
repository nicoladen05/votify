import { Music, Vote, Radio, QrCode, Users, Sparkles, Check, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const steps = [
  { icon: Music, title: "Create a Room", desc: "Set up your music room in seconds with a custom name and settings." },
  { icon: Radio, title: "Connect Spotify", desc: "Link your Spotify account to access your playlists and library." },
  { icon: QrCode, title: "Share & Play", desc: "Share a link or QR code. Guests vote, you play the winners." },
];

const features = [
  { icon: Vote, title: "Real-time Voting", desc: "Guests upvote tracks live. Top votes play next." },
  { icon: Radio, title: "Spotify Integration", desc: "Seamless playback from your Spotify account." },
  { icon: Zap, title: "Live Queue Updates", desc: "Watch the queue shift in real-time as votes come in." },
  { icon: QrCode, title: "QR Code Access", desc: "Instant room access — no downloads, no sign-ups." },
  { icon: Users, title: "Multiple Rooms", desc: "Host multiple rooms for different vibes. Pro+" },
  { icon: Sparkles, title: "Smart Filtering", desc: "Filter explicit content and set genre boundaries. Coming soon." },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["1 Room", "Basic voting", "Spotify connect", "QR code sharing", "Limited analytics"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    features: ["5 Rooms", "Advanced controls", "Custom room names", "Room themes", "Priority support"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Premium",
    price: "$24",
    period: "/month",
    features: ["Unlimited rooms", "Advanced moderation", "Voting weight controls", "Party analytics", "Branding removal"],
    cta: "Go Premium",
    highlight: false,
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Votify</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Log in
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Glow bg */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-glow-pulse pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mx-auto max-w-3xl" style={{ animation: "fade-up 0.8s ease-out forwards" }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Spotify
            </div>
            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-7xl">
              Let Your Guests{" "}
              <span className="text-gradient-green">Control the Music.</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Create a Spotify-powered voting room for your party in seconds. 
              No downloads, no sign-ups for guests — just great music, chosen together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" className="text-base px-8 py-6" onClick={() => navigate("/auth")}>
                Create Your Room
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6" onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}>
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 border-t border-border/30">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-foreground mb-4 md:text-4xl">How It Works</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">Three simple steps to transform any gathering into a collaborative music experience.</p>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center group" style={{ animation: `fade-up 0.6s ease-out ${i * 0.15}s forwards`, opacity: 0 }}>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-200 group-hover:glow-green-sm group-hover:bg-primary/20">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="text-sm font-bold text-primary mb-2">Step {i + 1}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-foreground mb-4 md:text-4xl">Everything You Need</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">Powerful features to make every party unforgettable.</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 card-hover"
                style={{ animation: `fade-up 0.5s ease-out ${i * 0.1}s forwards`, opacity: 0 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-foreground mb-4 md:text-4xl">Simple Pricing</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">Start free, upgrade when you need more.</p>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto items-start">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 transition-all duration-200 ${
                  plan.highlight
                    ? "border-primary bg-card glow-green relative scale-105"
                    : "border-border bg-card card-hover"
                }`}
                style={{ animation: `fade-up 0.5s ease-out ${i * 0.15}s forwards`, opacity: 0 }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-green px-4 py-1 text-xs font-bold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? "hero" : "hero-outline"}
                  className="w-full"
                  onClick={() => navigate("/auth")}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-foreground mb-4 md:text-4xl">Ready to Drop the Beat?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of hosts who let their guests decide the vibe.</p>
            <Button variant="hero" size="lg" className="text-base px-10 py-6" onClick={() => navigate("/auth")}>
              Create Your Room — It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Music className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Votify</span>
          </div>
          © 2026 Votify. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
