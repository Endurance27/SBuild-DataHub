import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Log {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: any;
  created_at: string;
}

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200);
      setLogs((data ?? []) as Log[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Recent administrative activity</p>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead><TableHead>Action</TableHead><TableHead>Target</TableHead><TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
            ) : logs.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No activity yet</TableCell></TableRow>
            ) : logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="text-sm text-muted-foreground">{new Date(l.created_at).toLocaleString()}</TableCell>
                <TableCell><Badge variant="secondary">{l.action}</Badge></TableCell>
                <TableCell className="text-sm">{l.target_type ?? "—"} {l.target_id ? `· ${l.target_id.slice(0, 8)}` : ""}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{JSON.stringify(l.metadata)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
