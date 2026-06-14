import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

const AdminAnalytics = () => {
  const [usage, setUsage] = useState<{ d: string; uploads: number; downloads: number }[]>([]);
  const [top, setTop] = useState<{ name: string; count: number }[]>([]);
  const [users, setUsers] = useState<{ d: string; u: number }[]>([]);
  const [totals, setTotals] = useState({ users: 0, datasets: 0, downloads: 0, notebooks: 0 });

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 6 * 86400000);
      const isoSince = since.toISOString();

      const [{ data: ds }, { data: notebooks }, { data: profiles }, { data: topDs }, uCnt, dCnt, nCnt] = await Promise.all([
        supabase.from("datasets").select("created_at,downloads").gte("created_at", isoSince),
        supabase.from("notebooks").select("created_at,views"),
        supabase.from("profiles").select("created_at").gte("created_at", new Date(Date.now() - 6 * 7 * 86400000).toISOString()),
        supabase.from("datasets").select("title,downloads").order("downloads", { ascending: false }).limit(5),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("datasets").select("id,downloads", { count: "exact" }),
        supabase.from("notebooks").select("id", { count: "exact", head: true }),
      ]);

      const days: string[] = [];
      const dayMap: Record<string, { uploads: number; downloads: number }> = {};
      for (let i = 6; i >= 0; i--) {
        const k = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
        days.push(k);
        dayMap[k] = { uploads: 0, downloads: 0 };
      }
      ds?.forEach((r: any) => {
        const k = (r.created_at ?? "").slice(0, 10);
        if (k in dayMap) { dayMap[k].uploads++; dayMap[k].downloads += r.downloads ?? 0; }
      });
      setUsage(days.map((k) => ({ d: k.slice(5), ...dayMap[k] })));

      setTop((topDs ?? []).map((r: any) => ({ name: r.title.slice(0, 18), count: r.downloads ?? 0 })));

      const weeks: string[] = [];
      const wkMap: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const wk = `W${6 - i}`;
        weeks.push(wk);
        wkMap[wk] = 0;
      }
      profiles?.forEach((r: any) => {
        const ageDays = Math.floor((Date.now() - new Date(r.created_at).getTime()) / 86400000);
        const wkIdx = 5 - Math.min(5, Math.floor(ageDays / 7));
        const key = `W${wkIdx + 1}`;
        if (key in wkMap) wkMap[key]++;
      });
      setUsers(weeks.map((w) => ({ d: w, u: wkMap[w] })));

      const totalDownloads = (dCnt.data as any[])?.reduce((s, r) => s + (r.downloads ?? 0), 0) ?? 0;
      setTotals({
        users: uCnt.count ?? 0,
        datasets: dCnt.count ?? 0,
        downloads: totalDownloads,
        notebooks: nCnt.count ?? 0,
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Real-time usage, downloads and engagement</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Users", v: totals.users },
          { l: "Datasets", v: totals.datasets },
          { l: "Total downloads", v: totals.downloads },
          { l: "Notebooks", v: totals.notebooks },
        ].map((k) => (
          <Card key={k.l}>
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">{k.l}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{k.v.toLocaleString()}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Uploads & Downloads · 7 days</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Legend />
                <Line type="monotone" dataKey="uploads" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="downloads" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Datasets (downloads)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>New users · last 6 weeks</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={users}>
                <defs>
                  <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Area type="monotone" dataKey="u" stroke="hsl(var(--primary))" fill="url(#usersFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
