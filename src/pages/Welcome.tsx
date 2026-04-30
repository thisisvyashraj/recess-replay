import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Sparkles } from "lucide-react";

export default function Welcome() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-between overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />

      <div className="flex flex-col items-center pt-12 animate-pop-in">
        <img src={logo} alt="Recess.gg logo" width={160} height={160} className="h-40 w-40 animate-float drop-shadow-xl" />
      </div>

      <div className="z-10 text-center">
        <h1 className="font-display text-5xl leading-[1.05] tracking-tight">
          Where the <span className="text-gradient">squad</span><br />never logs off.
        </h1>
        <p className="mt-4 px-2 text-base text-muted-foreground">
          25 chaotic games. One room code. <br/>Bring the friends, leave the homework.
        </p>
      </div>

      <div className="z-10 flex w-full flex-col gap-3">
        <Button asChild size="lg" className="h-14 rounded-2xl bg-hero text-base font-semibold shadow-glow tap">
          <Link to="/signup">
            <Sparkles className="mr-2 h-5 w-5" /> Get Started
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-14 rounded-2xl border-2 bg-card/80 text-base font-semibold tap">
          <Link to="/login">I already have an account</Link>
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          By joining you agree to keep things friendly.
        </p>
      </div>
    </div>
  );
}
