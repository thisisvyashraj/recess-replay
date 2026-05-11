import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameLayout, ScorePill } from "../GameLayout";
import { BLIND_CHAT_ROUNDS } from "../data";
import { RotateCw, Shuffle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { toast } from "sonner";

type Match = { textIdx: number; whoIdx: number | null };

export default function BlindChat() {
  const { user, refreshProfile } = useAuth();
  const [rIdx, setRIdx] = useState(0);
  const [round] = useState(() => [...BLIND_CHAT_ROUNDS].sort(() => Math.random() - 0.5).slice(0, 3));
  const data = round[rIdx];
  const shuffledTexts = useState(() => round.map(r => [...r.answers].sort(() => Math.random() - 0.5)))[0];
  const texts = shuffledTexts[rIdx];
  const whoOptions = data.answers.map((a) => a.who);

  const [matches, setMatches] = useState<Match[]>(texts.map((_, i) => ({ textIdx: i, whoIdx: null })));
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const setMatch = (textIdx: number, whoIdx: number) => {
    setMatches((m) => m.map((x) => x.textIdx === textIdx ? { ...x, whoIdx } : x.whoIdx === whoIdx ? { ...x, whoIdx: null } : x));
  };

  const submit = () => {
    let correct = 0;
    matches.forEach((m) => {
      if (m.whoIdx === null) return;
      const text = texts[m.textIdx];
      if (text.who === whoOptions[m.whoIdx]) correct++;
    });
    setScore((s) => s + correct);
    setRevealed(true);
  };

  const next = async () => {
    setRevealed(false);
    if (rIdx + 1 >= round.length) {
      setDone(true);
      const pts = score * 15;
      await awardPoints(user?.id, pts, score >= round.length * 3);
      await refreshProfile();
      toast.success(`+${pts} points!`);
      return;
    }
    setRIdx(rIdx + 1);
    setMatches(texts.map((_, i) => ({ textIdx: i, whoIdx: null })));
  };

  if (done) {
    return (
      <GameLayout title="Blind Chat" subtitle="Final guess">
        <div className="mt-10 grid place-items-center gap-4 text-center">
          <div className="text-7xl font-display text-gradient">{score}</div>
          <p className="text-muted-foreground">+{score * 15} points</p>
          <Button onClick={() => window.location.reload()} className="bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Play again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Blind Chat" subtitle={`Round ${rIdx + 1} / ${round.length}`} right={<ScorePill score={score} />}>
      <div className="mt-6 grid gap-4">
        <div className="glass-strong rounded-3xl p-5 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Question asked</p>
          <p className="mt-2 font-display text-lg leading-snug">{data.question}</p>
        </div>

        <div className="grid gap-2">
          {texts.map((t, idx) => {
            const m = matches.find((x) => x.textIdx === idx)!;
            const guessName = m.whoIdx !== null ? whoOptions[m.whoIdx] : null;
            const correct = revealed && guessName === t.who;
            const wrong = revealed && guessName && guessName !== t.who;
            return (
              <div key={idx} className={`glass rounded-2xl border p-4 ${correct ? "border-success" : wrong ? "border-destructive" : "border-border"}`}>
                <p className="text-sm">"{t.text}"</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {whoOptions.map((w, wIdx) => {
                    const active = m.whoIdx === wIdx;
                    return (
                      <button
                        key={w}
                        disabled={revealed}
                        onClick={() => setMatch(idx, wIdx)}
                        className={`tap rounded-full px-3 py-1 text-xs font-semibold border ${active ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground"}`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
                {revealed && <p className="mt-2 text-[11px] text-muted-foreground">Actually: <span className="font-bold text-foreground">{t.who}</span></p>}
              </div>
            );
          })}
        </div>

        {!revealed
          ? <Button onClick={submit} disabled={matches.some(m => m.whoIdx === null)} className="h-12 bg-hero shadow-glow"><Shuffle className="mr-2 h-4 w-4" /> Lock in</Button>
          : <Button onClick={next} className="h-12 bg-hero shadow-glow">{rIdx + 1 >= round.length ? "Finish" : "Next round"}</Button>}
      </div>
    </GameLayout>
  );
}
