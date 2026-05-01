import { useNotifications } from "@/hooks/useNotifications";
import { Bell, Check, Megaphone, Trophy, Users, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const ICONS = {
  announcement: Megaphone,
  room_invite: Users,
  game_result: Trophy,
  system: Bell,
};

export function NotificationBell() {
  const { items, unread, markAllRead, markRead, remove } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full glass tap"
        >
          <Bell className="h-4 w-4" strokeWidth={2.2} />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-accent-foreground shadow-glow animate-pop">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[calc(100vw-2rem)] max-w-sm rounded-2xl border-border bg-popover p-0 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <Check className="h-3 w-3" /> Mark all read
            </button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {items.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              <Bell className="mx-auto mb-2 h-5 w-5 opacity-50" />
              You're all caught up.
            </div>
          )}
          {items.map((n) => {
            const Icon = ICONS[n.kind];
            const node = (
              <div
                onClick={() => !n.read && markRead(n.id)}
                className={`group flex cursor-pointer gap-3 border-b border-border/60 px-4 py-3 transition-colors hover:bg-secondary/50 ${
                  !n.read ? "bg-accent/[0.03]" : ""
                }`}
              >
                <div className="relative">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                    <Icon className="h-4 w-4" />
                  </span>
                  {!n.read && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-popover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{n.title}</p>
                  {n.body && <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>}
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                  className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
            return n.link ? (
              <Link to={n.link} key={n.id}>{node}</Link>
            ) : (
              <div key={n.id}>{node}</div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
