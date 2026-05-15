import { useReplay } from "../useReplay";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameLayout, ScorePill } from "../GameLayout";
import { LYRICS } from "../data";
import { RotateCw, Volume2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sfx } from "@/lib/sfx";
import { useRoomScore } from "@/lib/useRoomScore";

type Clip = { id?: string; artist: string; line: string; choices: string[]; correct: number; audio_url?: string | null };

const PLAYS_PER_CLIP = 3;

function fallbackClips(): Clip[] {
  return [...LYRICS].sort(() => Math.random() - 0.5).slice(0, 8);
}

export default function FinishLyric() {
  const { user, refreshProfile } = useAuth();
  const submitRoom = useRoomScore();
  const [rounds, setRounds] = useState<Clip[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [playsLeft, setPlaysLeft] = useState(PLAYS_PER_CLIP);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("lyric_clips").select("id, artist, line, choices, correct, audio_url");
      if (data && data.length > 0) {
        const cs = (data as any[]).map((d) => ({ ...d, choices: Array.isArray(d.choices) ? d.choices : JSON.parse(d.choices) })) as Clip[];
        setRounds(cs.sort(() => Math.random() - 0.5).slice(0, 8));
      } else setRounds(fallbackClips());
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { setPlaysLeft(PLAYS_PER_CLIP); }, [i]);

  const r = rounds[i];

  const play = () => {
    if (!r?.audio_url || playsLeft <= 0) return;
    if (!audioRef.current) audioRef.current = new Audio(r.audio_url);
    audioRef.current.src = r.audio_url;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => toast.error("Could not play clip"));
    setPlaysLeft((p) => p - 1);
  };

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const ok = idx === r.correct;
    if (ok) { setScore((s) => s + 1); sfx.ok(); } else sfx.err();
    setTimeout(() => {
      if (i + 1 >= rounds.length) finish(ok ? score + 1 : score);
      else { setI(i + 1); setPicked(null); }
    }, 1100);
  };

  const finish = async (final: number) => {
    setDone(true);
    const pts = final * 12;
    await awardPoints(user?.id, pts, final >= 7);
    submitRoom(pts);
    await refreshProfile();
    sfx.win();
    toast.success(`+${pts} points!`);
  };

  if (!loaded || rounds.length === 0) {
    return <GameLayout title="Finish the Lyric"><div className="mt-20 text-center text-muted-foreground">Loading clips…</div></GameLayout>;
  }

  if (done) {
    return (
      <GameLayout title="Finish the Lyric" subtitle="Wrap">
        <div className="mt-10 grid place-items-center gap-4 text-center">
          <div className="text-7xl font-display text-gradient animate-pop">{score}/{rounds.length}</div>
          <p className="text-muted-foreground">+{score * 12} points</p>
          <Button onClick={replay} className="bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Play again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Finish the Lyric" subtitle={`Round ${i + 1} / ${rounds.length}`} right={<ScorePill score={score} total={rounds.length} />}>
      <div className="mt-6 grid gap-5">
        <div className="glass-strong rounded-3xl p-6 text-center animate-scale-in">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.artist}</p>
          {r.audio_url ? (
            <div className="mt-4 grid place-items-center gap-2">
              <button onClick={play} disabled={playsLeft === 0} className="glass tap mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-glow disabled:opacity-40">
                <Volume2 className="h-8 w-8 text-accent" />
              </button>
              <p className="text-xs text-muted-foreground">Plays left: <span className="mono font-bold text-foreground">{playsLeft}</span></p>
            </div>
          ) : (
            <p className="mt-3 font-display text-2xl leading-tight">{r.line}</p>
          )}
        </div>
        <div className="grid gap-2">
          {r.choices.map((c, idx) => {
            const isPicked = picked === idx;
            const isRight = picked !== null && idx === r.correct;
            const isWrong = isPicked && idx !== r.correct;
            return (
              <button key={idx} onClick={() => choose(idx)} disabled={picked !== null}
                className={`glass tap rounded-2xl border px-4 py-4 text-left text-base font-medium transition-all ${
                  isRight ? "border-success bg-success/10" :
                  isWrong ? "border-destructive bg-destructive/10" :
                  "border-border hover:border-accent"
                }`}>
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
