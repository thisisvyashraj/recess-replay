import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, MessageCircleHeart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type C = { id: string; body: string; created_at: string };

export default function Confessions() {
  const { user } = useAuth();
  const [items, setItems] = useState<C[]>([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [posting, setPosting] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("confessions_public")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((data ?? []) as C[]);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!user) return;
    const body = text.trim();
    if (!body) return toast.error("Say something");
    if (body.length > 1000) return toast.error("Keep it under 1000 characters");
    setPosting(true);
    const { error } = await supabase.from("confessions").insert({ user_id: user.id, body });
    setPosting(false);
    if (error) return toast.error(error.message);
    setText("");
    setOpen(false);
    toast.success("Confession dropped 🤫");
    load();
  };

  return (
    <AppShell>
      <div className="px-5 pt-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl">Whispers</h1>
            <p className="text-sm text-muted-foreground">Anonymous. Untraceable. (To everyone but you.)</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="h-12 rounded-2xl bg-hero shadow-glow tap">
                <Plus className="mr-1 h-4 w-4" /> Post
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Drop a whisper</DialogTitle>
              </DialogHeader>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type it. Send it. Disappear."
                rows={6}
                maxLength={1000}
                className="resize-none rounded-2xl"
              />
              <p className="text-right text-xs text-muted-foreground">{text.length}/1000</p>
              <Button onClick={submit} disabled={posting} size="lg" className="h-12 rounded-2xl bg-hero text-base font-semibold shadow-glow tap">
                {posting ? "Posting..." : "Post anonymously"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6 space-y-3">
          {items.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
              <MessageCircleHeart className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 font-semibold">No whispers yet</p>
              <p className="text-xs text-muted-foreground">Be the first to say the unsayable.</p>
            </div>
          )}
          {items.map((c, i) => (
            <article
              key={c.id}
              className="rounded-3xl bg-card p-5 shadow-card animate-slide-up"
              style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
            >
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{c.body}</p>
              <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                anonymous · {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
              </p>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
