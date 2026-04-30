import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { avatarSrc } from "@/lib/avatars";
import { Trophy } from "lucide-react";

type Row = { id: string; display_name: string; username: string; avatar_url: string | null; points: number; wins: number };

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, points, wins")
      .order("points", { ascending: false })
      .limit(50)
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  return (
    <AppShell>
      <div className="px-5 pt-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-glow shadow-glow">
            <Trophy className="h-6 w-6 text-accent-foreground" />
          </span>
          <div>
            <h1 className="font-display text-3xl">Leaderboard</h1>
            <p className="text-sm text-muted-foreground">All-time points</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {rows.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
              The throne is empty. Play games to climb.
            </div>
          )}
          {rows.map((r, i) => (
            <div
              key={r.id}
              className={`flex items-center gap-3 rounded-2xl p-3 shadow-card animate-slide-up ${
                i === 0 ? "bg-gradient-to-r from-primary/15 to-accent/15" : "bg-card"
              }`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl font-display text-lg ${
                i === 0 ? "bg-accent text-accent-foreground" :
                i === 1 ? "bg-primary/20 text-primary" :
                i === 2 ? "bg-accent/30 text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}>{i + 1}</span>
              <img src={avatarSrc(r.avatar_url)} alt="" className="h-11 w-11 rounded-xl bg-secondary object-contain" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold">{r.display_name}</p>
                <p className="truncate text-xs text-muted-foreground">@{r.username}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg leading-none">{r.points}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{r.wins} wins</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
