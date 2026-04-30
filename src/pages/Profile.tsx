import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { avatarSrc, AVATARS } from "@/lib/avatars";
import { LogOut, Settings, Trophy, Gamepad2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { profile, signOut, refreshProfile } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const pickAvatar = async (id: string) => {
    if (!profile) return;
    const { error } = await supabase.from("profiles").update({ avatar_url: id }).eq("id", profile.id);
    if (error) return toast.error(error.message);
    await refreshProfile();
    setOpen(false);
    toast.success("Avatar updated");
  };

  const doSignOut = async () => {
    await signOut();
    nav("/welcome", { replace: true });
  };

  return (
    <AppShell>
      <div className="px-5 pt-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl">Profile</h1>
          <button onClick={doSignOut} className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card tap">
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 rounded-3xl bg-hero p-1 shadow-glow">
          <div className="rounded-[22px] bg-card p-6">
            <button onClick={() => setOpen(true)} className="relative mx-auto block tap">
              <img src={avatarSrc(profile?.avatar_url)} alt="avatar" className="mx-auto h-28 w-28 rounded-3xl bg-secondary object-contain" />
              <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
                <Settings className="h-4 w-4" />
              </span>
            </button>
            <p className="mt-4 text-center font-display text-2xl">{profile?.display_name}</p>
            <p className="text-center text-sm text-muted-foreground">@{profile?.username}</p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Stat icon={Gamepad2} label="Played" value={profile?.games_played ?? 0} />
              <Stat icon={Trophy} label="Wins" value={profile?.wins ?? 0} />
              <Stat icon={Sparkles} label="Points" value={profile?.points ?? 0} />
            </div>
          </div>
        </div>

        <h2 className="mt-8 font-display text-xl">Badge shelf</h2>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-border bg-card/40" />
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">Win games to unlock badges</p>

        <Button onClick={doSignOut} variant="outline" size="lg" className="mt-8 h-12 w-full rounded-2xl tap">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Pick an avatar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                onClick={() => pickAvatar(a.id)}
                className={`aspect-square rounded-2xl bg-card p-2 shadow-card tap lift ${
                  profile?.avatar_url === a.id ? "ring-4 ring-primary" : ""
                }`}
              >
                <img src={a.src} alt={a.label} className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div>
      <Icon className="mx-auto h-4 w-4 text-muted-foreground" />
      <p className="mt-1 font-display text-2xl">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
