import fox from "@/assets/av-fox.png";
import cat from "@/assets/av-cat.png";
import panda from "@/assets/av-panda.png";
import bunny from "@/assets/av-bunny.png";
import raccoon from "@/assets/av-raccoon.png";
import axolotl from "@/assets/av-axolotl.png";

export const AVATARS = [
  { id: "fox", src: fox, label: "Fox" },
  { id: "cat", src: cat, label: "Cat" },
  { id: "panda", src: panda, label: "Panda" },
  { id: "bunny", src: bunny, label: "Bunny" },
  { id: "raccoon", src: raccoon, label: "Raccoon" },
  { id: "axolotl", src: axolotl, label: "Axolotl" },
] as const;

export type AvatarId = typeof AVATARS[number]["id"];

export function avatarSrc(id: string | null | undefined): string {
  const found = AVATARS.find((a) => a.id === id);
  return found?.src ?? fox;
}
