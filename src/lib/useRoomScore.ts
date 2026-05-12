// When a game finishes, if it was launched from inside a room, push the score to the room.
// We use sessionStorage to mark the active room context.
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const KEY = "active_room";
export function setActiveRoom(roomId: string | null) {
  if (!roomId) sessionStorage.removeItem(KEY);
  else sessionStorage.setItem(KEY, roomId);
}
export function getActiveRoom(): string | null {
  return sessionStorage.getItem(KEY);
}

export function useRoomScore() {
  const { user } = useAuth();
  return useCallback(async (points: number) => {
    const roomId = getActiveRoom();
    if (!roomId || !user) return;
    const { data } = await supabase.from("room_players").select("score").eq("room_id", roomId).eq("user_id", user.id).maybeSingle();
    const newScore = (data?.score ?? 0) + points;
    await supabase.from("room_players").update({ score: newScore }).eq("room_id", roomId).eq("user_id", user.id);
  }, [user]);
}
