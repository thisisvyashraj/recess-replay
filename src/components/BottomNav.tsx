import { NavLink } from "react-router-dom";
import { Home, Gamepad2, Trophy, MessageCircleHeart, User } from "lucide-react";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/games", icon: Gamepad2, label: "Games" },
  { to: "/leaderboard", icon: Trophy, label: "Ranks" },
  { to: "/confessions", icon: MessageCircleHeart, label: "Whispers" },
  { to: "/profile", icon: User, label: "Me" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/60 pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
        {items.map(({ to, icon: Icon, label }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-2xl py-2 tap transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                      isActive ? "bg-primary/15 scale-110" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <span className="text-[10px] font-semibold tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
