import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MessageSquare, Search, Lock, Trash2, Flag } from "lucide-react";
import { toast } from "sonner";

interface Thread {
  id: string;
  title: string;
  body: string | null;
  author_id: string | null;
  category: string;
  locked: boolean;
  flagged: boolean;
  created_at: string;
}

const logAction = async (action: string, target_id: string, metadata: any = {}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("audit_logs").insert({ actor_id: user.id, action, target_type: "discussion_thread", target_id, metadata });
};

type ConfirmKind = "lock" | "flag" | "delete";
interface Pending { kind: ConfirmKind; thread: Thread; }

const AdminDiscussions = () => {
  const [items, setItems] = useState<Thread[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Pending | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: threads } = await supabase.from("discussion_threads").select("*").order("created_at", { ascending: false });
    const list = (threads ?? []) as Thread[];
    setItems(list);
    if (list.length) {
      const { data: replies } = await supabase.from("discussion_replies").select("thread_id");
      const map: Record<string, number> = {};
      (replies ?? []).forEach((r: any) => { map[r.thread_id] = (map[r.thread_id] ?? 0) + 1; });
      setCounts(map);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const undoToggle = async (t: Thread, field: "locked" | "flagged", prev: boolean, undoAction: string) => {
    await supabase.from("discussion_threads").update({ [field]: prev }).eq("id", t.id);
    await logAction(undoAction, t.id, { undo: true });
    load();
  };

  const performLock = async (t: Thread) => {
    const next = !t.locked;
    const { error } = await supabase.from("discussion_threads").update({ locked: next }).eq("id", t.id);
    if (error) return toast.error(error.message);
    await logAction(next ? "thread.lock" : "thread.unlock", t.id);
    toast.success(next ? "Thread locked" : "Thread unlocked", {
      action: { label: "Undo", onClick: () => undoToggle(t, "locked", t.locked, next ? "thread.unlock" : "thread.lock") },
    });
    load();
  };

  const performFlag = async (t: Thread) => {
    const next = !t.flagged;
    const { error } = await supabase.from("discussion_threads").update({ flagged: next }).eq("id", t.id);
    if (error) return toast.error(error.message);
    await logAction(next ? "thread.flag" : "thread.unflag", t.id);
    toast.success(next ? "Thread flagged" : "Flag cleared", {
      action: { label: "Undo", onClick: () => undoToggle(t, "flagged", t.flagged, next ? "thread.unflag" : "thread.flag") },
    });
    load();
  };

  const performDelete = async (t: Thread) => {
    const snapshot = { ...t };
    const { error } = await supabase.from("discussion_threads").delete().eq("id", t.id);
    if (error) return toast.error(error.message);
    await logAction("thread.delete", t.id, { title: t.title });
    toast.success("Thread removed", {
      action: {
        label: "Undo",
        onClick: async () => {
          const { error: e } = await supabase.from("discussion_threads").insert(snapshot);
          if (e) return toast.error(e.message);
          await logAction("thread.restore", t.id, { undo: true });
          toast.success("Restored");
          load();
        },
      },
    });
    load();
  };

  const runPending = async () => {
    if (!pending) return;
    const { kind, thread } = pending;
    setPending(null);
    if (kind === "lock") return performLock(thread);
    if (kind === "flag") return performFlag(thread);
    if (kind === "delete") return performDelete(thread);
  };

  const filtered = items.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));

  const confirmText: Record<ConfirmKind, { title: string; desc: string; cta: string }> = {
    lock: { title: pending?.thread.locked ? "Unlock thread?" : "Lock thread?", desc: "Locking prevents new replies until unlocked.", cta: "Continue" },
    flag: { title: pending?.thread.flagged ? "Clear flag?" : "Flag thread?", desc: "Flagged threads are surfaced for review.", cta: "Continue" },
    delete: { title: "Delete this thread?", desc: "This removes the thread. You can undo right after.", cta: "Delete" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><MessageSquare className="h-7 w-7" /> Discussions</h1>
          <p className="text-muted-foreground">Moderate community threads and replies</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search threads…" className="pl-9" />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>All Threads</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Category</TableHead>
                <TableHead className="text-right">Replies</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No threads yet</TableCell></TableRow>
              ) : filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell><Badge variant="secondary">{t.category}</Badge></TableCell>
                  <TableCell className="text-right">{counts[t.id] ?? 0}</TableCell>
                  <TableCell>
                    {t.flagged && <Badge variant="destructive" className="gap-1"><Flag className="h-3 w-3" /> Reported</Badge>}
                    {t.locked && <Badge variant="outline" className="ml-1">Locked</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => setPending({ kind: "flag", thread: t })}><Flag className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setPending({ kind: "lock", thread: t })}><Lock className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setPending({ kind: "delete", thread: t })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!pending} onOpenChange={(o) => { if (!o) setPending(null); }}>
        <AlertDialogContent>
          {pending && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{confirmText[pending.kind].title}</AlertDialogTitle>
                <AlertDialogDescription>
                  "{pending.thread.title}" — {confirmText[pending.kind].desc}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={runPending}>{confirmText[pending.kind].cta}</AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDiscussions;
