import fox from "@/assets/av-fox.png";
import cat from "@/assets/av-cat.png";
import panda from "@/assets/av-panda.png";
import bunny from "@/assets/av-bunny.png";
import raccoon from "@/assets/av-raccoon.png";
import axolotl from "@/assets/av-axolotl.png";
import tiger from "@/assets/av-tiger.png";
import owl from "@/assets/av-owl.png";
import frog from "@/assets/av-frog.png";
import penguin from "@/assets/av-penguin.png";

export const AVATARS = [
  { id: "fox", src: fox, label: "Fox" },
  { id: "cat", src: cat, label: "Cat" },
  { id: "panda", src: panda, label: "Panda" },
  { id: "bunny", src: bunny, label: "Bunny" },
  { id: "raccoon", src: raccoon, label: "Raccoon" },
  { id: "axolotl", src: axolotl, label: "Axolotl" },
  { id: "tiger", src: tiger, label: "Tiger" },
  { id: "owl", src: owl, label: "Owl" },
  { id: "frog", src: frog, label: "Frog" },
  { id: "penguin", src: penguin, label: "Penguin" },
] as const;

export type AvatarId = typeof AVATARS[number]["id"];

export function avatarSrc(id: string | null | undefined): string {
  const found = AVATARS.find((a) => a.id === id);
  return found?.src ?? fox;
}
