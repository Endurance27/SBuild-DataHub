import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Log {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: any;
  created_at: string;
}

const RANGES = [
  { value: "all", label: "All time" },
  { value: "1h", label: "Last hour" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const rangeToDate = (r: string) => {
  const now = Date.now();
  const map: Record<string, number> = { "1h": 3600e3, "24h": 86400e3, "7d": 7 * 86400e3, "30d": 30 * 86400e3 };
  return map[r] ? new Date(now - map[r]).toISOString() : null;
};

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [actor, setActor] = useState("");
  const [action, setAction] = useState("all");
  const [targetType, setTargetType] = useState("all");
  const [range, setRange] = useState("all");

  const load = async () => {
    setLoading(true);
    let q = supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500);
    const since = rangeToDate(range);
    if (since) q = q.gte("created_at", since);
    if (action !== "all") q = q.eq("action", action);
    if (targetType !== "all") q = q.eq("target_type", targetType);
    if (actor.trim()) q = q.ilike("actor_id", `%${actor.trim()}%`);
    const { data } = await q;
    setLogs((data ?? []) as Log[]);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [action, targetType, range]);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); /* eslint-disable-next-line */ }, [actor]);

  const actions = useMemo(() => Array.from(new Set(logs.map((l) => l.action))).sort(), [logs]);
  const targets = useMemo(() => Array.from(new Set(logs.map((l) => l.target_type ?? "").filter(Boolean))).sort(), [logs]);

  const reset = () => { setActor(""); setAction("all"); setTargetType("all"); setRange("all"); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Recent administrative activity</p>
      </div>

      <Card>
        <CardContent className="p-4 grid gap-3 md:grid-cols-5">
          <div className="space-y-1.5">
            <Label className="text-xs">Actor ID</Label>
            <Input value={actor} onChange={(e) => setActor(e.target.value)} placeholder="uuid fragment…" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Action</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {actions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Target type</Label>
            <Select value={targetType} onValueChange={setTargetType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All targets</SelectItem>
                {targets.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Time range</Label>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RANGES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-end"><Button variant="outline" className="w-full" onClick={reset}>Reset</Button></div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead>Target</TableHead><TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
            ) : logs.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No matching activity</TableCell></TableRow>
            ) : logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="text-sm text-muted-foreground">{new Date(l.created_at).toLocaleString()}</TableCell>
                <TableCell className="font-mono text-xs">{l.actor_id ? l.actor_id.slice(0, 8) : "—"}</TableCell>
                <TableCell><Badge variant="secondary">{l.action}</Badge></TableCell>
                <TableCell className="text-sm">{l.target_type ?? "—"} {l.target_id ? `· ${l.target_id.slice(0, 8)}` : ""}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground max-w-xs truncate">{JSON.stringify(l.metadata)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
