import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink, QrCode, Radio, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoomLive() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const roomLink = `${window.location.origin}/vote/abc123`;

  const copyLink = () => {
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-10">
      <div className="mx-auto max-w-2xl">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        {/* Live Badge */}
        <div className="text-center mb-10" style={{ animation: "fade-up 0.6s ease-out forwards" }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-primary font-bold text-sm mb-6 glow-green-sm animate-glow-pulse">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Room is Live
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Friday Night Vibes</h1>
          <p className="text-muted-foreground">Share the link or QR code with your guests</p>
        </div>

        {/* Share Card */}
        <div className="rounded-2xl border border-border bg-card p-8 mb-6" style={{ animation: "fade-up 0.6s ease-out 0.1s forwards", opacity: 0 }}>
          <div className="flex flex-col items-center gap-6">
            {/* QR Placeholder */}
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-secondary border border-border">
              <QrCode className="h-24 w-24 text-muted-foreground" />
            </div>

            <div className="w-full">
              <label className="text-xs text-muted-foreground mb-2 block">Room Link</label>
              <div className="flex items-center gap-2 rounded-lg bg-secondary border border-border p-3">
                <code className="flex-1 text-sm text-foreground truncate">{roomLink}</code>
                <Button variant="ghost" size="sm" onClick={copyLink} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={() => navigate("/vote/abc123")}>
              <ExternalLink className="h-4 w-4 mr-2" /> Open Guest View
            </Button>
          </div>
        </div>

        {/* Now Playing Preview */}
        <div className="rounded-2xl border border-border bg-card p-6" style={{ animation: "fade-up 0.6s ease-out 0.2s forwards", opacity: 0 }}>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" /> Now Playing
          </h3>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center">
              <Radio className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold text-foreground">Waiting for votes...</p>
              <p className="text-sm text-muted-foreground">The top-voted track will play next</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
