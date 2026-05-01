import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const opts = [
    { v: "light" as const, icon: Sun, label: "Light" },
    { v: "system" as const, icon: Monitor, label: "Auto" },
    { v: "dark" as const, icon: Moon, label: "Dark" },
  ];
  return (
    <div className={`relative inline-flex items-center rounded-full border border-border bg-secondary/60 p-0.5 ${compact ? "" : "shadow-xs"}`}>
      {opts.map((o) => {
        const active = theme === o.v;
        return (
          <button
            key={o.v}
            onClick={() => setTheme(o.v)}
            aria-label={o.label}
            className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active && (
              <span className="absolute inset-0 rounded-full bg-background shadow-sm ring-1 ring-border-strong animate-scale-in" />
            )}
            <o.icon className="relative z-10 h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
