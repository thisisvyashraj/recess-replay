import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Welcome() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8 page-enter">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
            <span className="font-mono text-xs font-bold">R</span>
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight">recess.gg</span>
        </div>
        <ThemeToggle compact />
      </header>

      <div className="flex flex-1 flex-col justify-center pt-8">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 backdrop-blur animate-slide-up">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">25 games · live now</span>
        </div>

        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight animate-slide-up [animation-delay:60ms]">
          Where the
          <br />
          <span className="text-gradient">squad</span> never
          <br />
          logs off.
        </h1>
        <p className="mt-5 max-w-sm text-base text-muted-foreground animate-slide-up [animation-delay:120ms]">
          The mobile party platform for your friend group. Spin up a room, share a code, lose to your friends in 25 different ways.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <Button asChild size="lg" className="group h-14 rounded-xl text-base font-semibold shadow-lg tap shine animate-slide-up [animation-delay:180ms]">
            <Link to="/signup">
              <Sparkles className="h-4 w-4" /> Get Started
              <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 rounded-xl border-border-strong bg-surface-elevated text-base font-medium tap animate-slide-up [animation-delay:240ms]">
            <Link to="/login">I already have an account</Link>
          </Button>
        </div>
      </div>

      <footer className="pt-6 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        v1 · be kind · have fun
      </footer>
    </div>
  );
}
