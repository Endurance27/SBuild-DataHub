import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Award, Plus, Minus, Medal, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Player { id: string; name: string; xp: number; level: number; rank: string; badges: number; }

const seed: Player[] = [
  { id: "1", name: "ama.k", xp: 4820, level: 12, rank: "Expert", badges: 8 },
  { id: "2", name: "kwame.o", xp: 3210, level: 9, rank: "Contributor", badges: 5 },
  { id: "3", name: "akua.b", xp: 1240, level: 4, rank: "Novice", badges: 2 },
];

const AdminLeaderboard = () => {
  const [players, setPlayers] = useState<Player[]>(seed);
  const [q, setQ] = useState("");
  const filtered = players.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  const adjust = (id: string, delta: number) =>
    setPlayers((xs) => xs.map((x) => x.id === id ? { ...x, xp: Math.max(0, x.xp + delta) } : x));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Award className="h-7 w-7" /> Leaderboard & Gamification</h1>
          <p className="text-muted-foreground">Adjust XP, award badges, reset ranks</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} className="w-60" />
          <Button variant="outline" onClick={() => toast.success("Season reset queued")}>
            <RefreshCw className="h-4 w-4 mr-1" /> Reset season
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Top contributors</CardTitle></CardHeader>
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
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">@{p.name}</TableCell>
                  <TableCell><Badge variant="secondary">{p.rank}</Badge></TableCell>
                  <TableCell className="text-right">{p.level}</TableCell>
                  <TableCell className="text-right">{p.xp.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{p.badges}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => adjust(p.id, 100)}><Plus className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => adjust(p.id, -100)}><Minus className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => { setPlayers((xs) => xs.map((x) => x.id === p.id ? { ...x, badges: x.badges + 1 } : x)); toast.success("Badge awarded"); }}>
                      <Medal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeaderboard;
