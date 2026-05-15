import { useReplay } from "../useReplay";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameLayout } from "../GameLayout";
import { RELAY_STARTERS } from "../data";
import { Plus, Trash2, ArrowRight, RotateCw, Eye, EyeOff } from "lucide-react";

type Stage = "setup" | "pass" | "write" | "done";

export default function RelayStory() {
  const [stage, setStage] = useState<Stage>("setup");
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);
  const [story, setStory] = useState<{ author: string; text: string }[]>([]);
  const [turn, setTurn] = useState(0);
  const [draft, setDraft] = useState("");
  const [rounds, setRounds] = useState(2);
  const [reveal, setReveal] = useState(false);

  const add = () => {
    const n = name.trim();
    if (!n || players.includes(n)) return;
    setPlayers([...players, n]); setName("");
  };

  const start = () => {
    const opener = RELAY_STARTERS[Math.floor(Math.random() * RELAY_STARTERS.length)];
    setStory([{ author: "—", text: opener }]);
    setStage("pass");
  };

  const submit = () => {
    if (!draft.trim()) return;
    setStory([...story, { author: players[turn % players.length], text: draft.trim() }]);
    setDraft("");
    const next = turn + 1;
    if (next >= players.length * rounds) setStage("done");
    else { setTurn(next); setStage("pass"); }
  };

  if (stage === "setup") {
    return (
      <GameLayout title="Relay Story" subtitle="Pass-and-play">
        <div className="mt-6 grid gap-4">
          <div className="flex gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Player name" className="h-12 rounded-xl" />
            <Button onClick={add} size="lg" className="rounded-xl"><Plus className="h-5 w-5" /></Button>
          </div>
          <div className="grid gap-2">
            {players.map((p) => (
              <div key={p} className="glass flex items-center justify-between rounded-2xl px-4 py-3">
                <span className="font-semibold">{p}</span>
                <button onClick={() => setPlayers(players.filter((x) => x !== p))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
            <span className="text-sm">Sentences per player</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setRounds(Math.max(1, rounds - 1))}>-</Button>
              <span className="mono w-6 text-center font-bold">{rounds}</span>
              <Button size="sm" variant="secondary" onClick={() => setRounds(Math.min(5, rounds + 1))}>+</Button>
            </div>
          </div>
          <Button onClick={start} disabled={players.length < 2} className="h-12 bg-hero shadow-glow">Start <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </GameLayout>
    );
  }

  if (stage === "pass") {
    const who = players[turn % players.length];
    return (
      <GameLayout title="Relay Story" subtitle={`Sentence ${turn + 1}`}>
        <div className="mt-16 grid place-items-center gap-6 text-center">
          <p className="text-sm text-muted-foreground">Pass the device to</p>
          <p className="font-display text-5xl text-gradient">{who}</p>
          <Button onClick={() => setStage("write")} className="bg-hero shadow-glow">I'm ready</Button>
        </div>
      </GameLayout>
    );
  }

  if (stage === "write") {
    const last = story[story.length - 1];
    return (
      <GameLayout title="Relay Story" subtitle={players[turn % players.length] + "'s turn"} right={
        <button onClick={() => setReveal(!reveal)} className="glass tap flex h-9 w-9 items-center justify-center rounded-full">
          {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      }>
        <div className="mt-6 grid gap-4">
          <div className="glass-strong rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Last sentence{!reveal && " (peek to see)"}</p>
            <p className="mt-2 font-display text-lg leading-snug min-h-[3rem]">
              {reveal ? last.text : "•••••••••••••••••••••••••••••"}
            </p>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write your sentence…"
            className="h-32 w-full rounded-2xl border border-border bg-input p-4 outline-none focus:border-accent"
            autoFocus
          />
          <Button onClick={submit} disabled={!draft.trim()} className="h-12 bg-hero shadow-glow">Done — pass on</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Relay Story" subtitle="The full chaos">
      <div className="mt-4 grid gap-3">
        {story.map((s, idx) => (
          <div key={idx} className="glass rounded-2xl p-4 animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.author}</p>
            <p className="mt-1">{s.text}</p>
          </div>
        ))}
        <Button onClick={replay} className="mt-3 h-12 bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> New story</Button>
      </div>
    </GameLayout>
  );
}
