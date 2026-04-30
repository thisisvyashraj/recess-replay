import { AppShell } from "@/components/AppShell";
import { Sparkles, Brain, Mic, Music, Image as ImageIcon, MessageSquare, Type, Users, Crown, Hash, Eye, Lock, Drama, Skull, Repeat, ListChecks, Trophy, BookOpen, Theater, Flame, Ghost, ScrollText, UserX, ShieldQuestion, Camera } from "lucide-react";

const GAMES = [
  { name: "Speed Round", desc: "MCQ blitz across subjects", icon: Brain, hue: "from-primary/20 to-primary/5" },
  { name: "Wrong Answer Only", desc: "Most creative wrong wins", icon: Hash, hue: "from-accent/20 to-accent/5" },
  { name: "Hive Mind", desc: "Match the squad's answer", icon: Users, hue: "from-primary/20 to-accent/10" },
  { name: "Spell Bee", desc: "Hear it. Spell it.", icon: Mic, hue: "from-accent/20 to-primary/10" },
  { name: "Emoji Decode", desc: "Crack the emoji puzzle", icon: Sparkles, hue: "from-primary/20 to-primary/5" },
  { name: "Guess the Song", desc: "Emoji song titles", icon: Music, hue: "from-accent/20 to-accent/5" },
  { name: "Finish the Lyric", desc: "Race to the next line", icon: Music, hue: "from-primary/20 to-accent/10" },
  { name: "Meme Court", desc: "Caption to win", icon: ImageIcon, hue: "from-accent/20 to-primary/10" },
  { name: "Roast the Topic", desc: "Funniest take wins", icon: Flame, hue: "from-accent/20 to-accent/5" },
  { name: "Explain or Perish", desc: "Convince or get cut", icon: MessageSquare, hue: "from-primary/20 to-primary/5" },
  { name: "Blind Spot", desc: "Hide a mistake. Get away with it.", icon: Eye, hue: "from-primary/20 to-accent/10" },
  { name: "Pair Up Quiz", desc: "Tag-team trivia", icon: Users, hue: "from-accent/20 to-primary/10" },
  { name: "Hot Seat", desc: "Anonymous Qs. Live answers.", icon: Crown, hue: "from-accent/20 to-accent/5" },
  { name: "Most Likely To", desc: "Drag friends into tiers", icon: ListChecks, hue: "from-primary/20 to-primary/5" },
  { name: "Type Race", desc: "Fastest fingers in town", icon: Type, hue: "from-primary/20 to-accent/10" },
  { name: "Relay Story", desc: "One sentence each", icon: ScrollText, hue: "from-accent/20 to-primary/10" },
  { name: "Squad IQ", desc: "Best answer, judged by friends", icon: Trophy, hue: "from-accent/20 to-accent/5" },
  { name: "Blind Chat", desc: "Guess who you talked to", icon: Ghost, hue: "from-primary/20 to-primary/5" },
  { name: "20 Questions", desc: "Yes. No. Maybe.", icon: ShieldQuestion, hue: "from-primary/20 to-accent/10" },
  { name: "Memory Chain", desc: "Repeat. Add. Don't forget.", icon: Repeat, hue: "from-accent/20 to-primary/10" },
  { name: "Counting with Swaps", desc: "1, 2, Tomato, 4...", icon: Hash, hue: "from-accent/20 to-accent/5" },
  { name: "Broken Telephone", desc: "Memory whisper chain", icon: BookOpen, hue: "from-primary/20 to-primary/5" },
  { name: "Saboteur", desc: "Secret role. Tank the team.", icon: UserX, hue: "from-primary/20 to-accent/10" },
  { name: "Double Agent", desc: "Two teams. One traitor each.", icon: Drama, hue: "from-accent/20 to-primary/10" },
  { name: "Memory Games", desc: "What did you just see?", icon: Camera, hue: "from-accent/20 to-accent/5" },
];

export default function GamesLibrary() {
  return (
    <AppShell>
      <div className="px-5 pt-8">
        <h1 className="font-display text-3xl">Games</h1>
        <p className="text-sm text-muted-foreground">25 ways to ruin a friendship.</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {GAMES.map((g, i) => (
            <button
              key={g.name}
              className={`group relative flex aspect-[5/6] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${g.hue} bg-card p-4 text-left shadow-card lift tap animate-slide-up`}
              style={{ animationDelay: `${i * 25}ms` }}
              onClick={() => {}}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-soft">
                <g.icon className="h-5 w-5 text-primary" />
              </span>
              <div>
                <p className="font-display text-lg leading-tight">{g.name}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground line-clamp-2">{g.desc}</p>
              </div>
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                <Lock className="h-2.5 w-2.5" /> Soon
              </span>
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Realtime rooms launching in the next iteration.
        </p>
      </div>
    </AppShell>
  );
}
