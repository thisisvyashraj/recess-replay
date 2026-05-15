import { useReplay } from "../useReplay";
// Wrong Answer Only — give the most creatively wrong answer to a question
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameLayout, ScorePill } from "../GameLayout";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { sfx } from "@/lib/sfx";
import { useRoomScore } from "@/lib/useRoomScore";
import { ArrowRight, RotateCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

const PROMPTS = [
  "What is 2 + 2?",
  "Who wrote Romeo and Juliet?",
  "What is the capital of France?",
  "What color is the sky?",
  "How many days are in a week?",
  "What does a cow say?",
  "What is H2O?",
  "Who painted the Mona Lisa?",
  "What planet do we live on?",
  "How many legs does a spider have?",
  "What is the largest ocean?",
  "What language do they speak in Brazil?",
  "Who invented the lightbulb?",
  "What is the boiling point of water?",
  "What's a baby kangaroo called?",
  "What year did WWII end?",
  "What's the tallest mountain on Earth?",
  "What is the chemical symbol for gold?",
];

// "Right" answers we will reject (case insensitive contains check)
const REAL = [
  ["4","four"], ["shakespeare"], ["paris"], ["blue"], ["7","seven"], ["moo"], ["water"], ["da vinci","leonardo"],
  ["earth"], ["8","eight"], ["pacific"], ["portuguese"], ["edison"], ["100"], ["joey"], ["1945"], ["everest"], ["au"],
];

export default function WrongAnswersOnly() {
  const { user, refreshProfile } = useAuth();
  const submitRoom = useRoomScore();
  const [pool, setPool] = useState<{ q: string; idx: number }[]>([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<{ q: string; a: string; ok: boolean }[]>([]);
  const [val, setVal] = useState("");
  const [done, setDone] = useState(false);
  const TOTAL = 6;

  useEffect(() => {
    const indices = Array.from({ length: PROMPTS.length }, (_, k) => k).sort(() => Math.random() - 0.5).slice(0, TOTAL);
    setPool(indices.map(k => ({ q: PROMPTS[k], idx: k })));
  }, []);

  if (pool.length === 0 && !done) return <GameLayout title="Wrong Answer Only"><div className="mt-20 text-center text-muted-foreground">Loading…</div></GameLayout>;

  const cur = pool[i];

  const score = answers.filter(a => a.ok).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = val.trim().toLowerCase();
    if (!v) return;
    const reals = REAL[cur.idx] ?? [];
    const isReal = reals.some(r => v.includes(r));
    if (isReal) {
      sfx.err();
      toast.error("Too correct! Try again, more wrong.");
      return;
    }
    const isCreative = v.length >= 3;
    sfx.ok();
    const next = [...answers, { q: cur.q, a: val.trim(), ok: isCreative }];
    setAnswers(next);
    setVal("");
    if (i + 1 >= pool.length) finish(next);
    else setI(i + 1);
  };

  const finish = async (final: { q: string; a: string; ok: boolean }[]) => {
    setDone(true);
    const pts = final.filter(a => a.ok).length * 10;
    await awardPoints(user?.id, pts, pts >= 50);
    submitRoom(pts);
    await refreshProfile();
    sfx.win();
    toast.success(`+${pts} points`);
  };

  if (done) {
    const pts = answers.filter(a => a.ok).length * 10;
    return (
      <GameLayout title="Wrong Answer Only" subtitle="Your wrongness scroll">
        <div className="mt-6 grid gap-2">
          {answers.map((a, idx) => (
            <div key={idx} className="glass rounded-2xl p-4 animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
              <p className="text-xs text-muted-foreground">{a.q}</p>
              <p className="mt-1 font-display text-lg">"{a.a}"</p>
            </div>
          ))}
          <div className="mt-4 text-center">
            <p className="font-display text-5xl text-gradient mono">{pts}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">points</p>
          </div>
          <Button onClick={replay} className="mt-2 h-12 bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Play again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Wrong Answer Only" subtitle={`${i + 1} / ${pool.length}`} right={<ScorePill score={score} total={pool.length} />}>
      <div className="mt-8 grid gap-5">
        <div className="glass-strong rounded-3xl p-6 text-center animate-scale-in" key={i}>
          <p className="font-display text-2xl leading-tight">{cur.q}</p>
          <p className="mt-3 text-xs text-accent flex items-center justify-center gap-1"><Sparkles className="h-3 w-3" /> WRONG ANSWERS ONLY</p>
        </div>
        <form onSubmit={submit} className="grid gap-2">
          <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Be wrong, but creative…" className="h-12 rounded-xl text-center" autoFocus maxLength={80} />
          <Button type="submit" className="h-12 rounded-xl bg-hero shadow-glow">
            Submit <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </form>
      </div>
    </GameLayout>
  );
}
