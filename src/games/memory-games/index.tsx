import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameLayout, ScorePill } from "../GameLayout";
import { MEMORY_GRIDS } from "../data";
import { RotateCw, Eye, Timer } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { toast } from "sonner";
import { sfx } from "@/lib/sfx";
import { useRoomScore } from "@/lib/useRoomScore";

type Stage = "show" | "pick" | "result" | "done";

const POSITIONS = [
  { idx: 0, label: "top-left" },     { idx: 1, label: "top-center" },     { idx: 2, label: "top-right" },
  { idx: 3, label: "middle-left" },  { idx: 4, label: "center" },         { idx: 5, label: "middle-right" },
  { idx: 6, label: "bottom-left" },  { idx: 7, label: "bottom-center" },  { idx: 8, label: "bottom-right" },
];

// 5s, 4.5s, 4s, 3.5s, 3s, 2.5s, 2s, 1.5s
const TIMES_S = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5];
const TOTAL = TIMES_S.length;

function makeRound(rIdx: number) {
  const grid = [...MEMORY_GRIDS[rIdx % MEMORY_GRIDS.length]].sort(() => Math.random() - 0.5);
  const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
  const target = grid[pos.idx];
  const allEmojis = "🍊🐯🌻🥑🪁🛹🍀🍒🌶️🦖🪼🥨🧁🐢🌈🦋🍑🐬🌮".split("");
  const distractors = allEmojis.filter(e => !grid.includes(e)).sort(() => Math.random() - 0.5).slice(0, 5);
  const fromGrid = grid.filter(e => e !== target).sort(() => Math.random() - 0.5).slice(0, 2);
  const choices = Array.from(new Set([target, ...fromGrid, ...distractors])).slice(0, 6).sort(() => Math.random() - 0.5);
  return { grid, target, pos, choices, durationMs: TIMES_S[rIdx] * 1000 };
}

export default function MemoryGames() {
  const { user, refreshProfile } = useAuth();
  const submitRoom = useRoomScore();
  const [rIdx, setRIdx] = useState(0);
  const [round, setRound] = useState(() => makeRound(0));
  const [stage, setStage] = useState<Stage>("show");
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(round.durationMs);

  useEffect(() => {
    if (stage !== "show") return;
    setRemaining(round.durationMs);
    const start = Date.now();
    const tick = setInterval(() => {
      const left = Math.max(0, round.durationMs - (Date.now() - start));
      setRemaining(left);
      if (left <= 1000 && left > 0) sfx.tick();
      if (left === 0) { clearInterval(tick); setStage("pick"); sfx.whoosh(); }
    }, 100);
    return () => clearInterval(tick);
  }, [stage, round]);

  const pick = (e: string) => {
    if (stage !== "pick") return;
    setPicked(e);
    const ok = e === round.target;
    if (ok) { setScore(s => s + 1); sfx.ok(); } else sfx.err();
    setStage("result");
    setTimeout(() => {
      if (rIdx + 1 >= TOTAL) finish(ok ? score + 1 : score);
      else { const next = rIdx + 1; setRIdx(next); setRound(makeRound(next)); setPicked(null); setStage("show"); }
    }, 1100);
  };

  const finish = async (final: number) => {
    setStage("done");
    const pts = final * 14;
    await awardPoints(user?.id, pts, final === TOTAL);
    submitRoom(pts);
    await refreshProfile();
    sfx.win();
    toast.success(`+${pts} points!`);
  };

  if (stage === "done") {
    return (
      <GameLayout title="Memory" subtitle="Recall complete">
        <div className="mt-10 grid place-items-center gap-4 text-center">
          <div className="text-7xl font-display text-gradient animate-pop">{score}/{TOTAL}</div>
          <p className="text-muted-foreground">+{score * 14} points</p>
          <Button onClick={() => window.location.reload()} className="bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Play again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Memory" subtitle={`Round ${rIdx + 1} / ${TOTAL}`} right={<ScorePill score={score} total={TOTAL} />}>
      <div className="mt-4 grid gap-6">
        {stage === "show" && (
          <>
            <div className="mx-auto flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-bold mono">
              <Timer className="h-4 w-4 text-accent" />
              {(remaining / 1000).toFixed(1)}s
            </div>
            <p className="text-center text-xs uppercase tracking-wider text-muted-foreground">
              <Eye className="mr-1 inline h-3 w-3" /> Memorize the grid…
            </p>
            <div className="glass-strong mx-auto grid grid-cols-3 gap-3 rounded-3xl p-5 animate-scale-in">
              {round.grid.map((e, i) => (
                <span key={i} className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-3xl">{e}</span>
              ))}
            </div>
            <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-accent-gradient transition-all" style={{ width: `${(remaining / round.durationMs) * 100}%` }} />
            </div>
          </>
        )}
        {(stage === "pick" || stage === "result") && (
          <>
            <p className="text-center font-display text-xl">Which emoji was at the <span className="text-gradient">{round.pos.label}</span>?</p>
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
