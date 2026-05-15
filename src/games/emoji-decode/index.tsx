import { useReplay } from "../useReplay";
// Emoji Decode — guess the movie/show/phrase from emoji clues
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameLayout, ScorePill } from "../GameLayout";
import { useAuth } from "@/contexts/AuthContext";
import { awardPoints } from "../awardPoints";
import { sfx } from "@/lib/sfx";
import { useRoomScore } from "@/lib/useRoomScore";
import { RotateCw, Lightbulb } from "lucide-react";
import { toast } from "sonner";

type Puzzle = { emoji: string; answer: string; hint?: string; category: string };

const PUZZLES: Puzzle[] = [
  { emoji: "🦁👑", answer: "lion king", hint: "Disney", category: "Movie" },
  { emoji: "🕷️🧑", answer: "spiderman", hint: "Marvel", category: "Movie" },
  { emoji: "❄️👸", answer: "frozen", hint: "Let it go", category: "Movie" },
  { emoji: "🚢🧊💔", answer: "titanic", hint: "1997 epic", category: "Movie" },
  { emoji: "🦖🏝️", answer: "jurassic park", hint: "Dinosaurs", category: "Movie" },
  { emoji: "👽📞🏠", answer: "et", hint: "Phone home", category: "Movie" },
  { emoji: "🐟🔍", answer: "finding nemo", hint: "Pixar", category: "Movie" },
  { emoji: "🔴💊🕶️", answer: "the matrix", hint: "Neo", category: "Movie" },
  { emoji: "🧙‍♂️⚡🤓", answer: "harry potter", hint: "Hogwarts", category: "Movie" },
  { emoji: "🚗🏁⚡", answer: "fast and furious", hint: "Family", category: "Movie" },
  { emoji: "🦇👨", answer: "batman", hint: "Gotham", category: "Movie" },
  { emoji: "🌶️🐷🥒", answer: "veggie tales", hint: "Singing veggies", category: "Show" },
  { emoji: "🧊🔥🌬️🌍", answer: "avatar", hint: "Last airbender", category: "Show" },
  { emoji: "👑🐝", answer: "queen bey", hint: "Beyoncé", category: "Person" },
  { emoji: "🐀🍝👨‍🍳", answer: "ratatouille", hint: "Pixar Paris", category: "Movie" },
  { emoji: "👻🚫", answer: "ghostbusters", hint: "Who you gonna call", category: "Movie" },
  { emoji: "🍫🏭", answer: "willy wonka", hint: "Golden ticket", category: "Movie" },
  { emoji: "🤖❤️", answer: "wall e", hint: "Pixar robot", category: "Movie" },
  { emoji: "🐠🐟", answer: "finding dory", hint: "Sequel", category: "Movie" },
  { emoji: "🏰🐉🧚", answer: "shrek", hint: "Ogre love", category: "Movie" },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export default function EmojiDecode() {
  const { user, refreshProfile } = useAuth();
  const submitRoom = useRoomScore();
  const [pool, setPool] = useState<Puzzle[]>([]);
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [score, setScore] = useState(0);
  const [hintShown, setHintShown] = useState(false);
  const [done, setDone] = useState(false);
  const TOTAL = 8;

  useEffect(() => {
    setPool([...PUZZLES].sort(() => Math.random() - 0.5).slice(0, TOTAL));
  }, []);

  const cur = pool[i];
  if (!cur && !done) return <GameLayout title="Emoji Decode"><div className="mt-20 text-center text-muted-foreground">Loading…</div></GameLayout>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cur) return;
    const ok = norm(val) === norm(cur.answer);
    if (ok) {
      const earned = hintShown ? 5 : 10;
      sfx.ok(); setScore(s => s + earned);
      toast.success(`+${earned} · "${cur.answer}"`);
      next();
    } else {
      sfx.err();
      toast.error(`Not quite — was "${cur.answer}"`);
      next();
    }
  };

  const skip = () => { sfx.tap(); toast.message(`Was "${cur.answer}"`); next(); };

  const next = async () => {
    setVal(""); setHintShown(false);
    if (i + 1 >= pool.length) {
      setDone(true);
      await awardPoints(user?.id, score, score >= 60);
      submitRoom(score);
      await refreshProfile();
      sfx.win();
    } else setI(i + 1);
  };

  if (done) {
    return (
      <GameLayout title="Emoji Decode" subtitle="Round complete">
        <div className="mt-10 text-center">
          <p className="font-display text-7xl text-gradient mono animate-pop">{score}</p>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">points</p>
          <Button onClick={replay} className="mt-8 bg-hero shadow-glow"><RotateCw className="mr-2 h-4 w-4" /> Play again</Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Emoji Decode" subtitle={`${i + 1} / ${pool.length} · ${cur.category}`} right={<ScorePill score={score} />}>
      <div className="mt-8 grid gap-5">
        <div className="glass-strong rounded-3xl p-10 text-center animate-scale-in" key={i}>
          <p className="text-6xl leading-none tracking-widest">{cur.emoji}</p>
          {hintShown && cur.hint && <p className="mt-4 text-sm text-accent">💡 {cur.hint}</p>}
        </div>
        <form onSubmit={submit} className="grid gap-2">
          <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Your guess…" className="h-12 rounded-xl text-center" autoFocus />
          <div className="grid grid-cols-3 gap-2">
            <Button type="button" onClick={() => { setHintShown(true); sfx.tap(); }} disabled={hintShown} variant="outline" className="h-11 rounded-xl">
              <Lightbulb className="mr-1 h-4 w-4" /> Hint
            </Button>
            <Button type="button" onClick={skip} variant="ghost" className="h-11 rounded-xl">Skip</Button>
            <Button type="submit" className="h-11 rounded-xl bg-hero shadow-glow">Guess</Button>
          </div>
        </form>
      </div>
    </GameLayout>
  );
}
