import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Award, Plus, Minus, Medal, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Row {
  user_id: string;
  xp: number;
  level: number;
  rank: string;
  display_name?: string | null;
  badges: number;
  updated_at?: string;
}

interface BadgeRec { id: string; name: string; description: string | null; }

const rankFor = (xp: number) => xp >= 4000 ? "Expert" : xp >= 2000 ? "Contributor" : xp >= 500 ? "Apprentice" : "Novice";
const levelFor = (xp: number) => Math.max(1, Math.floor(xp / 400) + 1);

const PERIODS = [
  { value: "all", label: "All time" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];
const PAGE_SIZE = 25;

const logAction = async (action: string, target_id: string, metadata: any = {}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("audit_logs").insert({ actor_id: user.id, action, target_type: "user_xp", target_id, metadata });
};

const AdminLeaderboard = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [badges, setBadges] = useState<BadgeRec[]>([]);
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [awardOpen, setAwardOpen] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string>("");

  const load = async () => {
    setLoading(true);
    let q1 = supabase.from("user_xp").select("*", { count: "exact" }).order("xp", { ascending: false });
    if (period !== "all") {
      const map: Record<string, number> = { "24h": 86400e3, "7d": 7 * 86400e3, "30d": 30 * 86400e3 };
      const since = new Date(Date.now() - map[period]).toISOString();
      q1 = q1.gte("updated_at", since);
    }
    const from = page * PAGE_SIZE;
    const { data: xp, count } = await q1.range(from, from + PAGE_SIZE - 1);
    const [{ data: profs }, { data: ub }, { data: b }] = await Promise.all([
      supabase.from("profiles").select("id, display_name"),
      supabase.from("user_badges").select("user_id"),
      supabase.from("badges").select("*").order("name"),
    ]);
    const nameMap = new Map((profs ?? []).map((p: any) => [p.id, p.display_name]));
    const badgeCount: Record<string, number> = {};
    (ub ?? []).forEach((x: any) => { badgeCount[x.user_id] = (badgeCount[x.user_id] ?? 0) + 1; });
    setRows((xp ?? []).map((r: any) => ({
      user_id: r.user_id, xp: r.xp, level: r.level, rank: r.rank,
      display_name: nameMap.get(r.user_id) ?? null,
      badges: badgeCount[r.user_id] ?? 0, updated_at: r.updated_at,
    })));
    setBadges((b ?? []) as BadgeRec[]);
    setTotal(count ?? 0);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, period]);

  const adjust = async (r: Row, delta: number) => {
    const xp = Math.max(0, r.xp + delta);
    const patch = { xp, level: levelFor(xp), rank: rankFor(xp) };
    const { error } = await supabase.from("user_xp").update(patch).eq("user_id", r.user_id);
    if (error) return toast.error(error.message);
    await logAction("xp.adjust", r.user_id, { delta, new_xp: xp });
    toast.success(`XP ${delta > 0 ? "+" : ""}${delta}`);
    load();
  };

  const award = async () => {
    if (!awardOpen || !selectedBadge) return;
    const { error } = await supabase.from("user_badges").insert({ user_id: awardOpen, badge_id: selectedBadge });
    if (error) return toast.error(error.message);
    await logAction("badge.award", awardOpen, { badge_id: selectedBadge });
    toast.success("Badge awarded");
    setAwardOpen(null); setSelectedBadge("");
    load();
  };

  const filtered = useMemo(
    () => rows.filter((r) => (r.display_name ?? r.user_id).toLowerCase().includes(q.toLowerCase())),
    [rows, q]
  );
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Award className="h-7 w-7" /> Leaderboard & Gamification</h1>
          <p className="text-muted-foreground">Adjust XP, award badges, manage ranks</p>
        </div>
        <div className="flex items-end gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Period</Label>
            <Select value={period} onValueChange={(v) => { setPeriod(v); setPage(0); }}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{PERIODS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="relative w-60">
            <Search className="absolute left-3 top-[calc(50%+10px)] -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Label className="text-xs">Search</Label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter on page…" className="pl-9" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top contributors</CardTitle>
          <span className="text-sm text-muted-foreground">{total.toLocaleString()} total</span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead><TableHead>Rank</TableHead>
                <TableHead className="text-right">Level</TableHead><TableHead className="text-right">XP</TableHead>
                <TableHead className="text-right">Badges</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No entries</TableCell></TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.user_id}>
                  <TableCell className="font-medium">{r.display_name ?? r.user_id.slice(0, 8)}</TableCell>
                  <TableCell><Badge variant="secondary">{r.rank}</Badge></TableCell>
                  <TableCell className="text-right">{r.level}</TableCell>
                  <TableCell className="text-right">{r.xp.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{r.badges}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => adjust(r, 100)}><Plus className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => adjust(r, -100)}><Minus className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setAwardOpen(r.user_id)}><Medal className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex items-center justify-between p-3 border-t">
          <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>

      <Dialog open={!!awardOpen} onOpenChange={(o) => { if (!o) { setAwardOpen(null); setSelectedBadge(""); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Award badge</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Badge</Label>
            <Select value={selectedBadge} onValueChange={setSelectedBadge}>
              <SelectTrigger><SelectValue placeholder="Choose a badge" /></SelectTrigger>
              <SelectContent>
                {badges.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={award} disabled={!selectedBadge}>Award</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeaderboard;
