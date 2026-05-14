import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return toast.error("Enter your username and email");
    setLoading(true);
    // soft-verify the username matches a profile (privacy-safe — we still send the email regardless)
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username.trim().toLowerCase())
      .maybeSingle();

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (!profile) {
      toast.message("If that account exists, we sent a reset link.");
    } else {
      toast.success("Reset link sent to your email");
    }
    setSent(true);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8 page-enter">
      <Link to="/login" className="flex h-10 w-10 items-center justify-center rounded-full glass tap">
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <div className="mt-12">
        <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">We'll email you a secure reset link.</p>
      </div>

      {sent ? (
        <div className="mt-10 rounded-2xl glass p-6 text-center animate-slide-up">
          <Mail className="mx-auto h-10 w-10 text-accent" />
          <p className="mt-3 font-semibold">Check your inbox</p>
          <p className="mt-1 text-sm text-muted-foreground">Click the link in the email we sent to <span className="text-foreground">{email}</span> to set a new password.</p>
          <Button onClick={() => nav("/login")} variant="outline" className="mt-6 h-11 w-full rounded-xl">Back to sign in</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_username" className="h-12 rounded-xl border-border-strong bg-surface-elevated" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl border-border-strong bg-surface-elevated" />
          </div>
          <Button type="submit" disabled={loading} size="lg" className="h-12 w-full rounded-xl text-base font-semibold tap shine">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      )}
    </div>
  );
}
