import { lazy, ComponentType } from "react";
import { Mic, Music, ListChecks, Type, ScrollText, Ghost, Hash, Camera, Repeat, Sparkles, UserX } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type GameMeta = {
  slug: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  Component: ComponentType;
};

export const PLAYABLE_GAMES: GameMeta[] = [
  { slug: "spell-bee", name: "Spell Bee", desc: "Hear it. Spell it.", icon: Mic, Component: lazy(() => import("./spell-bee")) },
  { slug: "finish-the-lyric", name: "Finish the Lyric", desc: "Race to the next line", icon: Music, Component: lazy(() => import("./finish-the-lyric")) },
  { slug: "most-likely-to", name: "Most Likely To", desc: "Drag friends into tiers", icon: ListChecks, Component: lazy(() => import("./most-likely-to")) },
  { slug: "type-race", name: "Type Race", desc: "Fastest fingers in town", icon: Type, Component: lazy(() => import("./type-race")) },
  { slug: "relay-story", name: "Relay Story", desc: "One sentence each", icon: ScrollText, Component: lazy(() => import("./relay-story")) },
  { slug: "blind-chat", name: "Blind Chat", desc: "Guess who you talked to", icon: Ghost, Component: lazy(() => import("./blind-chat")) },
  { slug: "counting-swaps", name: "Counting with Swaps", desc: "1, 2, Tomato, 4...", icon: Hash, Component: lazy(() => import("./counting-swaps")) },
  { slug: "memory-games", name: "Memory Games", desc: "What did you just see?", icon: Camera, Component: lazy(() => import("./memory-games")) },
  { slug: "memory-chain", name: "Memory Chain", desc: "Watch. Repeat. Don't forget.", icon: Repeat, Component: lazy(() => import("./memory-chain")) },
  { slug: "emoji-decode", name: "Emoji Decode", desc: "Crack the emoji puzzle", icon: Sparkles, Component: lazy(() => import("./emoji-decode")) },
  { slug: "wrong-answers-only", name: "Wrong Answers Only", desc: "Be creatively wrong", icon: UserX, Component: lazy(() => import("./wrong-answers-only")) },
];

export const PLAYABLE_SLUGS = new Set(PLAYABLE_GAMES.map(g => g.slug));
export const findGame = (slug: string) => PLAYABLE_GAMES.find(g => g.slug === slug);
