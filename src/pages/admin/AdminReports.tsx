import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Flag, ShieldCheck, X } from "lucide-react";

interface Report { id: string; reporter_id: string | null; target_type: string; target_id: string | null; reason: string; details: string | null; status: string; resolution_notes: string | null; created_at: string; }

const AdminReports = () => {
  const [tab, setTab] = useState("open");
  const [rows, setRows] = useState<Report[]>([]);
  const [active, setActive] = useState<Report | null>(null);
  const [notes, setNotes] = useState("");

  const load = async () => {
    const { data } = await supabase.from("reports").select("*").eq("status", tab).order("created_at", { ascending: false });
    setRows((data as Report[]) ?? []);
  };
  useEffect(() => { load(); }, [tab]);

  const resolve = async (status: string) => {
    if (!active) return;
    const uid = (await supabase.auth.getUser()).data.user?.id;
    await supabase.from("reports").update({ status, resolution_notes: notes, resolved_by: uid }).eq("id", active.id);
    await supabase.from("audit_logs").insert({ actor_id: uid, action: `report.${status}`, target_type: "report", target_id: active.id });
    toast.success(`Marked ${status}`);
    setActive(null); setNotes(""); load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Moderation</h1>
        <p className="text-muted-foreground">Abuse, copyright and spam reports</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader><CardTitle>{rows.length} {tab} reports</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Reason</TableHead><TableHead>Target</TableHead><TableHead>Status</TableHead><TableHead>Filed</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><div className="font-medium flex items-center gap-1"><Flag className="h-4 w-4 text-destructive" /> {r.reason}</div></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.target_type} · {r.target_id?.slice(0, 8) ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => { setActive(r); setNotes(r.resolution_notes ?? ""); }}>Review</Button></TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">No reports</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Report · {active?.reason}</DialogTitle></DialogHeader>
          {active && (
            <div className="space-y-3">
              <div className="text-sm"><span className="text-muted-foreground">Target:</span> {active.target_type} {active.target_id}</div>
              <div className="text-sm whitespace-pre-wrap">{active.details ?? "No details"}</div>
              <Textarea placeholder="Resolution notes…" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
            </div>
          )}
          <DialogFooter className="flex-wrap gap-2">
            <Button variant="outline" onClick={() => resolve("investigating")}>Investigating</Button>
            <Button variant="outline" onClick={() => resolve("dismissed")}><X className="h-4 w-4" /> Dismiss</Button>
            <Button onClick={() => resolve("resolved")}><ShieldCheck className="h-4 w-4" /> Resolve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReports;
