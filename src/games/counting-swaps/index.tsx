import { useReplay } from "../useReplay";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameLayout, ScorePill } from "../GameLayout";
import { Heart, RotateCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { toast } from "sonner";
import { sfx } from "@/lib/sfx";
import { useRoomScore } from "@/lib/useRoomScore";

// Each game randomizes two divisor rules from a pool, with random words.
const DIVISORS = [2, 3, 4, 5, 6, 7];
const WORDS = ["Tomato","Banana","Pizza","Cookie","Mango","Pickle","Avocado","Donut","Pretzel","Sushi","Taco","Cherry"];

type Rule = { div: number; word: string };

function makeRules(): [Rule, Rule] {
  const ds = [...DIVISORS].sort(() => Math.random() - 0.5).slice(0, 2).sort((a,b)=>a-b);
  const ws = [...WORDS].sort(() => Math.random() - 0.5);
  return [{ div: ds[0], word: ws[0] }, { div: ds[1], word: ws[1] }];
}

export default function CountingSwaps() {
  const { user, refreshProfile } = useAuth();
  const submitRoom = useRoomScore();
  const [rules] = useState<[Rule, Rule]>(makeRules);
  const choices = useMemo(() => ["Number", rules[0].word, rules[1].word, `${rules[0].word} ${rules[1].word}`], [rules]);
  const correctFor = (n: number) => {
    const a = n % rules[0].div === 0, b = n % rules[1].div === 0;
    if (a && b) return 3; if (a) return 1; if (b) return 2; return 0;
  };

  const [n, setN] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"ok" | "err" | null>(null);
  const [done, setDone] = useState(false);

  const tap = (idx: number) => {
    if (feedback) return;
    const ok = idx === correctFor(n);
    if (ok) {
      setScore(s => s + 1); setFeedback("ok"); sfx.ok();
      setTimeout(() => { setFeedback(null); setN(n + 1); }, 200);
    } else {
      setFeedback("err"); sfx.err();
      const newLives = lives - 1;
      setTimeout(() => {
        setFeedback(null);
        if (newLives <= 0) finish();
        else { setLives(newLives); setN(n + 1); }
      }, 600);
    }
  };

  const finish = async () => {
    setDone(true); setLives(0);
    const pts = score * 5;
    await awardPoints(user?.id, pts, score >= 30);
    submitRoom(pts);
    await refreshProfile();
    sfx.win();
    toast.success(`+${pts} points!`);
  };

  if (done) {
    return (
      <GameLayout title="Counting Swaps" subtitle="Out of lives">
        <div className="mt-10 grid place-items-center gap-4 text-center">
          <div className="text-7xl font-display text-gradient animate-pop">{score}</div>
          <p className="text-muted-foreground">streak · +{score * 5} points</p>
          <Button onClick={replay} className="bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Try again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout
      title="Counting Swaps"
      subtitle={`÷${rules[0].div} → ${rules[0].word} · ÷${rules[1].div} → ${rules[1].word}`}
      right={
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} className={`h-4 w-4 ${i < lives ? "text-destructive fill-destructive" : "text-muted"}`} />
          ))}
        </div>
      }
    >
      <div className="mt-6 grid gap-6">
        <div className="flex items-center justify-center"><ScorePill score={score} /></div>
        <div className={`glass-strong mx-auto grid h-44 w-44 place-items-center rounded-full transition-all ${
          feedback === "ok" ? "ring-2 ring-success scale-105" :
          feedback === "err" ? "ring-2 ring-destructive scale-95" : ""
        }`}>
          <span className="font-display text-7xl mono text-gradient">{n}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {choices.map((c, i) => (
            <button key={c+i} onClick={() => tap(i)} className="glass tap rounded-2xl border border-border px-4 py-5 text-center font-semibold hover:border-accent">
              {c}
            </button>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}
