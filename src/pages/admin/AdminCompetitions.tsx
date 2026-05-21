import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Trophy, Search, Check, X, Award, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Comp {
  id: string; title: string; description: string | null; prize: string | null;
  status: "draft" | "active" | "closed"; deadline: string | null; host_id: string | null; winner_id: string | null;
  created_at: string;
}

const logAction = async (action: string, target_id: string, metadata: any = {}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("audit_logs").insert({ actor_id: user.id, action, target_type: "competition", target_id, metadata });
};

const AdminCompetitions = () => {
  const [items, setItems] = useState<Comp[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", prize: "", deadline: "" });
  const [reviewing, setReviewing] = useState<Comp | null>(null);
  const [subs, setSubs] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("competitions").select("*").order("created_at", { ascending: false });
    const list = (data ?? []) as Comp[];
    setItems(list);
    const { data: s } = await supabase.from("competition_submissions").select("competition_id");
    const map: Record<string, number> = {};
    (s ?? []).forEach((x: any) => { map[x.competition_id] = (map[x.competition_id] ?? 0) + 1; });
    setCounts(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) return toast.error("Title required");
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("competitions").insert({
      title: form.title,
      description: form.description || null,
      prize: form.prize || null,
      deadline: form.deadline || null,
      host_id: user?.id ?? null,
      status: "draft",
    }).select().single();
    if (error) return toast.error(error.message);
    await logAction("competition.create", data.id, { title: data.title });
    toast.success("Competition created");
    setForm({ title: "", description: "", prize: "", deadline: "" });
    setOpen(false);
    load();
  };

  const setStatus = async (c: Comp, status: Comp["status"]) => {
    const { error } = await supabase.from("competitions").update({ status }).eq("id", c.id);
    if (error) return toast.error(error.message);
    await logAction(`competition.${status}`, c.id);
    toast.success(`Marked ${status}`);
    load();
  };

  const remove = async (c: Comp) => {
    const { error } = await supabase.from("competitions").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    await logAction("competition.delete", c.id, { title: c.title });
    toast.success("Deleted");
    load();
  };

  const openReview = async (c: Comp) => {
    setReviewing(c);
    const { data } = await supabase.from("competition_submissions").select("*").eq("competition_id", c.id).order("score", { ascending: false, nullsFirst: false });
    setSubs(data ?? []);
  };

  const pickWinner = async (userId: string) => {
    if (!reviewing) return;
    const { error } = await supabase.from("competitions").update({ winner_id: userId, status: "closed" }).eq("id", reviewing.id);
    if (error) return toast.error(error.message);
    await logAction("competition.winner", reviewing.id, { winner_id: userId });
    toast.success("Winner picked");
    setReviewing(null);
    load();
  };

  const filtered = items.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Trophy className="h-7 w-7" /> Competitions</h1>
          <p className="text-muted-foreground">Create, publish, review and pick winners</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9" />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> New</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New competition</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Prize</Label><Input value={form.prize} onChange={(e) => setForm({ ...form, prize: e.target.value })} placeholder="GHS 5,000" /></div>
                  <div><Label>Deadline</Label><Input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
                </div>
              </div>
              <DialogFooter><Button onClick={create}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>All Competitions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Status</TableHead>
                <TableHead className="text-right">Submissions</TableHead><TableHead>Prize</TableHead>
                <TableHead>Deadline</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No competitions yet</TableCell></TableRow>
              ) : filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "active" ? "default" : c.status === "draft" ? "secondary" : "outline"}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{counts[c.id] ?? 0}</TableCell>
                  <TableCell>{c.prize ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.deadline ? new Date(c.deadline).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {c.status === "draft" && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(c, "active")}><Check className="h-4 w-4 mr-1" />Publish</Button>
                    )}
                    {c.status === "active" && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(c, "closed")}><X className="h-4 w-4 mr-1" />Close</Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => openReview(c)}><Award className="h-4 w-4 mr-1" />Review</Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!reviewing} onOpenChange={(o) => { if (!o) setReviewing(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Submissions — {reviewing?.title}</DialogTitle></DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {subs.length === 0 ? <p className="text-sm text-muted-foreground py-6 text-center">No submissions yet</p> : (
              <Table>
                <TableHeader><TableRow><TableHead>User</TableHead><TableHead className="text-right">Score</TableHead><TableHead>Notes</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {subs.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.user_id.slice(0, 8)}</TableCell>
                      <TableCell className="text-right">{s.score ?? "—"}</TableCell>
                      <TableCell className="text-sm">{s.notes ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => pickWinner(s.user_id)}><Award className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCompetitions;
