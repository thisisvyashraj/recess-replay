import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameLayout } from "../GameLayout";
import { MOST_LIKELY_PROMPTS } from "../data";
import { Plus, Trash2, RotateCw, ArrowRight } from "lucide-react";

type Stage = "setup" | "play" | "results";

export default function MostLikelyTo() {
  const [stage, setStage] = useState<Stage>("setup");
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [prompts] = useState(() => [...MOST_LIKELY_PROMPTS].sort(() => Math.random() - 0.5).slice(0, 8));
  const [i, setI] = useState(0);
  const [tally, setTally] = useState<Record<string, number>>({});

  const add = () => {
    const n = name.trim();
    if (!n || players.includes(n)) return;
    setPlayers([...players, n]);
    setName("");
  };

  const start = () => {
    setTally(Object.fromEntries(players.map((p) => [p, 0])));
    setStage("play");
  };

  const vote = (p: string) => {
    setTally((t) => ({ ...t, [p]: (t[p] ?? 0) + 1 }));
    if (i + 1 >= prompts.length) setStage("results");
    else setI(i + 1);
  };

  if (stage === "setup") {
    return (
      <GameLayout title="Most Likely To" subtitle="Add the squad">
        <div className="mt-6 grid gap-4">
          <div className="flex gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Player name" className="h-12 rounded-xl" />
            <Button onClick={add} size="lg" className="rounded-xl"><Plus className="h-5 w-5" /></Button>
          </div>
          <div className="grid gap-2">
            {players.map((p) => (
              <div key={p} className="glass flex items-center justify-between rounded-2xl px-4 py-3">
                <span className="font-semibold">{p}</span>
                <button onClick={() => setPlayers(players.filter((x) => x !== p))} className="tap text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {players.length === 0 && <p className="text-center text-sm text-muted-foreground">Add at least 2 players to start.</p>}
          </div>
          <Button onClick={start} disabled={players.length < 2} className="h-12 bg-hero shadow-glow">Start <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </GameLayout>
    );
  }

  if (stage === "results") {
    const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1]);
    return (
      <GameLayout title="Most Likely To" subtitle="Results">
        <div className="mt-6 grid gap-2">
          {sorted.map(([p, v], idx) => (
            <div key={p} className={`glass flex items-center justify-between rounded-2xl px-4 py-4 ${idx === 0 ? "border-accent shadow-glow" : ""}`}>
              <span className="font-display text-lg">{idx + 1}. {p}</span>
              <span className="mono text-2xl font-bold text-gradient">{v}</span>
            </div>
          ))}
          <Button onClick={() => window.location.reload()} className="mt-4 h-12 bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Play again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Most Likely To" subtitle={`${i + 1} / ${prompts.length}`}>
      <div className="mt-8 grid gap-5">
        <div className="glass-strong rounded-3xl p-6 text-center animate-scale-in">
          <p className="font-display text-2xl leading-tight">{prompts[i]}</p>
        </div>
        <p className="text-center text-xs uppercase tracking-wider text-muted-foreground">Tap who fits</p>
        <div className="grid gap-2">
          {players.map((p) => (
            <button key={p} onClick={() => vote(p)} className="glass tap rounded-2xl border border-border px-4 py-4 text-left font-semibold hover:border-accent">
              {p}
            </button>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}
