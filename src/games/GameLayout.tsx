import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export function GameLayout({ title, subtitle, children, right }: { title: string; subtitle?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <AppShell>
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/games" className="glass tap flex h-10 w-10 items-center justify-center rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="font-display text-xl leading-none">{title}</h1>
            {subtitle && <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex h-10 min-w-10 items-center justify-end">{right}</div>
        </div>
      </div>
      <div className="px-5">{children}</div>
    </AppShell>
  );
}

export function ScorePill({ score, total }: { score: number; total?: number }) {
  return (
    <div className="glass mono rounded-full px-3 py-1.5 text-xs font-bold">
      {score}{total !== undefined ? `/${total}` : ""}
    </div>
  );
}
