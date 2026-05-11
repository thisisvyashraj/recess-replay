import { supabase } from "@/integrations/supabase/client";

export async function awardPoints(userId: string | undefined, points: number, won = false) {
  if (!userId || points <= 0) return;
  const { data: p } = await supabase.from("profiles").select("points,games_played,wins").eq("id", userId).maybeSingle();
  if (!p) return;
  await supabase.from("profiles").update({
    points: (p.points ?? 0) + points,
    games_played: (p.games_played ?? 0) + 1,
    wins: (p.wins ?? 0) + (won ? 1 : 0),
  }).eq("id", userId);
}
