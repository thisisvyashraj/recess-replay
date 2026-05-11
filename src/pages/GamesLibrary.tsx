import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { PLAYABLE_SLUGS } from "@/games/registry";
import { Sparkles, Brain, Mic, Music, Image as ImageIcon, MessageSquare, Type, Users, Crown, Hash, Eye, Lock, Drama, Repeat, ListChecks, Trophy, BookOpen, Flame, Ghost, ScrollText, UserX, ShieldQuestion, Camera, Play } from "lucide-react";

const GAMES = [
  { slug: "speed-round", name: "Speed Round", desc: "MCQ blitz across subjects", icon: Brain },
  { slug: "wrong-answer-only", name: "Wrong Answer Only", desc: "Most creative wrong wins", icon: Hash },
  { slug: "hive-mind", name: "Hive Mind", desc: "Match the squad's answer", icon: Users },
  { slug: "spell-bee", name: "Spell Bee", desc: "Hear it. Spell it.", icon: Mic },
  { slug: "emoji-decode", name: "Emoji Decode", desc: "Crack the emoji puzzle", icon: Sparkles },
  { slug: "guess-the-song", name: "Guess the Song", desc: "Emoji song titles", icon: Music },
  { slug: "finish-the-lyric", name: "Finish the Lyric", desc: "Race to the next line", icon: Music },
  { slug: "meme-court", name: "Meme Court", desc: "Caption to win", icon: ImageIcon },
  { slug: "roast-topic", name: "Roast the Topic", desc: "Funniest take wins", icon: Flame },
  { slug: "explain-or-perish", name: "Explain or Perish", desc: "Convince or get cut", icon: MessageSquare },
  { slug: "blind-spot", name: "Blind Spot", desc: "Hide a mistake. Get away.", icon: Eye },
  { slug: "pair-up-quiz", name: "Pair Up Quiz", desc: "Tag-team trivia", icon: Users },
  { slug: "hot-seat", name: "Hot Seat", desc: "Anonymous Qs. Live answers.", icon: Crown },
  { slug: "most-likely-to", name: "Most Likely To", desc: "Drag friends into tiers", icon: ListChecks },
  { slug: "type-race", name: "Type Race", desc: "Fastest fingers in town", icon: Type },
  { slug: "relay-story", name: "Relay Story", desc: "One sentence each", icon: ScrollText },
  { slug: "squad-iq", name: "Squad IQ", desc: "Best answer, judged by friends", icon: Trophy },
  { slug: "blind-chat", name: "Blind Chat", desc: "Guess who you talked to", icon: Ghost },
  { slug: "twenty-questions", name: "20 Questions", desc: "Yes. No. Maybe.", icon: ShieldQuestion },
  { slug: "memory-chain", name: "Memory Chain", desc: "Repeat. Add. Don't forget.", icon: Repeat },
  { slug: "counting-swaps", name: "Counting with Swaps", desc: "1, 2, Tomato, 4...", icon: Hash },
  { slug: "broken-telephone", name: "Broken Telephone", desc: "Memory whisper chain", icon: BookOpen },
  { slug: "saboteur", name: "Saboteur", desc: "Secret role. Tank the team.", icon: UserX },
  { slug: "double-agent", name: "Double Agent", desc: "Two teams. One traitor each.", icon: Drama },
  { slug: "memory-games", name: "Memory Games", desc: "What did you just see?", icon: Camera },
];

export default function GamesLibrary() {
  return (
    <AppShell>
      <div className="px-5 pt-8">
        <h1 className="font-display text-3xl">Games</h1>
        <p className="text-sm text-muted-foreground">25 ways to ruin a friendship.</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {GAMES.map((g, i) => {
            const playable = PLAYABLE_SLUGS.has(g.slug);
            const inner = (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary ring-1 ring-border">
                  <g.icon className="h-5 w-5 text-accent" />
                </span>
                <div>
                  <p className="font-display text-lg leading-tight">{g.name}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground line-clamp-2">{g.desc}</p>
                </div>
                <span className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  playable ? "bg-accent/15 text-accent ring-1 ring-accent/40" : "bg-secondary text-muted-foreground"
                }`}>
                  {playable ? (<><Play className="h-2.5 w-2.5" /> Play</>) : (<><Lock className="h-2.5 w-2.5" /> Soon</>)}
                </span>
              </>
            );
            const baseClass = `group relative flex aspect-[5/6] flex-col justify-between overflow-hidden rounded-3xl glass border border-border p-4 text-left lift tap shine animate-slide-up ${
              playable ? "hover:border-accent" : "opacity-70"
            }`;
            return playable ? (
              <Link key={g.slug} to={`/games/${g.slug}`} className={baseClass} style={{ animationDelay: `${i * 25}ms` }}>
                {inner}
              </Link>
            ) : (
              <button key={g.slug} className={baseClass} style={{ animationDelay: `${i * 25}ms` }} disabled>
                {inner}
              </button>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          More games unlocking each iteration.
        </p>
      </div>
    </AppShell>
  );
}
