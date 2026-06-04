import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Database, Trophy, FileText, Flag, Building2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Activity { id: string; actor_id: string | null; action: string; target_type: string | null; created_at: string; }

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ users: 0, datasets: 0, published: 0, pending: 0, competitions: 0, orgs: 0, openReports: 0, announcements: 0 });
  const [activity, setActivity] = useState<Activity[]>([]);
  const [chart, setChart] = useState<{ day: string; uploads: number }[]>([]);

  useEffect(() => {
    (async () => {
      const [u, dAll, dPub, dPend, comp, orgs, rep, ann, logs, recentDs] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("datasets").select("id", { count: "exact", head: true }),
        supabase.from("datasets").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("datasets").select("id", { count: "exact", head: true }).in("status", ["pending", "under_review"]),
        supabase.from("competitions").select("id", { count: "exact", head: true }),
        supabase.from("organizations").select("id", { count: "exact", head: true }),
        supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("announcements").select("id", { count: "exact", head: true }),
        supabase.from("audit_logs").select("id,actor_id,action,target_type,created_at").order("created_at", { ascending: false }).limit(8),
        supabase.from("datasets").select("created_at").gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
      ]);

      setCounts({
        users: u.count ?? 0,
        datasets: dAll.count ?? 0,
        published: dPub.count ?? 0,
        pending: dPend.count ?? 0,
        competitions: comp.count ?? 0,
        orgs: orgs.count ?? 0,
        openReports: rep.count ?? 0,
        announcements: ann.count ?? 0,
      });
      setActivity((logs.data as Activity[]) ?? []);

      const buckets: Record<string, number> = {};
      const days: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const key = d.toISOString().slice(0, 10);
        days.push(key);
        buckets[key] = 0;
      }
      recentDs.data?.forEach((r: any) => {
        const k = (r.created_at ?? "").slice(0, 10);
        if (k in buckets) buckets[k]++;
      });
      setChart(days.map((k) => ({ day: k.slice(5), uploads: buckets[k] })));
    })();
  }, []);

  const kpis = [
    { label: "Total Datasets", value: counts.datasets, icon: Database, hint: `${counts.published} published` },
    { label: "Pending Reviews", value: counts.pending, icon: FileText, hint: "needs attention" },
    { label: "Active Users", value: counts.users, icon: Users, hint: "registered profiles" },
    { label: "Organizations", value: counts.orgs, icon: Building2, hint: "registered" },
    { label: "Competitions", value: counts.competitions, icon: Trophy, hint: "all-time" },
    { label: "Open Reports", value: counts.openReports, icon: Flag, hint: "to triage" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Platform overview & key metrics</p>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.hint}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Dataset uploads · last 7 days</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Line type="monotone" dataKey="uploads" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Announcements</span><span className="font-medium">{counts.announcements}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Published datasets</span><span className="font-medium">{counts.published}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pending reviews</span><span className="font-medium">{counts.pending}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Open reports</span><span className="font-medium">{counts.openReports}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead>Target</TableHead><TableHead className="text-right">When</TableHead></TableRow></TableHeader>
            <TableBody>
              {activity.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.actor_id?.slice(0, 8) ?? "system"}</TableCell>
                  <TableCell><Badge variant="outline">{r.action}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{r.target_type ?? "—"}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {activity.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">No activity yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
