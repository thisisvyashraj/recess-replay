import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameLayout, ScorePill } from "../GameLayout";
import { MEMORY_GRIDS } from "../data";
import { RotateCw, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { toast } from "sonner";

type Stage = "show" | "pick" | "result" | "done";

const PEEK_MS = 3000;

function makeRound(idx: number) {
  const shuffled = [...MEMORY_GRIDS[idx % MEMORY_GRIDS.length]].sort(() => Math.random() - 0.5);
  const grid = shuffled;
  const target = grid[4]; // center of 3x3
  // distractors not in grid
  const allEmojis = "🍊🐯🌻🥑🪁🛹🍀🍒🌶️🦖🪼🥨🧁🐢🌈".split("");
  const distractors = allEmojis.filter(e => !grid.includes(e)).sort(() => Math.random() - 0.5).slice(0, 5);
  // mix grid items + distractors for the choice list
  const fromGrid = [...grid].sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [...new Set([target, ...fromGrid, ...distractors])].slice(0, 6).sort(() => Math.random() - 0.5);
  return { grid, target, choices };
}

export default function MemoryGames() {
  const { user, refreshProfile } = useAuth();
  const [rIdx, setRIdx] = useState(0);
  const [round, setRound] = useState(() => makeRound(0));
  const [stage, setStage] = useState<Stage>("show");
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const total = 5;

  useEffect(() => {
    if (stage !== "show") return;
    const t = setTimeout(() => setStage("pick"), PEEK_MS);
    return () => clearTimeout(t);
  }, [stage, rIdx]);

  const pick = (e: string) => {
    if (stage !== "pick") return;
    setPicked(e);
    const ok = round.grid.includes(e) && e === round.target;
    if (ok) setScore(s => s + 1);
    setStage("result");
    setTimeout(() => {
      if (rIdx + 1 >= total) finish(ok ? score + 1 : score);
      else {
        const next = rIdx + 1;
        setRIdx(next); setRound(makeRound(next)); setPicked(null); setStage("show");
      }
    }, 1200);
  };

  const finish = async (final: number) => {
    setStage("done");
    const pts = final * 14;
    await awardPoints(user?.id, pts, final === total);
    await refreshProfile();
    toast.success(`+${pts} points!`);
  };

  if (stage === "done") {
    return (
      <GameLayout title="Memory" subtitle="Recall complete">
        <div className="mt-10 grid place-items-center gap-4 text-center">
          <div className="text-7xl font-display text-gradient">{score}/{total}</div>
          <p className="text-muted-foreground">+{score * 14} points</p>
          <Button onClick={() => window.location.reload()} className="bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Play again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Memory" subtitle={`Round ${rIdx + 1} / ${total}`} right={<ScorePill score={score} total={total} />}>
      <div className="mt-6 grid gap-6">
        {stage === "show" && (
          <>
            <p className="text-center text-xs uppercase tracking-wider text-muted-foreground">
              <Eye className="mr-1 inline h-3 w-3" /> Memorize this grid…
            </p>
            <div className="glass-strong mx-auto grid grid-cols-3 gap-3 rounded-3xl p-5 animate-scale-in">
              {round.grid.map((e, i) => (
                <span key={i} className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-3xl">{e}</span>
              ))}
            </div>
          </>
        )}
        {(stage === "pick" || stage === "result") && (
          <>
            <p className="text-center font-display text-xl">Which one was the <span className="text-gradient">center-most</span>?</p>
            <p className="text-center text-xs text-muted-foreground -mt-3">(pick the emoji shown in the middle of the grid)</p>
            <div className="grid grid-cols-3 gap-2">
              {round.choices.map((e) => {
                const isPicked = picked === e;
                const showRight = stage === "result" && e === round.target;
                const showWrong = stage === "result" && isPicked && e !== round.target;
                return (
                  <button
                    key={e}
                    onClick={() => pick(e)}
                    className={`glass tap grid aspect-square place-items-center rounded-2xl border text-3xl transition-all ${
                      showRight ? "border-success bg-success/10 scale-105" :
                      showWrong ? "border-destructive bg-destructive/10" :
                      "border-border hover:border-accent"
                    }`}
                  >
                    {e}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}
