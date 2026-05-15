import { useReplay } from "../useReplay";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GameLayout } from "../GameLayout";
import { TYPE_PARAGRAPHS } from "../data";
import { RotateCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sfx } from "@/lib/sfx";
import { useRoomScore } from "@/lib/useRoomScore";

export default function TypeRace() {
  const { user, refreshProfile } = useAuth();
  const submitRoom = useRoomScore();
  const [text, setText] = useState<string>("");
  const [val, setVal] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [acc, setAcc] = useState(100);
  const [pts, setPts] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("type_sentences").select("text");
      const pool = data && data.length > 0 ? data.map((d: any) => d.text) : TYPE_PARAGRAPHS;
      setText(pool[Math.floor(Math.random() * pool.length)]);
    })();
  }, []);

  useEffect(() => { ref.current?.focus(); }, [text]);

  const onChange = (v: string) => {
    if (start === null) setStart(Date.now());
    setVal(v);
    if (text && v.length >= text.length) finish(v);
  };

  const finish = async (final: string) => {
    const elapsedMin = (Date.now() - (start ?? Date.now())) / 60000;
    const words = final.trim().split(/\s+/).length;
    const correct = [...final].filter((c, i) => c === text[i]).length;
    const a = Math.round((correct / text.length) * 100);
    const w = Math.max(0, Math.round(words / Math.max(elapsedMin, 0.05)));
    setWpm(w); setAcc(a); setDone(true);
    const p = Math.round((w * a) / 50);
    setPts(p);
    await awardPoints(user?.id, p, w >= 60 && a >= 95);
    submitRoom(p);
    await refreshProfile();
    sfx.win();
    toast.success(`+${p} points!`);
  };

  if (!text) return <GameLayout title="Type Race"><div className="mt-20 text-center text-muted-foreground">Loading…</div></GameLayout>;

  if (done) {
    return (
      <GameLayout title="Type Race" subtitle="Finished">
        <div className="mt-10 grid place-items-center gap-6 text-center">
          <div>
            <div className="text-7xl font-display text-gradient mono animate-pop">{wpm}</div>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">words / min</p>
          </div>
          <div className="glass rounded-2xl px-6 py-3">
            <p className="mono text-2xl font-bold">{acc}%</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">accuracy</p>
          </div>
          <p className="text-sm text-muted-foreground">+{pts} points · in a room: rank by WPM</p>
          <Button onClick={replay} className="bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Race again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Type Race" subtitle={start ? "GO!" : "Start typing to begin"}>
      <div className="mt-6 grid gap-4">
        <div className="glass-strong rounded-2xl p-5 leading-relaxed mono text-[15px]">
          {[...text].map((ch, idx) => {
            const typed = val[idx];
            const cls = typed === undefined ? "text-muted-foreground"
              : typed === ch ? "text-foreground"
              : "text-destructive bg-destructive/15 rounded";
            return <span key={idx} className={cls}>{ch}</span>;
          })}
        </div>
        <textarea ref={ref} value={val} onChange={e => onChange(e.target.value)}
          className="h-32 w-full rounded-2xl border border-border bg-input p-4 mono text-base outline-none focus:border-accent"
          placeholder="type here…" autoCapitalize="off" autoCorrect="off" spellCheck={false}
        />
      </div>
    </GameLayout>
  );
}
