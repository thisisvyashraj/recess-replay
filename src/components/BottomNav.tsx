import { NavLink } from "react-router-dom";
import { Home, Gamepad2, Trophy, Users, User } from "lucide-react";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/games", icon: Gamepad2, label: "Games" },
  { to: "/rooms", icon: Users, label: "Rooms" },
  { to: "/leaderboard", icon: Trophy, label: "Ranks" },
  { to: "/profile", icon: User, label: "Me" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
      <div className="mx-auto max-w-md px-4">
        <ul className="glass-strong flex items-stretch justify-around rounded-full p-1.5 shadow-xl">
          {items.map(({ to, icon: Icon, label }) => (
            <li key={to} className="flex-1">
              <NavLink to={to} end={to === "/"} aria-label={label}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center gap-0.5 rounded-full py-2 tap transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`
                }>
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute inset-0 rounded-full bg-secondary ring-1 ring-border-strong animate-scale-in" />}
                    <Icon className="relative z-10 h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
                    <span className="relative z-10 text-[9px] font-semibold uppercase tracking-wider">{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
