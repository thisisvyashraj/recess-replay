import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { avatarSrc } from "@/lib/avatars";
import { NotificationBell } from "@/components/NotificationBell";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Plus, LogIn, Trophy, Flame, Gamepad2, Shield, Users, MessageCircleHeart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const [code, setCode] = useState("");
  const navigate = (window as any).__nav__ ?? null;

  const join = async () => {
    const c = code.trim().toUpperCase();
    if (c.length !== 6) return toast.error("Enter the 6-char code");
    window.location.assign(`/rooms/${c}`);
  };

  return (
    <AppShell>
      <div className="px-5 pt-8">
        {/* Greeting */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{greeting()}</p>
            <h1 className="font-display text-3xl truncate">{profile?.display_name ?? "Friend"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Link to="/profile" className="tap shrink-0">
              <img src={avatarSrc(profile?.avatar_url)} alt="Your avatar" className="h-12 w-12 rounded-2xl bg-secondary object-contain ring-1 ring-border" />
            </Link>
          </div>
        </div>
        <AnnouncementBanner />

        {/* Admin entry — only for vyashraj */}
        {isAdmin && (
          <Link
            to="/admin"
            className="mt-5 flex items-center gap-3 rounded-2xl bg-accent-gradient p-4 text-accent-foreground shadow-glow tap animate-pop-in"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20"><Shield className="h-5 w-5" /></span>
            <div className="flex-1">
              <p className="font-display text-lg leading-tight">Admin Panel</p>
              <p className="text-xs opacity-90">Manage banks, confessions & more</p>
            </div>
          </Link>
        )}

        {/* Hero CTAs */}
        <div className="mt-6 grid gap-3">
          <Button asChild size="lg" className="h-16 rounded-2xl bg-hero text-base font-semibold shadow-glow tap">
            <Link to="/rooms/new">
              <Plus className="mr-2 h-5 w-5" /> Create a Room
            </Link>
          </Button>

          <div className="rounded-2xl bg-card p-2 shadow-card">
            <div className="flex items-center gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE"
                maxLength={6}
                className="h-12 rounded-xl border-0 bg-secondary text-center text-lg font-bold tracking-[0.4em]"
              />
              <Button onClick={join} size="lg" variant="secondary" className="h-12 rounded-xl tap">
                <LogIn className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatCard icon={Gamepad2} label="Played" value={profile?.games_played ?? 0} tint="bg-primary/10 text-primary" />
          <StatCard icon={Flame} label="Streak" value={0} tint="bg-accent/15 text-accent-foreground" />
          <StatCard icon={Trophy} label="Points" value={profile?.points ?? 0} tint="bg-success/15 text-success" />
        </div>

        {/* Quick links */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link to="/confessions" className="glass tap flex items-center gap-3 rounded-2xl p-3 hover:border-accent">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
              <MessageCircleHeart className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm leading-tight">Whispers</p>
              <p className="text-[11px] text-muted-foreground">Anonymous board</p>
            </div>
          </Link>
          <Link to="/games" className="glass tap flex items-center gap-3 rounded-2xl p-3 hover:border-accent">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm leading-tight">Games</p>
              <p className="text-[11px] text-muted-foreground">Solo & party</p>
            </div>
          </Link>
        </div>

        {/* Active rooms */}
        <Section title="Active rooms" hint="Friends online">
          <EmptyState
            icon={Users}
            title="No live rooms yet"
            sub="Create one above to get the gang in."
          />
        </Section>

        {/* Recent games */}
        <Section title="Recent games">
          <EmptyState
            icon={Gamepad2}
            title="Your highlight reel starts here"
            sub="Play your first round to see results."
          />
        </Section>
      </div>
    </AppShell>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Up late, huh";
  if (h < 12) return "Good morning,";
  if (h < 17) return "Good afternoon,";
  return "Good evening,";
}

function StatCard({ icon: Icon, label, value, tint }: { icon: any; label: string; value: number | string; tint: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${tint}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="font-display text-2xl leading-none">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-xl">{title}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ icon: Icon, title, sub }: { icon: any; title: string; sub: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-6 text-center">
      <Icon className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-3 font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
