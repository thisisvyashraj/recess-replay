import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, X } from "lucide-react";

type Ann = { id: string; title: string; body: string; created_at: string };

export function AnnouncementBanner() {
  const [ann, setAnn] = useState<Ann | null>(null);
  const [dismissed, setDismissed] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("dismissed-anns") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("id, title, body, created_at")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setAnn((data as Ann) ?? null);
    };
    load();
    const ch = supabase
      .channel("ann-banner")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (!ann || dismissed.includes(ann.id)) return null;

  const dismiss = () => {
    const next = [...dismissed, ann.id];
    setDismissed(next);
    localStorage.setItem("dismissed-anns", JSON.stringify(next));
  };

  return (
    <div className="relative mb-4 overflow-hidden rounded-2xl border border-accent/30 bg-accent/[0.06] p-4 animate-slide-down">
      <div className="absolute inset-0 bg-accent-gradient opacity-[0.04]" />
      <div className="relative flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
          <Megaphone className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{ann.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{ann.body}</p>
        </div>
        <button onClick={dismiss} className="text-muted-foreground hover:text-foreground" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
