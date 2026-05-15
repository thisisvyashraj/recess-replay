import { useReplay } from "../useReplay";
// Most Likely To — TIER LIST edition.
// Players are dragged into S/A/B/C/D tiers based on the prompt.
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameLayout } from "../GameLayout";
import { MOST_LIKELY_PROMPTS } from "../data";
import { Plus, Trash2, RotateCw, ArrowRight, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { sfx } from "@/lib/sfx";
import { toast } from "sonner";

type Stage = "setup" | "play" | "results";
type Tier = "S" | "A" | "B" | "C" | "D" | "POOL";

const TIERS: { id: Tier; label: string; ring: string; bar: string }[] = [
  { id: "S", label: "S", ring: "ring-rose-500/60", bar: "bg-gradient-to-r from-rose-500 to-pink-500 text-white" },
  { id: "A", label: "A", ring: "ring-orange-500/60", bar: "bg-gradient-to-r from-orange-500 to-amber-500 text-white" },
  { id: "B", label: "B", ring: "ring-amber-400/60", bar: "bg-gradient-to-r from-amber-400 to-yellow-400 text-black" },
  { id: "C", label: "C", ring: "ring-emerald-500/60", bar: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white" },
  { id: "D", label: "D", ring: "ring-sky-500/60", bar: "bg-gradient-to-r from-sky-500 to-indigo-500 text-white" },
];

const TIER_POINTS: Record<Tier, number> = { S: 5, A: 4, B: 3, C: 2, D: 1, POOL: 0 };

export default function MostLikelyTo() {
  const [stage, setStage] = useState<Stage>("setup");
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [i, setI] = useState(0);
  // round placement: name -> tier
  const [placement, setPlacement] = useState<Record<string, Tier>>({});
  // cumulative score across all rounds
  const [scores, setScores] = useState<Record<string, number>>({});
  const [drag, setDrag] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("mlt_prompts").select("prompt");
      const all = data && data.length > 0 ? data.map((d: any) => d.prompt) : MOST_LIKELY_PROMPTS;
      setPrompts([...all].sort(() => Math.random() - 0.5).slice(0, 6));
    })();
  }, []);

  const add = () => {
    const n = name.trim();
    if (!n || players.includes(n)) return;
    if (players.length >= 12) return toast.error("Max 12 players");
    setPlayers([...players, n]); setName(""); sfx.tap();
  };
  const start = () => {
    setScores(Object.fromEntries(players.map(p => [p, 0])));
    setPlacement(Object.fromEntries(players.map(p => [p, "POOL"])) as Record<string, Tier>);
    setStage("play"); sfx.whoosh();
  };

  const place = (player: string, tier: Tier) => {
    setPlacement(p => ({ ...p, [player]: tier }));
    sfx.tap();
  };

  const lockRound = () => {
    // add placement points to scores
    const next = { ...scores };
    Object.entries(placement).forEach(([p, t]) => { next[p] = (next[p] ?? 0) + TIER_POINTS[t]; });
    setScores(next);
    if (i + 1 >= prompts.length) {
      setStage("results"); sfx.win();
    } else {
      setI(i + 1);
      setPlacement(Object.fromEntries(players.map(p => [p, "POOL"])) as Record<string, Tier>);
    }
  };

  const allPlaced = Object.values(placement).every(t => t !== "POOL");

  if (stage === "setup") {
    return (
      <GameLayout title="Most Likely To" subtitle="Tier list mode">
        <div className="mt-6 grid gap-4">
          <div className="flex gap-2">
            <Input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Player name" className="h-12 rounded-xl" />
            <Button onClick={add} size="lg" className="rounded-xl"><Plus className="h-5 w-5" /></Button>
          </div>
          <div className="grid gap-2">
            {players.map(p => (
              <div key={p} className="glass flex items-center justify-between rounded-2xl px-4 py-3 animate-slide-up">
                <span className="font-semibold">{p}</span>
                <button onClick={() => setPlayers(players.filter(x => x !== p))} className="tap text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {players.length === 0 && <p className="text-center text-sm text-muted-foreground">Add at least 2 players to start.</p>}
          </div>
          <Button onClick={start} disabled={players.length < 2 || prompts.length === 0} className="h-12 bg-hero shadow-glow">
            Start <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">Drag each player into S/A/B/C/D for every prompt. Higher tier = higher points.</p>
        </div>
      </GameLayout>
    );
  }

  if (stage === "results") {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return (
      <GameLayout title="Most Likely To" subtitle="Final ranking">
        <div className="mt-6 grid gap-2">
          {sorted.map(([p, v], idx) => (
            <div key={p} className={`glass flex items-center justify-between rounded-2xl px-4 py-4 animate-slide-up ${idx === 0 ? "shadow-glow" : ""}`} style={{ animationDelay: `${idx * 60}ms` }}>
              <span className="font-display text-lg">{idx === 0 ? "👑 " : `${idx + 1}. `}{p}</span>
              <span className="mono text-2xl font-bold text-gradient">{v}</span>
            </div>
          ))}
          <Button onClick={replay} className="mt-4 h-12 bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Play again</Button>
        </div>
      </GameLayout>
    );
  }

  // play stage — tier list
  const pool = players.filter(p => placement[p] === "POOL");

  const dragOver = (e: React.DragEvent) => e.preventDefault();
  const dropOn = (tier: Tier) => () => { if (drag) { place(drag, tier); setDrag(null); } };

  return (
    <GameLayout title="Most Likely To" subtitle={`${i + 1} / ${prompts.length}`}>
      <div className="mt-4 grid gap-3">
        <div className="glass-strong rounded-2xl p-4 text-center animate-scale-in" key={i}>
          <p className="font-display text-lg leading-tight">{prompts[i]}</p>
        </div>

        {/* Tier rows */}
        <div className="grid gap-1.5">
          {TIERS.map(t => {
            const here = players.filter(p => placement[p] === t.id);
            return (
              <div key={t.id} onDragOver={dragOver} onDrop={dropOn(t.id)}
                className={`flex items-stretch gap-2 rounded-xl bg-secondary/50 ring-1 ${t.ring} min-h-14 overflow-hidden`}>
                <div className={`flex w-10 items-center justify-center font-display text-xl font-black ${t.bar}`}>{t.label}</div>
                <div className="flex flex-1 flex-wrap gap-1.5 p-1.5">
                  {here.map(p => (
                    <Chip key={p} name={p} onDragStart={() => setDrag(p)} onTap={() => place(p, "POOL")} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pool */}
        <div onDragOver={dragOver} onDrop={dropOn("POOL")} className="rounded-2xl glass border border-border p-3 min-h-20">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Drag from here · tap a chip to remove</p>
          <div className="flex flex-wrap gap-2">
            {pool.length === 0 && <p className="text-xs text-muted-foreground italic">All placed!</p>}
            {pool.map(p => (
              <Chip key={p} name={p} onDragStart={() => setDrag(p)} large />
            ))}
          </div>
          {/* Tap fallback for mobile (no drag) */}
          {pool.length > 0 && (
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {TIERS.map(t => (
                <button key={t.id} onClick={() => { if (pool[0]) place(pool[0], t.id); }}
                  className={`h-8 rounded-lg text-sm font-black ${t.bar}`}>{t.label}</button>
              ))}
            </div>
          )}
          {pool.length > 0 && <p className="mt-2 text-[10px] text-center text-muted-foreground">Tap a tier above to place the next player ({pool[0]}).</p>}
        </div>

        <Button onClick={lockRound} disabled={!allPlaced} className="h-12 bg-hero shadow-glow">
          {i + 1 >= prompts.length ? "Reveal results" : "Lock & next"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </GameLayout>
  );
}

function Chip({ name, onDragStart, onTap, large }: { name: string; onDragStart?: () => void; onTap?: () => void; large?: boolean }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onTap}
      className={`inline-flex items-center gap-1.5 rounded-full bg-surface-elevated border border-border-strong px-3 py-1.5 cursor-grab active:cursor-grabbing select-none tap shadow-sm ${large ? "text-sm" : "text-xs"}`}
      title={onTap ? "Tap to send back to pool" : ""}
    >
      <GripVertical className="h-3 w-3 text-muted-foreground" />
      <span className="font-semibold">{name}</span>
    </div>
  );
}
