import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    nav("/", { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8 page-enter">
      <Link to="/welcome" className="flex h-10 w-10 items-center justify-center rounded-full glass tap">
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <div className="mt-12">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back.</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your account.</p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl border-border-strong bg-surface-elevated" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl border-border-strong bg-surface-elevated" />
        </div>
        <Button type="submit" disabled={loading} size="lg" className="h-12 w-full rounded-xl text-base font-semibold tap shine">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>

      <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        New here? <Link to="/signup" className="font-semibold text-foreground underline-offset-4 hover:underline">Create account</Link>
      </p>
    </div>
  );
}
