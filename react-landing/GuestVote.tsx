import { useState } from "react";
import { Music, ThumbsUp, Search, Plus, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Track {
  id: string;
  title: string;
  artist: string;
  votes: number;
  voted: boolean;
}

const mockTracks: Track[] = [
  { id: "1", title: "Blinding Lights", artist: "The Weeknd", votes: 12, voted: false },
  { id: "2", title: "Levitating", artist: "Dua Lipa", votes: 9, voted: false },
  { id: "3", title: "Save Your Tears", artist: "The Weeknd", votes: 7, voted: false },
  { id: "4", title: "Don't Start Now", artist: "Dua Lipa", votes: 5, voted: false },
  { id: "5", title: "Watermelon Sugar", artist: "Harry Styles", votes: 3, voted: false },
];

export default function GuestVote() {
  const [tracks, setTracks] = useState<Track[]>(mockTracks);
  const [search, setSearch] = useState("");

  const handleVote = (id: string) => {
    setTracks((prev) =>
      prev
        .map((t) =>
          t.id === id
            ? { ...t, votes: t.voted ? t.votes - 1 : t.votes + 1, voted: !t.voted }
            : t
        )
        .sort((a, b) => b.votes - a.votes)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="mx-auto max-w-lg px-4 py-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">Votify</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Live
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground">Friday Night Vibes</h1>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-6">
        {/* Now Playing */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
            <Radio className="h-3.5 w-3.5" /> Now Playing
          </p>
          <div className="mx-auto mb-4 h-40 w-40 rounded-xl bg-secondary flex items-center justify-center glow-green-sm">
            <Music className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Blinding Lights</h2>
          <p className="text-sm text-muted-foreground">The Weeknd</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search songs to add..."
            className="pl-10 bg-card border-border focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Queue */}
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Up Next — Vote for your favorite</h3>
        <div className="space-y-3">
          {tracks.map((track, i) => (
            <div
              key={track.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5"
              style={{ animation: `fade-up 0.4s ease-out ${i * 0.05}s forwards`, opacity: 0 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
              <Button
                variant={track.voted ? "hero" : "hero-outline"}
                size="sm"
                onClick={() => handleVote(track.id)}
                className="shrink-0 gap-1.5 min-w-[70px]"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                {track.votes}
              </Button>
            </div>
          ))}
        </div>

        {/* Add song */}
        <Button variant="hero-outline" className="w-full mt-6 gap-2">
          <Plus className="h-4 w-4" />
          Add a Song to the Queue
        </Button>
      </div>
    </div>
  );
}
