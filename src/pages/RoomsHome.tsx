import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, LogIn, Plus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { sfx } from "@/lib/sfx";

export default function RoomsHome() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [mine, setMine] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("rooms")
        .select("id, code, name, status, games, current_game_index, host_id")
        .or(`host_id.eq.${user.id},is_public.eq.true`)
        .order("created_at", { ascending: false })
        .limit(10);
      setMine(data ?? []);
    })();
  }, [user]);

  const join = async () => {
    const c = code.trim().toUpperCase();
    if (c.length !== 6) return toast.error("Enter the 6-char code");
    const { data: room } = await supabase.from("rooms").select("id, code").eq("code", c).maybeSingle();
    if (!room) return toast.error("No such room");
    // ensure player row
    if (user) {
      await supabase.from("room_players").upsert({ room_id: room.id, user_id: user.id }, { onConflict: "room_id,user_id" });
    }
    sfx.whoosh();
    nav(`/rooms/${room.code}`);
  };

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="glass tap flex h-10 w-10 items-center justify-center rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-2xl">Rooms</h1>
        </div>

        <div className="mt-6 grid gap-3">
          <Button asChild size="lg" className="h-14 rounded-2xl bg-hero shadow-glow tap">
            <Link to="/rooms/new"><Plus className="mr-2 h-5 w-5" /> Create room</Link>
          </Button>

          <div className="glass rounded-2xl p-2">
            <div className="flex items-center gap-2">
              <Input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="ROOM CODE" maxLength={6}
                className="h-12 rounded-xl border-0 bg-secondary text-center text-lg font-bold tracking-[0.4em] mono" />
              <Button onClick={join} size="lg" variant="secondary" className="h-12 rounded-xl tap">
                <LogIn className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <h2 className="mt-8 mb-3 font-display text-lg flex items-center gap-2"><Users className="h-4 w-4" /> Public & yours</h2>
        <div className="grid gap-2">
          {mine.length === 0 && <p className="text-sm text-muted-foreground">No rooms yet.</p>}
          {mine.map(r => (
            <Link key={r.id} to={`/rooms/${r.code}`} className="glass tap flex items-center justify-between rounded-2xl px-4 py-3 hover:border-accent">
              <div>
                <p className="font-semibold">{r.name || "Untitled room"}</p>
                <p className="text-xs text-muted-foreground mono">{r.code} · {r.status} · {r.games?.length ?? 0} games</p>
              </div>
              <span className="text-accent">→</span>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
