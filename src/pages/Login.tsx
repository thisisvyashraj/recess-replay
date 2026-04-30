import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { ArrowLeft } from "lucide-react";

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
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    nav("/", { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8">
      <Link to="/welcome" className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card tap">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <div className="mt-6 flex flex-col items-center">
        <img src={logo} alt="Recess.gg" width={80} height={80} className="h-20 w-20" />
        <h1 className="mt-4 font-display text-3xl">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Pick up where you left off.</p>
      </div>

      <form onSubmit={submit} className="mt-10 flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl" />
        </div>
        <Button type="submit" disabled={loading} size="lg" className="mt-4 h-14 rounded-2xl bg-hero text-base font-semibold shadow-glow tap">
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        New here? <Link to="/signup" className="font-semibold text-primary">Create account</Link>
      </p>
    </div>
  );
}
