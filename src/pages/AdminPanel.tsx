import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, BookOpen, Mic, Music, Type as TypeIcon, MessageCircleHeart, Megaphone, Trash2, Plus, Shield, Send, Bell } from "lucide-react";
import { format } from "date-fns";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "English", "General Knowledge"];

export default function AdminPanel() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-5 py-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full glass tap">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl">
            <Shield className="h-5 w-5 text-accent" /> Admin Panel
          </h1>
          <p className="text-xs text-muted-foreground">Banks, confessions, announcements, notifications</p>
        </div>
      </div>

      <Tabs defaultValue="ann" className="mt-6">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-2xl glass p-1">
          <TabsTrigger value="ann" className="flex-1 gap-1 rounded-xl"><Megaphone className="h-3.5 w-3.5" />Announce</TabsTrigger>
          <TabsTrigger value="notif" className="flex-1 gap-1 rounded-xl"><Bell className="h-3.5 w-3.5" />Notify</TabsTrigger>
          <TabsTrigger value="questions" className="flex-1 gap-1 rounded-xl"><BookOpen className="h-3.5 w-3.5" />Questions</TabsTrigger>
          <TabsTrigger value="spell" className="flex-1 gap-1 rounded-xl"><Mic className="h-3.5 w-3.5" />Spell</TabsTrigger>
          <TabsTrigger value="emoji" className="flex-1 gap-1 rounded-xl"><Music className="h-3.5 w-3.5" />Emoji</TabsTrigger>
          <TabsTrigger value="words" className="flex-1 gap-1 rounded-xl"><TypeIcon className="h-3.5 w-3.5" />Words</TabsTrigger>
          <TabsTrigger value="conf" className="flex-1 gap-1 rounded-xl"><MessageCircleHeart className="h-3.5 w-3.5" />Whispers</TabsTrigger>
        </TabsList>

        <TabsContent value="ann" className="mt-4"><AnnouncementsAdmin /></TabsContent>
        <TabsContent value="notif" className="mt-4"><NotifyAdmin /></TabsContent>
        <TabsContent value="questions" className="mt-4"><QuestionBank /></TabsContent>
        <TabsContent value="spell" className="mt-4"><Placeholder title="Spell Bee Audio Bank" sub="Audio upload tooling ships with the Spell Bee game." /></TabsContent>
        <TabsContent value="emoji" className="mt-4"><Placeholder title="Emoji Music Bank" sub="Pair emoji sequences with song names." /></TabsContent>
        <TabsContent value="words" className="mt-4"><Placeholder title="Word & Phrase Bank" sub="For 20 Questions, Wrong Answer Only, etc." /></TabsContent>
        <TabsContent value="conf" className="mt-4"><ConfessionsViewer /></TabsContent>
      </Tabs>
    </div>
  );
}

type Ann = { id: string; title: string; body: string; active: boolean; created_at: string };

function AnnouncementsAdmin() {
  const { user } = useAuth();
  const [items, setItems] = useState<Ann[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(50);
    if (error) return toast.error(error.message);
    setItems((data ?? []) as Ann[]);
  };
  useEffect(() => { load(); }, []);

  const post = async () => {
    if (!title.trim() || !body.trim()) return toast.error("Title and body required");
    setBusy(true);
    const { error } = await supabase.from("announcements").insert({ title: title.trim(), body: body.trim(), created_by: user?.id, active: true });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Announcement broadcast to every user");
    setTitle(""); setBody("");
    load();
  };
  const toggle = async (a: Ann) => {
    await supabase.from("announcements").update({ active: !a.active }).eq("id", a.id);
    load();
  };
  const del = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-2xl glass p-4">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. New game dropped!)" className="rounded-xl" />
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message to every user..." rows={3} className="resize-none rounded-xl" />
        <Button onClick={post} disabled={busy} className="w-full rounded-xl bg-hero shadow-glow tap">
          <Send className="mr-2 h-4 w-4" /> {busy ? "Broadcasting..." : "Broadcast to everyone"}
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((a) => (
          <div key={a.id} className="rounded-2xl glass p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-semibold">{a.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {format(new Date(a.created_at), "MMM d, h:mm a")} · {a.active ? "active" : "hidden"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => toggle(a)} className="rounded-lg px-2 py-1 text-xs hover:bg-secondary">{a.active ? "Hide" : "Show"}</button>
                <button onClick={() => del(a.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <EmptyHint text="No announcements yet" />}
      </div>
    </div>
  );
}

type Recipient = { id: string; username: string; display_name: string };

function NotifyAdmin() {
  const [users, setUsers] = useState<Recipient[]>([]);
  const [target, setTarget] = useState<string>("__all__");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("id, username, display_name").order("username");
      setUsers((data ?? []) as Recipient[]);
    })();
  }, []);

  const send = async () => {
    if (!title.trim()) return toast.error("Title required");
    setBusy(true);
    const targets = target === "__all__" ? users.map((u) => u.id) : [target];
    const rows = targets.map((uid) => ({ user_id: uid, kind: "system" as const, title: title.trim(), body: body.trim() || null }));
    const { error } = await supabase.from("notifications").insert(rows);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Sent to ${targets.length} ${targets.length === 1 ? "user" : "users"}`);
    setTitle(""); setBody("");
  };

  return (
    <div className="space-y-3 rounded-2xl glass p-4">
      <div>
        <Label className="text-xs text-muted-foreground">Recipient</Label>
        <Select value={target} onValueChange={setTarget}>
          <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Everyone ({users.length})</SelectItem>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>@{u.username} — {u.display_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" className="rounded-xl" />
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Optional body..." rows={3} className="resize-none rounded-xl" />
      <Button onClick={send} disabled={busy} className="w-full rounded-xl bg-hero shadow-glow tap">
        <Bell className="mr-2 h-4 w-4" /> {busy ? "Sending..." : "Send notification"}
      </Button>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border bg-card/30 p-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function Placeholder({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
      <p className="font-display text-xl">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      <p className="mt-4 text-xs text-muted-foreground">Wired up alongside its game in an upcoming iteration.</p>
    </div>
  );
}

type Q = {
  id: string; subject: string; difficulty: string; body: string;
  option_a: string; option_b: string; option_c: string; option_d: string; correct: string;
};

function QuestionBank() {
  const { user } = useAuth();
  const [items, setItems] = useState<Q[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    let q = supabase.from("questions").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter !== "all") q = q.eq("subject", filter);
    const { data, error } = await q;
    if (error) return toast.error(error.message);
    setItems((data as Q[]) ?? []);
  };
  useEffect(() => { load(); }, [filter]);

  const del = async (id: string) => {
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-11 flex-1 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={() => setShowAdd(v => !v)} className="h-11 rounded-xl bg-hero shadow-glow tap">
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>

      {showAdd && <AddQuestion onAdded={() => { setShowAdd(false); load(); }} userId={user?.id} />}

      <div className="mt-4 space-y-2">
        {items.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
            No questions yet. Add the first one above.
          </div>
        )}
        {items.map((q) => (
          <div key={q.id} className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">{q.subject}</span>
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">{q.difficulty}</span>
                </div>
                <p className="mt-2 font-semibold">{q.body}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {(["A","B","C","D"] as const).map((k) => (
                    <li key={k} className={`flex gap-2 ${q.correct === k ? "font-bold text-success" : "text-muted-foreground"}`}>
                      <span>{k}.</span><span>{(q as any)[`option_${k.toLowerCase()}`]}</span>
                      {q.correct === k && <span className="ml-auto text-[10px] uppercase">correct</span>}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => del(q.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10 tap">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddQuestion({ onAdded, userId }: { onAdded: () => void; userId?: string }) {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [difficulty, setDifficulty] = useState("medium");
  const [body, setBody] = useState("");
  const [opts, setOpts] = useState({ a: "", b: "", c: "", d: "" });
  const [correct, setCorrect] = useState<"A"|"B"|"C"|"D">("A");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!body.trim() || !opts.a || !opts.b || !opts.c || !opts.d) return toast.error("Fill all fields");
    setBusy(true);
    const { error } = await supabase.from("questions").insert({
      subject, difficulty, body: body.trim(),
      option_a: opts.a.trim(), option_b: opts.b.trim(), option_c: opts.c.trim(), option_d: opts.d.trim(),
      correct, created_by: userId ?? null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Question added");
    setBody(""); setOpts({ a:"", b:"", c:"", d:"" });
    onAdded();
  };

  return (
    <div className="mt-4 space-y-3 rounded-2xl bg-card p-4 shadow-card animate-slide-up">
      <div className="grid grid-cols-2 gap-2">
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Question..." rows={2} className="resize-none rounded-xl" />
      <div className="grid grid-cols-2 gap-2">
        {(["a","b","c","d"] as const).map((k) => (
          <div key={k} className="flex items-center gap-1">
            <Label className="w-5 text-center font-bold">{k.toUpperCase()}.</Label>
            <Input value={(opts as any)[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.value })} placeholder={`Option ${k.toUpperCase()}`} className="h-10 rounded-xl" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Label className="text-sm">Correct:</Label>
        <Select value={correct} onValueChange={(v) => setCorrect(v as any)}>
          <SelectTrigger className="w-24 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(["A","B","C","D"] as const).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={save} disabled={busy} className="ml-auto rounded-xl bg-hero shadow-glow tap">
          {busy ? "Saving..." : "Save question"}
        </Button>
      </div>
    </div>
  );
}

type Conf = { id: string; body: string; created_at: string; user_id: string; profiles?: { username: string; display_name: string } | null };

function ConfessionsViewer() {
  const [items, setItems] = useState<Conf[]>([]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("confessions")
        .select("id, body, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) return toast.error(error.message);
      const ids = Array.from(new Set((data ?? []).map((d: any) => d.user_id)));
      const { data: profs } = await supabase.from("profiles").select("id, username, display_name").in("id", ids);
      const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
      setItems((data ?? []).map((d: any) => ({ ...d, profiles: map.get(d.user_id) ?? null })));
    })();
  }, []);

  return (
    <div className="space-y-2">
      <p className="rounded-2xl bg-accent/10 p-3 text-xs text-accent-foreground">
        🔒 Identities visible only here. The public board never reveals authors.
      </p>
      {items.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
          No confessions yet.
        </div>
      )}
      {items.map((c) => (
        <article key={c.id} className="rounded-2xl bg-card p-4 shadow-card">
          <p className="whitespace-pre-wrap text-sm">{c.body}</p>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            @{c.profiles?.username ?? "unknown"} · {c.profiles?.display_name ?? ""} · {format(new Date(c.created_at), "MMM d, h:mm a")}
          </p>
        </article>
      ))}
    </div>
  );
}
