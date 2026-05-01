import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  right,
  back,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  back?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-30 -mx-5 mb-2 px-5 pb-3 pt-6">
      <div className="absolute inset-0 -z-10 bg-background/70 backdrop-blur-xl" />
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-end gap-3 min-w-0">
          {back}
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
      </div>
    </div>
  );
}
