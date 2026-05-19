import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, Megaphone, ScrollText } from "lucide-react";

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

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Datasets (mock)", value: 12, icon: FileText },
    { label: "Announcements", value: stats.announcements, icon: Megaphone },
    { label: "Audit Events", value: stats.logs, icon: ScrollText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Platform overview & key metrics</p>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Admin Console</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>From here you can manage users, content, competitions, announcements, and review audit logs.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
