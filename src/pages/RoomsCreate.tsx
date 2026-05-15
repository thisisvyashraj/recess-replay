import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { PLAYABLE_GAMES } from "@/games/registry";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function RoomsCreate() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = (slug: string) => {
    if (picked.includes(slug)) setPicked(picked.filter(s => s !== slug));
    else if (picked.length >= 5) toast.error("Up to 5 games per room");
    else setPicked([...picked, slug]);
  };

  const create = async () => {
    if (!user) return;
    if (picked.length === 0) return toast.error("Pick at least 1 game");
    setBusy(true);
    const { data: codeData, error: codeErr } = await supabase.rpc("gen_room_code");
    if (codeErr || !codeData) { setBusy(false); return toast.error("Could not create"); }
    const code = codeData as string;
    const { data: room, error } = await supabase.from("rooms").insert({
      code, name: name.trim() || `Room ${code}`,
      host_id: user.id, is_public: isPublic, game_key: picked[0],
      games: picked, current_game_index: 0, status: "waiting",
    }).select().single();
    if (error || !room) { setBusy(false); return toast.error(error?.message ?? "Failed"); }
    await supabase.from("room_players").insert({ room_id: room.id, user_id: user.id });
    setBusy(false);
    nav(`/rooms/${room.code}`);
  };

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/rooms" className="glass tap flex h-10 w-10 items-center justify-center rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-2xl">New room</h1>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Friday game night" className="mt-1 h-12 rounded-xl" />
          </div>
          <label className="flex items-center justify-between glass rounded-2xl px-4 py-3">
            <span className="text-sm">Public (anyone can find)</span>
            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="h-5 w-5 accent-current" />
          </label>

          <div>
            <p className="font-display text-lg flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> Pick games <span className="text-muted-foreground text-xs">({picked.length}/5)</span></p>
            <p className="mt-1 text-xs text-muted-foreground">Order matters — they play in this sequence.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {PLAYABLE_GAMES.map(g => {
                const idx = picked.indexOf(g.slug);
                const sel = idx >= 0;
                const Icon = g.icon;
                return (
                  <button key={g.slug} onClick={() => toggle(g.slug)}
                    className={`glass tap relative rounded-2xl border p-3 text-left transition-all ${sel ? "border-accent shadow-glow" : "border-border hover:border-border-strong"}`}>
                    {sel && <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-bold">{idx + 1}</span>}
                    <span className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-secondary ring-1 ring-border">
                      <Icon className="h-4 w-4 text-accent" />
                    </span>
                    <p className="font-semibold text-sm">{g.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{g.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Button onClick={create} disabled={busy || picked.length === 0} className="h-12 bg-hero shadow-glow">
            {busy ? "Creating…" : <>Create <Check className="ml-2 h-4 w-4" /></>}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
