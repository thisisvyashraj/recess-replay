// Memory Chain — Simon Says style. Watch sequence, repeat. Add 1 each round.
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GameLayout, ScorePill } from "../GameLayout";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { sfx } from "@/lib/sfx";
import { useRoomScore } from "@/lib/useRoomScore";
import { RotateCw } from "lucide-react";
import { toast } from "sonner";

const COLORS = [
  { id: 0, bg: "bg-rose-500", glow: "shadow-[0_0_40px_hsl(0_72%_56%/0.7)]", tone: 329.6 },
  { id: 1, bg: "bg-amber-400", glow: "shadow-[0_0_40px_hsl(45_100%_55%/0.7)]", tone: 392.0 },
  { id: 2, bg: "bg-emerald-500", glow: "shadow-[0_0_40px_hsl(160_70%_45%/0.7)]", tone: 523.3 },
  { id: 3, bg: "bg-sky-500", glow: "shadow-[0_0_40px_hsl(200_95%_55%/0.7)]", tone: 659.3 },
];

export default function MemoryChain() {
  const { user, refreshProfile } = useAuth();
  const submitRoom = useRoomScore();
  const [seq, setSeq] = useState<number[]>([]);
  const [userIdx, setUserIdx] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [stage, setStage] = useState<"ready" | "show" | "input" | "over">("ready");
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);

  const start = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSeq(first); setRound(1); setUserIdx(0); setStage("show"); setDone(false);
  };

  // Play sequence
  useEffect(() => {
    if (stage !== "show" || seq.length === 0) return;
    let i = 0;
    const step = () => {
      if (i >= seq.length) { setActive(null); setStage("input"); setUserIdx(0); return; }
      const id = seq[i];
      setActive(id);
      flash(id);
      setTimeout(() => { setActive(null); setTimeout(step, 220); }, 480);
      i++;
    };
    setTimeout(step, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, seq]);

  const flash = (id: number) => {
    const c = COLORS[id]; if (!c) return;
    // tone via sfx
    try { (sfx as any).tap?.(); } catch {}
    // play exact pitch
    const win = window as any;
    if (win.AudioContext || win.webkitAudioContext) {
      const ac = new (win.AudioContext || win.webkitAudioContext)();
      const o = ac.createOscillator(); const g = ac.createGain();
      o.type = "triangle"; o.frequency.value = c.tone;
      o.connect(g); g.connect(ac.destination);
      const t = ac.currentTime; g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.08, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.start(t); o.stop(t + 0.42);
      setTimeout(() => ac.close(), 600);
    }
  };

  const tap = (id: number) => {
    if (stage !== "input") return;
    setActive(id); flash(id);
    setTimeout(() => setActive(null), 200);
    if (seq[userIdx] !== id) {
      sfx.err();
      setStage("over");
      finish();
      return;
    }
    if (userIdx + 1 >= seq.length) {
      // round complete
      const next = [...seq, Math.floor(Math.random() * 4)];
      setRound(r => r + 1);
      setTimeout(() => { setSeq(next); setStage("show"); }, 500);
    } else {
      setUserIdx(userIdx + 1);
    }
  };

  const finish = async () => {
    if (done) return; setDone(true);
    const pts = (round - 1) * 5;
    if (pts > 0) {
      await awardPoints(user?.id, pts, round >= 10);
      submitRoom(pts);
      await refreshProfile();
      toast.success(`+${pts} points · made it to round ${round}`);
      sfx.win();
    }
  };

  if (stage === "ready") {
    return (
      <GameLayout title="Memory Chain" subtitle="Watch. Repeat. Add.">
        <div className="mt-12 text-center">
          <p className="font-display text-5xl text-gradient">🧠</p>
          <p className="mt-4 text-muted-foreground text-sm max-w-xs mx-auto">A color flashes. You repeat. Each round adds one more. How long can you remember?</p>
          <Button onClick={start} size="lg" className="mt-8 h-12 rounded-xl bg-hero shadow-glow tap shine">Start</Button>
        </div>
      </GameLayout>
    );
  }

  if (stage === "over") {
    return (
      <GameLayout title="Memory Chain" subtitle="Game over">
        <div className="mt-12 text-center">
          <p className="font-display text-7xl text-gradient mono animate-pop">{round - 1}</p>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">rounds cleared</p>
          <Button onClick={start} className="mt-8 bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Try again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Memory Chain" subtitle={stage === "show" ? "Watching…" : "Your turn"} right={<ScorePill score={round} />}>
      <div className="mt-8 grid grid-cols-2 gap-3 aspect-square">
        {COLORS.map(c => (
          <button
            key={c.id}
            onClick={() => tap(c.id)}
            disabled={stage !== "input"}
            className={`rounded-3xl ${c.bg} tap transition-all duration-150 ${active === c.id ? `scale-95 ${c.glow} brightness-150` : "brightness-75 hover:brightness-100"}`}
            aria-label={`color ${c.id}`}
          />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">{stage === "input" ? `${userIdx}/${seq.length}` : "Watch the pattern…"}</p>
    </GameLayout>
  );
}
