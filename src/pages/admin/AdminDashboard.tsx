import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Database, Upload, HardDrive } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const chartData = [
  { day: "Mon", uploads: 4, downloads: 12 },
  { day: "Tue", uploads: 7, downloads: 18 },
  { day: "Wed", uploads: 5, downloads: 22 },
  { day: "Thu", uploads: 12, downloads: 30 },
  { day: "Fri", uploads: 9, downloads: 28 },
  { day: "Sat", uploads: 6, downloads: 19 },
  { day: "Sun", uploads: 11, downloads: 34 },
];

const recentActivity = [
  { who: "ama.k@ug.edu.gh", action: "Uploaded", target: "cocoa_yields_2024.csv", when: "2m ago", status: "success" },
  { who: "admin", action: "Revoked role", target: "kojo.m@gh.dev", when: "12m ago", status: "warning" },
  { who: "yaw.b", action: "Deleted", target: "old_traffic.json", when: "1h ago", status: "destructive" },
  { who: "GSS", action: "Published", target: "Ghana Census 2021", when: "3h ago", status: "success" },
  { who: "system", action: "Backup", target: "nightly snapshot", when: "6h ago", status: "default" },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, announcements: 0, logs: 0 });

  useEffect(() => {
    (async () => {
      const [u, a, l] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("announcements").select("id", { count: "exact", head: true }),
        supabase.from("audit_logs").select("id", { count: "exact", head: true }),
      ]);
      setStats({ users: u.count ?? 0, announcements: a.count ?? 0, logs: l.count ?? 0 });
    })();
  }, []);

  const kpis = [
    { label: "Total Datasets", value: 248, icon: Database, hint: "+12 this week" },
    { label: "Active Users", value: stats.users, icon: Users, hint: "live count" },
    { label: "Uploads Today", value: 17, icon: Upload, hint: "+4 vs yesterday" },
    { label: "Storage Used", value: "412 GB", icon: HardDrive, hint: "of 1 TB" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Platform overview & key metrics</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.hint}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Data Activity · last 7 days</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line type="monotone" dataKey="uploads" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="downloads" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Announcements</span><span className="font-medium">{stats.announcements}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Audit events</span><span className="font-medium">{stats.logs}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pending reviews</span><span className="font-medium">5</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Open reports</span><span className="font-medium">2</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="text-right">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.who}</TableCell>
                  <TableCell><Badge variant={r.status as any}>{r.action}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{r.target}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{r.when}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
