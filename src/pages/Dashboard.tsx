import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { avatarSrc } from "@/lib/avatars";
import { Plus, LogIn, Trophy, Flame, Gamepad2, Shield, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const [code, setCode] = useState("");

  const join = () => {
    if (code.length < 4) return toast.error("Enter a room code");
    toast.info("Rooms launching in the next iteration — code saved!");
  };

  return (
    <AppShell>
      <div className="px-5 pt-8">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{greeting()}</p>
            <h1 className="font-display text-3xl">{profile?.display_name ?? "Friend"}</h1>
          </div>
          <Link to="/profile" className="tap">
            <img src={avatarSrc(profile?.avatar_url)} alt="Your avatar" className="h-14 w-14 rounded-2xl bg-card object-contain shadow-card" />
          </Link>
        </div>

        {/* Admin entry — only for vyashraj */}
        {isAdmin && (
          <Link
            to="/admin"
            className="mt-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-accent p-4 text-primary-foreground shadow-glow tap animate-pop-in"
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
            <Link to="/games">
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
