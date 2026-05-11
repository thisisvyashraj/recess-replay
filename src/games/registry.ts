import { lazy, ComponentType } from "react";

export type GameMeta = {
  slug: string;
  name: string;
  desc: string;
  Component: ComponentType;
};

export const PLAYABLE_GAMES: GameMeta[] = [
  { slug: "spell-bee", name: "Spell Bee", desc: "Hear it. Spell it.", Component: lazy(() => import("./spell-bee")) },
  { slug: "finish-the-lyric", name: "Finish the Lyric", desc: "Race to the next line", Component: lazy(() => import("./finish-the-lyric")) },
  { slug: "most-likely-to", name: "Most Likely To", desc: "Drag friends into tiers", Component: lazy(() => import("./most-likely-to")) },
  { slug: "type-race", name: "Type Race", desc: "Fastest fingers in town", Component: lazy(() => import("./type-race")) },
  { slug: "relay-story", name: "Relay Story", desc: "One sentence each", Component: lazy(() => import("./relay-story")) },
  { slug: "blind-chat", name: "Blind Chat", desc: "Guess who you talked to", Component: lazy(() => import("./blind-chat")) },
  { slug: "counting-swaps", name: "Counting with Swaps", desc: "1, 2, Tomato, 4...", Component: lazy(() => import("./counting-swaps")) },
  { slug: "memory-games", name: "Memory Games", desc: "What did you just see?", Component: lazy(() => import("./memory-games")) },
];

export const PLAYABLE_SLUGS = new Set(PLAYABLE_GAMES.map(g => g.slug));
export const findGame = (slug: string) => PLAYABLE_GAMES.find(g => g.slug === slug);
