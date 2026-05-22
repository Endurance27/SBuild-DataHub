import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Medal, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface BadgeRec { id: string; name: string; description: string | null; icon: string | null; created_at: string; }

const logAction = async (action: string, target_id: string, metadata: any = {}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("audit_logs").insert({ actor_id: user.id, action, target_type: "badge", target_id, metadata });
};

const empty = { id: "", name: "", description: "", icon: "🏅" };

const BadgePreview = ({ name, icon }: { name: string; icon: string | null }) => (
  <div className="flex items-center gap-3 rounded-md border bg-muted/30 px-3 py-2">
    <Avatar className="h-9 w-9">
      <AvatarFallback className="bg-primary text-primary-foreground">SK</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="text-sm font-medium">Sample User</div>
      <div className="text-xs text-muted-foreground">2,400 XP · Contributor</div>
    </div>
    <Badge variant="secondary" className="gap-1 text-base">
      <span>{icon || "🏅"}</span>
      <span className="text-xs">{name || "Badge name"}</span>
    </Badge>
  </div>
);

const AdminBadges = () => {
  const [badges, setBadges] = useState<BadgeRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [confirmDelete, setConfirmDelete] = useState<BadgeRec | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("badges").select("*").order("created_at", { ascending: false });
    setBadges((data ?? []) as BadgeRec[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => { setForm({ ...empty }); setOpen(true); };
  const startEdit = (b: BadgeRec) => { setForm({ id: b.id, name: b.name, description: b.description ?? "", icon: b.icon ?? "🏅" }); setOpen(true); };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name required");
    const payload = { name: form.name.trim(), description: form.description || null, icon: form.icon || null };
    if (form.id) {
      const { error } = await supabase.from("badges").update(payload).eq("id", form.id);
      if (error) return toast.error(error.message);
      await logAction("badge.update", form.id, payload);
      toast.success("Badge updated");
    } else {
      const { data, error } = await supabase.from("badges").insert(payload).select().single();
      if (error) return toast.error(error.message);
      await logAction("badge.create", data.id, payload);
      toast.success("Badge created");
    }
    setOpen(false);
    load();
  };

  const remove = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from("badges").delete().eq("id", confirmDelete.id);
    if (error) return toast.error(error.message);
    await logAction("badge.delete", confirmDelete.id, { name: confirmDelete.name });
    toast.success("Badge deleted");
    setConfirmDelete(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Medal className="h-7 w-7" /> Badges</h1>
          <p className="text-muted-foreground">Create, edit, and preview badges awarded on the leaderboard</p>
        </div>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-1" /> New badge</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All badges</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead><TableHead>Name</TableHead><TableHead>Description</TableHead>
                <TableHead>Preview</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
              ) : badges.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No badges yet — create one to get started</TableCell></TableRow>
              ) : badges.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="text-2xl">{b.icon ?? "🏅"}</TableCell>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-sm">{b.description ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      <span>{b.icon ?? "🏅"}</span>
                      <span className="text-xs">{b.name}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(b)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(b)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form.id ? "Edit badge" : "New badge"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-[80px_1fr] gap-3">
              <div>
                <Label>Icon</Label>
                <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🏅" maxLength={4} className="text-center text-xl" />
              </div>
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Top Contributor" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Awarded for…" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Leaderboard preview</Label>
              <BadgePreview name={form.name} icon={form.icon} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{form.id ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => { if (!o) setConfirmDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this badge?</AlertDialogTitle>
            <AlertDialogDescription>
              "{confirmDelete?.name}" will be removed. Awards already given to users will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBadges;
