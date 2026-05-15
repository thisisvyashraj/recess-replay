import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Crown, Play, Users, ChevronRight, Trophy, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { findGame } from "@/games/registry";
import { avatarSrc } from "@/lib/avatars";
import { setActiveRoom } from "@/lib/useRoomScore";
import { sfx } from "@/lib/sfx";

type Room = { id: string; code: string; name: string; host_id: string; status: string; games: string[]; current_game_index: number; final_leaderboard: any | null };
type Player = { user_id: string; score: number; profile?: { username: string; display_name: string; avatar_url: string | null } };

export default function RoomPage() {
  const { code = "" } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const isHost = !!user && !!room && user.id === room.host_id;

  const loadAll = async () => {
    const { data: r } = await supabase.from("rooms").select("*").eq("code", code.toUpperCase()).maybeSingle();
    if (!r) return;
    setRoom(r as any);
    const { data: ps } = await supabase.from("room_players").select("user_id, score").eq("room_id", r.id);
    const ids = (ps ?? []).map((p: any) => p.user_id);
    const { data: profs } = ids.length ? await supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", ids) : { data: [] as any[] };
    const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
    setPlayers((ps ?? []).map((p: any) => ({ ...p, profile: map.get(p.user_id) })));
  };

  useEffect(() => { loadAll(); /* eslint-disable-next-line */ }, [code]);

  // Realtime
  useEffect(() => {
    if (!room) return;
    const ch = supabase.channel(`room-${room.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `id=eq.${room.id}` }, () => loadAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "room_players", filter: `room_id=eq.${room.id}` }, () => loadAll())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line
  }, [room?.id]);

  // Auto-join if visiting via link
  useEffect(() => {
    if (!room || !user) return;
    if (!players.find(p => p.user_id === user.id)) {
      supabase.from("room_players").upsert({ room_id: room.id, user_id: user.id }).then(() => loadAll());
    }
    // eslint-disable-next-line
  }, [room?.id, user?.id]);

  const sorted = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players]);

  const start = async () => {
    if (!room) return;
    await supabase.from("rooms").update({ status: "in_progress", current_game_index: 0, started_at: new Date().toISOString() }).eq("id", room.id);
    sfx.whoosh();
  };

  const next = async () => {
    if (!room) return;
    const idx = room.current_game_index + 1;
    if (idx >= room.games.length) {
      const final = sorted.map((p, i) => ({ user_id: p.user_id, name: p.profile?.display_name, avatar: p.profile?.avatar_url, score: p.score, rank: i + 1 }));
      await supabase.from("rooms").update({ status: "finished", final_leaderboard: final, finished_at: new Date().toISOString() }).eq("id", room.id);
      sfx.crown();
    } else {
      await supabase.from("rooms").update({ current_game_index: idx }).eq("id", room.id);
      sfx.whoosh();
    }
  };

  const playCurrent = () => {
    if (!room) return;
    const slug = room.games[room.current_game_index];
    const game = findGame(slug);
    if (!game) return toast.error("Game not playable");
    setActiveRoom(room.id);
    nav(`/games/${slug}`);
  };

  const leave = async () => {
    if (!room || !user) return;
    await supabase.from("room_players").delete().eq("room_id", room.id).eq("user_id", user.id);
    setActiveRoom(null);
    nav("/rooms");
  };

  const copyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    toast.success("Code copied");
  };

  if (!room) return <AppShell><div className="px-5 pt-10 text-center text-muted-foreground">Loading room…</div></AppShell>;

  // Final podium
  if (room.status === "finished" && room.final_leaderboard) {
    const board = room.final_leaderboard as any[];
    return (
      <AppShell>
        <div className="px-5 pt-6">
          <div className="flex items-center gap-3">
            <Link to="/rooms" className="glass tap flex h-10 w-10 items-center justify-center rounded-full"><ArrowLeft className="h-4 w-4" /></Link>
            <h1 className="font-display text-2xl">Final Podium</h1>
          </div>

          <div className="mt-8 grid place-items-center">
            {board[0] && (
              <div className="grid place-items-center">
                <Crown className="h-12 w-12 text-warning animate-float drop-shadow-[0_0_20px_hsl(var(--warning)/.5)]" />
                <img src={avatarSrc(board[0].avatar)} alt="" className="mt-2 h-28 w-28 rounded-full bg-secondary object-contain ring-4 ring-warning shadow-glow animate-pop" loading="lazy" width={112} height={112} />
                <p className="mt-3 font-display text-2xl text-gradient">{board[0].name}</p>
                <p className="mono text-3xl font-bold">{board[0].score}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Champion</p>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-2">
            {board.slice(1, 10).map((p, i) => (
              <div key={p.user_id} className="glass flex items-center gap-3 rounded-2xl px-4 py-3 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary mono font-bold">{p.rank}</span>
                <img src={avatarSrc(p.avatar)} alt="" className="h-10 w-10 rounded-xl bg-secondary object-contain" loading="lazy" width={40} height={40} />
                <p className="flex-1 font-semibold">{p.name}</p>
                <span className="mono font-bold text-gradient">{p.score}</span>
                {i === 0 && <Medal className="h-5 w-5 text-muted-foreground" />}
                {i === 1 && <Medal className="h-5 w-5 text-orange-400" />}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-2">
            <Button asChild className="h-12 bg-hero shadow-glow"><Link to="/rooms"><Trophy className="mr-2 h-4 w-4" /> Back to rooms</Link></Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const currentSlug = room.games[room.current_game_index];
  const currentGame = currentSlug ? findGame(currentSlug) : null;

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={() => nav("/rooms")} className="glass tap flex h-10 w-10 items-center justify-center rounded-full"><ArrowLeft className="h-4 w-4" /></button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl truncate">{room.name}</h1>
            <button onClick={copyCode} className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <span className="mono font-bold tracking-[0.3em] text-foreground">{room.code}</span>
              <Copy className="h-3 w-3" />
            </button>
          </div>
          <span className="rounded-full glass px-2 py-1 text-[10px] font-bold uppercase tracking-wider">{room.status}</span>
        </div>

        {/* Game queue */}
        <div className="mt-5 grid gap-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Play className="h-3 w-3" /> Lineup</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {room.games.map((slug, i) => {
              const g = findGame(slug);
              const Icon = g?.icon;
              const active = i === room.current_game_index && room.status === "in_progress";
              const done = i < room.current_game_index || room.status === "finished";
              return (
                <div key={i} className={`glass shrink-0 inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs ${active ? "border-accent shadow-glow" : done ? "opacity-50" : ""}`}>
                  {Icon && <Icon className="h-3.5 w-3.5 text-accent" />}
                  <span className="mono font-bold">{i + 1}.</span>{g?.name ?? slug}
                </div>
              );
            })}
          </div>
        </div>

        {/* State machine */}
        {room.status === "waiting" && (
          <div className="mt-6 glass-strong rounded-3xl p-5 text-center animate-scale-in">
            <p className="font-display text-lg">Waiting in lobby</p>
            <p className="mt-1 text-xs text-muted-foreground">Share the code · {players.length} {players.length === 1 ? "player" : "players"} in</p>
            {isHost ? (
              <Button onClick={start} className="mt-4 h-12 w-full bg-hero shadow-glow">Start <ChevronRight className="ml-1 h-4 w-4" /></Button>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Host will start soon…</p>
            )}
          </div>
        )}

        {room.status === "in_progress" && (
          <div className="mt-6 glass-strong rounded-3xl p-5 text-center animate-scale-in">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Now playing · Round {room.current_game_index + 1}/{room.games.length}</p>
            <p className="mt-1 font-display text-2xl text-gradient">{currentGame?.name ?? currentSlug}</p>
            <p className="mt-1 text-sm text-muted-foreground">{currentGame?.desc}</p>
            <Button onClick={playCurrent} className="mt-4 h-12 w-full bg-hero shadow-glow"><Play className="mr-2 h-4 w-4" /> Play this round</Button>
            {isHost && (
              <Button onClick={next} variant="secondary" className="mt-2 h-11 w-full rounded-xl">
                {room.current_game_index + 1 >= room.games.length ? "Finish & Show Podium" : "Next round →"}
              </Button>
            )}
          </div>
        )}

        {/* Live scoreboard */}
        <h2 className="mt-7 mb-2 flex items-center gap-2 font-display text-lg"><Users className="h-4 w-4" /> Players</h2>
        <div className="grid gap-2">
          {sorted.map((p, i) => (
            <div key={p.user_id} className={`glass flex items-center gap-3 rounded-2xl px-3 py-2.5 animate-slide-up ${p.user_id === room.host_id ? "border-accent/60" : ""}`} style={{ animationDelay: `${i * 50}ms` }}>
              <span className="mono w-5 text-center text-sm text-muted-foreground">{i + 1}</span>
              <img src={avatarSrc(p.profile?.avatar_url)} alt="" className="h-9 w-9 rounded-xl bg-secondary object-contain" loading="lazy" width={36} height={36} />
              <p className="flex-1 truncate font-semibold">{p.profile?.display_name ?? "…"}</p>
              {p.user_id === room.host_id && <Crown className="h-4 w-4 text-warning" />}
              <span className="mono font-bold text-gradient">{p.score}</span>
            </div>
          ))}
        </div>

        <Button variant="ghost" onClick={leave} className="mt-6 w-full text-muted-foreground hover:text-destructive">Leave room</Button>
      </div>
    </AppShell>
  );
}
