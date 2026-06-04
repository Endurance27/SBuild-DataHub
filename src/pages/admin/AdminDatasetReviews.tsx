import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Eye, MessageSquare, Archive } from "lucide-react";
import { toast } from "sonner";

interface DS {
  id: string;
  title: string;
  description: string | null;
  status: string;
  uploader_id: string | null;
  reviewer_notes: string | null;
  created_at: string;
}

const STATUS_TABS = ["pending", "under_review", "approved", "published", "rejected", "archived"] as const;

const variant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  under_review: "secondary",
  approved: "default",
  published: "default",
  rejected: "destructive",
  archived: "outline",
};

const AdminDatasetReviews = () => {
  const [tab, setTab] = useState<typeof STATUS_TABS[number]>("pending");
  const [rows, setRows] = useState<DS[]>([]);
  const [active, setActive] = useState<DS | null>(null);
  const [notes, setNotes] = useState("");

  const load = async () => {
    const { data } = await supabase.from("datasets").select("*").eq("status", tab).order("created_at", { ascending: false });
    setRows((data as DS[]) ?? []);
  };
  useEffect(() => { load(); }, [tab]);

  const move = async (status: string) => {
    if (!active) return;
    const patch: any = { status, reviewer_notes: notes || active.reviewer_notes };
    if (status === "published") patch.published_at = new Date().toISOString();
    const { error } = await supabase.from("datasets").update(patch).eq("id", active.id);
    if (error) return toast.error(error.message);
    await supabase.from("audit_logs").insert({
      actor_id: (await supabase.auth.getUser()).data.user?.id,
      action: `dataset.${status}`,
      target_type: "dataset",
      target_id: active.id,
      metadata: { title: active.title },
    });
    toast.success(`Marked ${status}`);
    setActive(null);
    setNotes("");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dataset Reviews</h1>
        <p className="text-muted-foreground">Pending → Under review → Approved → Published</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="flex-wrap h-auto">
          {STATUS_TABS.map((s) => <TabsTrigger key={s} value={s} className="capitalize">{s.replace("_", " ")}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader><CardTitle className="capitalize">{tab.replace("_", " ")} · {rows.length}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Submitted</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{d.description}</div>
                  </TableCell>
                  <TableCell><Badge variant={variant[d.status]}>{d.status.replace("_", " ")}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => { setActive(d); setNotes(d.reviewer_notes ?? ""); }}>
                      <Eye className="h-4 w-4" /> Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">Nothing here</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{active?.title}</DialogTitle></DialogHeader>
          {active && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{active.description ?? "No description"}</p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1"><MessageSquare className="h-4 w-4" /> Reviewer notes</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
              </div>
            </div>
          )}
          <DialogFooter className="flex-wrap gap-2">
            <Button variant="outline" onClick={() => move("under_review")}>Under review</Button>
            <Button variant="outline" onClick={() => move("archived")}><Archive className="h-4 w-4" /> Archive</Button>
            <Button variant="destructive" onClick={() => move("rejected")}><X className="h-4 w-4" /> Reject</Button>
            <Button onClick={() => move("approved")}><Check className="h-4 w-4" /> Approve</Button>
            <Button onClick={() => move("published")}>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDatasetReviews;
