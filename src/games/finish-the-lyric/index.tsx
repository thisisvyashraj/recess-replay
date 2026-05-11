import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameLayout, ScorePill } from "../GameLayout";
import { LYRICS } from "../data";
import { RotateCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { toast } from "sonner";

function pick() {
  return [...LYRICS].sort(() => Math.random() - 0.5).slice(0, 8);
}

export default function FinishLyric() {
  const { user, refreshProfile } = useAuth();
  const [rounds] = useState(pick);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const r = rounds[i];

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const ok = idx === r.correct;
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      if (i + 1 >= rounds.length) finish(ok ? score + 1 : score);
      else { setI(i + 1); setPicked(null); }
    }, 1100);
  };

  const finish = async (final: number) => {
    setDone(true);
    const pts = final * 12;
    await awardPoints(user?.id, pts, final >= 7);
    await refreshProfile();
    toast.success(`+${pts} points!`);
  };

  if (done) {
    return (
      <GameLayout title="Finish the Lyric" subtitle="Wrap">
        <div className="mt-10 grid place-items-center gap-4 text-center">
          <div className="text-7xl font-display text-gradient">{score}/{rounds.length}</div>
          <p className="text-muted-foreground">+{score * 12} points</p>
          <Button onClick={() => window.location.reload()} className="bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Play again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Finish the Lyric" subtitle={`Round ${i + 1} / ${rounds.length}`} right={<ScorePill score={score} total={rounds.length} />}>
      <div className="mt-8 grid gap-6">
        <div className="glass-strong rounded-3xl p-6 text-center animate-scale-in">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.artist}</p>
          <p className="mt-3 font-display text-2xl leading-tight">{r.line}</p>
        </div>
        <div className="grid gap-2">
          {r.choices.map((c, idx) => {
            const isPicked = picked === idx;
            const isRight = picked !== null && idx === r.correct;
            const isWrong = isPicked && idx !== r.correct;
            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                className={`glass tap rounded-2xl border px-4 py-4 text-left text-base font-medium transition-all ${
                  isRight ? "border-success bg-success/10" :
                  isWrong ? "border-destructive bg-destructive/10" :
                  "border-border hover:border-border-strong"
                }`}
                disabled={picked !== null}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
