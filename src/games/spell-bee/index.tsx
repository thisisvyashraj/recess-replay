import { useReplay } from "../useReplay";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameLayout, ScorePill } from "../GameLayout";
import { SPELL_WORDS } from "../data";
import { Volume2, RotateCw, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sfx } from "@/lib/sfx";
import { useRoomScore } from "@/lib/useRoomScore";

const ROUNDS = 8;

type W = { word: string; audio_url?: string | null };

export default function SpellBee() {
  const replay = useReplay();
  const { user, refreshProfile } = useAuth();
  const submitRoom = useRoomScore();
  const [words, setWords] = useState<W[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<"ok" | "err" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("spell_words").select("word, audio_url");
      const list: W[] = data && data.length > 0 ? (data as W[]) : SPELL_WORDS.map(w => ({ word: w }));
      setWords(list.sort(() => Math.random() - 0.5).slice(0, ROUNDS));
      setLoaded(true);
    })();
  }, []);

  const w = words[i];

  const speak = () => {
    if (!w) return;
    if (w.audio_url) {
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = w.audio_url;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    if (!("speechSynthesis" in window)) return toast.error("Speech not supported");
    const u = new SpeechSynthesisUtterance(w.word);
    u.rate = 0.85;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (loaded && !done && w) { setVal(""); setFeedback(null); inputRef.current?.focus(); setTimeout(speak, 300); }
    // eslint-disable-next-line
  }, [i, loaded, done]);

  const submit = () => {
    if (!w) return;
    const ok = val.trim().toLowerCase() === w.word.toLowerCase();
    setFeedback(ok ? "ok" : "err");
    if (ok) { setScore(s => s + 1); sfx.ok(); } else sfx.err();
    setTimeout(() => {
      if (i + 1 >= words.length) finish(ok ? score + 1 : score);
      else setI(i + 1);
    }, 700);
  };

  const finish = async (final: number) => {
    setDone(true);
    const pts = final * 10;
    await awardPoints(user?.id, pts, final >= ROUNDS - 1);
    submitRoom(pts);
    await refreshProfile();
    sfx.win();
    toast.success(`+${pts} points!`);
  };

  if (!loaded) return <GameLayout title="Spell Bee"><div className="mt-20 text-center text-muted-foreground">Loading…</div></GameLayout>;

  if (done) {
    return (
      <GameLayout title="Spell Bee" subtitle="Game over">
        <div className="mt-10 grid place-items-center gap-4 text-center">
          <div className="text-7xl font-display text-gradient animate-pop">{score}/{ROUNDS}</div>
          <p className="text-muted-foreground">+{score * 10} points added</p>
          <Button onClick={replay} className="bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Play again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Spell Bee" subtitle={`Round ${i + 1} of ${ROUNDS}`} right={<ScorePill score={score} total={ROUNDS} />}>
      <div className="mt-8 grid gap-6">
        <button onClick={speak} className="glass-strong mx-auto flex h-32 w-32 items-center justify-center rounded-full tap shadow-glow animate-pulse-glow">
          <Volume2 className="h-12 w-12 text-accent" />
        </button>
        <p className="text-center text-sm text-muted-foreground">Tap to hear it again</p>
        <div className="relative">
          <Input ref={inputRef} value={val} onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="type the word…"
            className={`h-14 rounded-2xl text-center text-lg font-semibold tracking-wide ${
              feedback === "ok" ? "border-success ring-2 ring-success/40" :
              feedback === "err" ? "border-destructive ring-2 ring-destructive/40" : ""
            }`}
            autoCapitalize="off" autoCorrect="off" spellCheck={false}
          />
          {feedback === "ok" && <Check className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />}
          {feedback === "err" && <X className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />}
        </div>
        <Button onClick={submit} disabled={!val.trim()} className="h-12 bg-hero shadow-glow">Submit</Button>
        {feedback === "err" && <p className="text-center text-sm text-muted-foreground">Correct: <span className="font-bold text-foreground">{w?.word}</span></p>}
      </div>
    </GameLayout>
  );
}
