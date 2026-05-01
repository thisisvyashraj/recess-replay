import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AVATARS } from "@/lib/avatars";
import { ArrowLeft, Check, Loader2, ArrowRight } from "lucide-react";
import { z } from "zod";

const usernameSchema = z
  .string()
  .min(3, "At least 3 characters")
  .max(20, "Max 20 characters")
  .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only");

export default function Signup() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);

  const [displayName, setDisplayName] = useState("");
  const [avatarId, setAvatarId] = useState<string>(AVATARS[0].id);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "free" | "taken" | "invalid">("idle");
  const [usernameError, setUsernameError] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!username) { setUsernameStatus("idle"); setUsernameError(""); setSuggestions([]); return; }
    const parsed = usernameSchema.safeParse(username);
    if (!parsed.success) { setUsernameStatus("invalid"); setUsernameError(parsed.error.issues[0].message); setSuggestions([]); return; }
    setUsernameStatus("checking"); setUsernameError("");
    const t = setTimeout(async () => {
      const { data } = await supabase.from("profiles").select("username").eq("username", username.toLowerCase()).maybeSingle();
      if (data) {
        setUsernameStatus("taken");
        setSuggestions([
          `${username}_${Math.floor(Math.random() * 99)}`,
          `${username}${new Date().getFullYear() % 100}`,
          `the_${username}`,
        ]);
      } else { setUsernameStatus("free"); setSuggestions([]); }
    }, 400);
    return () => clearTimeout(t);
  }, [username]);

  const next = () => {
    if (step === 1 && !displayName.trim()) return toast.error("Add a display name");
    if (step === 2 && !avatarId) return toast.error("Pick an avatar");
    setStep(step + 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus !== "free") return toast.error("Pick an available username");
    if (password.length < 8) return toast.error("Password must be 8+ characters");
    if (!email) return toast.error("Add an email");
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { username: username.toLowerCase(), display_name: displayName.trim(), avatar_url: avatarId },
      },
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("You're in. Welcome to Recess.");
    nav("/", { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8 page-enter">
      <div className="flex items-center gap-3">
        <button
          onClick={() => (step === 1 ? nav("/welcome") : setStep(step - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full glass tap"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? "bg-foreground" : "bg-secondary"
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{step}/3</span>
      </div>

      <div className="mt-8 flex-1">
        {step === 1 && (
          <div className="animate-slide-up">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">step one</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">What should friends call you?</h1>
            <p className="mt-2 text-sm text-muted-foreground">Your display name shows up in rooms.</p>
            <div className="mt-8 space-y-1.5">
              <Label htmlFor="dn" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display name</Label>
              <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Vyash the Menace" maxLength={30} className="h-14 rounded-xl border-border-strong bg-surface-elevated text-lg" autoFocus />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-up">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">step two</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Pick your fighter.</h1>
            <p className="mt-2 text-sm text-muted-foreground">You can change it later.</p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAvatarId(a.id)}
                  className={`group relative aspect-square overflow-hidden rounded-2xl border bg-surface-elevated p-2 tap transition-all ${
                    avatarId === a.id
                      ? "border-foreground shadow-lg scale-[1.03]"
                      : "border-border hover:border-border-strong"
                  }`}
                >
                  <img src={a.src} alt={a.label} className="h-full w-full object-contain transition-transform group-hover:scale-105" />
                  {avatarId === a.id && (
                    <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background animate-pop">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={submit} className="animate-slide-up space-y-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">step three</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">Lock it in.</h1>
              <p className="mt-2 text-sm text-muted-foreground">Username is unique. Password 8+ chars.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="un" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">@</span>
                <Input id="un" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().trim())} className="h-12 rounded-xl border-border-strong bg-surface-elevated pl-8 pr-10 font-mono" placeholder="vyashraj" maxLength={20} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  {usernameStatus === "free" && <Check className="h-4 w-4 text-success" strokeWidth={3} />}
                </span>
              </div>
              {usernameStatus === "taken" && (
                <p className="text-xs text-destructive">Taken. Try: {suggestions.map((s) => (
                  <button key={s} type="button" onClick={() => setUsername(s)} className="ml-1 font-mono font-semibold underline">{s}</button>
                ))}</p>
              )}
              {usernameStatus === "invalid" && <p className="text-xs text-destructive">{usernameError}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="em" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl border-border-strong bg-surface-elevated" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
              <Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl border-border-strong bg-surface-elevated" placeholder="8+ characters" />
            </div>

            <Button type="submit" disabled={submitting || usernameStatus !== "free"} size="lg" className="mt-2 h-12 w-full rounded-xl text-base font-semibold tap shine">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Enter Recess <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </form>
        )}
      </div>

      {step < 3 && (
        <Button onClick={next} size="lg" className="h-12 rounded-xl text-base font-semibold tap shine">
          Continue <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
