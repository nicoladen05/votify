import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Music, LayoutDashboard, DoorOpen, CreditCard, Settings, LogOut,
  Plus, Play, Trash2, BarChart3, Settings2, Lock, Crown, Zap, Sparkles, Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: DoorOpen, label: "My Rooms", path: "/dashboard" },
  { icon: CreditCard, label: "Pricing", path: "/" },
  { icon: Settings, label: "Settings", path: "/dashboard" },
];

interface Room {
  id: string;
  name: string;
  status: "live" | "offline";
}

const mockRooms: Room[] = [
  { id: "1", name: "Friday Night Vibes", status: "live" },
];

const planBadges: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  free: { label: "Free", icon: Zap, color: "bg-muted text-muted-foreground" },
  pro: { label: "Pro", icon: Crown, color: "bg-primary/20 text-primary" },
  premium: { label: "Premium", icon: Sparkles, color: "bg-primary/20 text-primary" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [plan] = useState<"free" | "pro" | "premium">("free");
  const [rooms] = useState<Room[]>(mockRooms);
  const badge = planBadges[plan];
  const maxRooms = plan === "free" ? 1 : plan === "pro" ? 5 : Infinity;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card/50 p-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Music className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">Votify</span>
        </div>
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Welcome back 👋</h1>
            <p className="text-muted-foreground">Manage your music rooms and settings.</p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${badge.color}`}>
            <badge.icon className="h-3.5 w-3.5" />
            {badge.label} Plan
          </div>
        </div>

        {/* Rooms */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">My Rooms</h2>
          <Button
            variant="hero"
            size="sm"
            disabled={rooms.length >= maxRooms}
            onClick={() => {}}
          >
            <Plus className="h-4 w-4 mr-1" />
            Create Room
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div key={room.id} className="rounded-xl border border-border bg-card p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">{room.name}</h3>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  room.status === "live" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${room.status === "live" ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                  {room.status === "live" ? "Live" : "Offline"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="hero" size="sm" onClick={() => navigate("/room/1")}>
                  <Play className="h-3 w-3 mr-1" /> Launch
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Settings2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Upgrade card */}
          {rooms.length >= maxRooms && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 flex flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Upgrade to create more rooms</p>
              <Button variant="hero-outline" size="sm">
                <Crown className="h-3 w-3 mr-1" /> Upgrade Plan
              </Button>
            </div>
          )}
        </div>

        {/* Spotify Connection */}
        <div className="mt-10 rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Radio className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Spotify Connection</h3>
              <p className="text-sm text-muted-foreground">Connect your account to start playing music in rooms.</p>
            </div>
          </div>
          <Button variant="hero" size="sm">Connect Spotify</Button>
        </div>
      </main>
    </div>
  );
}
