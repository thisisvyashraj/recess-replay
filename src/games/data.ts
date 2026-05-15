// Built-in content packs for the launchable single-device games.
// Admin can extend later — this is the working baseline.

export const SPELL_WORDS = [
  "rendezvous", "occurrence", "mischievous", "embarrass", "necessary",
  "accommodate", "conscience", "liaison", "perseverance", "questionnaire",
  "rhythm", "millennium", "noticeable", "privilege", "separate",
  "vacuum", "weird", "definitely", "hierarchy", "silhouette",
];

export const LYRICS: { line: string; choices: string[]; correct: number; artist: string }[] = [
  { line: "Is this the real life? Is this just…", choices: ["a dream", "fantasy", "the answer", "another lie"], correct: 1, artist: "Queen" },
  { line: "Hello, it's me. I was wondering if after all these…", choices: ["years", "days", "nights", "songs"], correct: 0, artist: "Adele" },
  { line: "We don't talk about…", choices: ["yesterday", "Bruno", "the past", "money"], correct: 1, artist: "Encanto" },
  { line: "I'm in love with the shape of…", choices: ["us", "your face", "you", "the night"], correct: 2, artist: "Ed Sheeran" },
  { line: "Cause baby you're a…", choices: ["star", "diamond", "firework", "queen"], correct: 2, artist: "Katy Perry" },
  { line: "Just a small town girl, livin' in a…", choices: ["lonely world", "broken dream", "dirty city", "perfect lie"], correct: 0, artist: "Journey" },
  { line: "I knew you were trouble when you…", choices: ["called", "smiled", "walked in", "left"], correct: 2, artist: "Taylor Swift" },
  { line: "Despacito, quiero respirar tu…", choices: ["amor", "cuello", "sonrisa", "mirada"], correct: 1, artist: "Luis Fonsi" },
  { line: "Tum hi ho, ab tum hi…", choices: ["jaan", "ho", "rehna", "pyaar"], correct: 1, artist: "Arijit Singh" },
  { line: "Levitating, you, you're the one I'm…", choices: ["wanting", "needing", "calling", "kissing"], correct: 2, artist: "Dua Lipa" },
];

export const MOST_LIKELY_PROMPTS = [
  "Most likely to ghost the group chat",
  "Most likely to become famous on TikTok",
  "Most likely to text their ex at 2am",
  "Most likely to survive a zombie apocalypse",
  "Most likely to start a podcast nobody asked for",
  "Most likely to cry at a Pixar movie",
  "Most likely to marry rich",
  "Most likely to get arrested at a protest",
  "Most likely to fake their death",
  "Most likely to forget your birthday",
  "Most likely to rule the world",
  "Most likely to date a celebrity",
];

export const TYPE_PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog while the cat watches silently from the windowsill, plotting its inevitable revenge against the household goldfish.",
  "Innovation distinguishes between a leader and a follower; details matter and it is worth waiting to get it right because design is not just what it looks like.",
  "Friendship is born at that moment when one person says to another what, you too? I thought I was the only one. The rest is just history written in midnight texts.",
  "She sells seashells by the seashore and the shells she sells are surely seashells, so if she sells seashells by the seashore she is selling seashore seashells.",
];

export const RELAY_STARTERS = [
  "It started with a knock at the door at exactly 3:33 AM…",
  "Nobody noticed when the statue in the park slowly turned its head…",
  "The text from an unknown number simply said: 'They know.'",
  "She opened the locker and a thousand butterflies flew out, each one carrying…",
  "On the day the moon split in half, the only person who wasn't surprised was…",
];

// Blind chat — fake "anonymous answers" from preset friends. Player guesses who said what.
export const BLIND_CHAT_ROUNDS = [
  {
    question: "What's your most embarrassing google search?",
    answers: [
      { who: "Riya", text: "is it normal to talk to my plants" },
      { who: "Arjun", text: "how to pretend to like coffee" },
      { who: "Meera", text: "are aliens real and do they have wifi" },
      { who: "Kabir", text: "how to fold a fitted sheet help" },
    ],
  },
  {
    question: "What's your secret comfort food?",
    answers: [
      { who: "Riya", text: "cold maggi straight from the pot" },
      { who: "Arjun", text: "ketchup on bread, fight me" },
      { who: "Meera", text: "ice cream with chili powder" },
      { who: "Kabir", text: "cereal but with orange juice" },
    ],
  },
  {
    question: "What's the lie you tell most often?",
    answers: [
      { who: "Riya", text: "i'm 5 minutes away" },
      { who: "Arjun", text: "yeah i read the terms" },
      { who: "Meera", text: "i'm so over my ex" },
      { who: "Kabir", text: "no thanks i'm full" },
    ],
  },
];

// Only widely-supported emojis (no Emoji 13+ exclusives like 🪐🛸🪩🪁🪼🪨 that render as boxes on older systems)
export const MEMORY_GRIDS = [
  ["🍕","🦊","🌙","🎸","⭐","🍓","⚡","🐙","🎲"],
  ["🍔","🐳","🌵","🎈","🚀","❄️","🎯","🍉","🦄"],
  ["🍩","🐧","🌺","🎺","💎","🍇","🌈","🐝","🍀"],
  ["🍪","🐯","🌻","🎮","🔥","🍒","🎵","🦋","🍑"],
];
export const MEMORY_POOL = [
  "🍕","🦊","🌙","🎸","⭐","🍓","⚡","🐙","🎲",
  "🍔","🐳","🌵","🎈","🚀","❄️","🎯","🍉","🦄",
  "🍩","🐧","🌺","🎺","💎","🍇","🌈","🐝","🍀",
  "🍪","🐯","🌻","🎮","🔥","🍒","🎵","🦋","🍑",
  "🐬","🌮","🍦","🐢","🥑","🐝","🍋","🐱","🐶",
];
