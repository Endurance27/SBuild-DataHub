import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Lock, Trash2, Flag } from "lucide-react";
import { toast } from "sonner";

interface Thread { id: string; title: string; author: string; category: string; replies: number; locked: boolean; flagged: boolean; }

const seed: Thread[] = [
  { id: "1", title: "Best practices for cleaning census data?", author: "ama.k", category: "Help", replies: 12, locked: false, flagged: false },
  { id: "2", title: "Cocoa competition Q&A", author: "host", category: "Competitions", replies: 34, locked: false, flagged: false },
  { id: "3", title: "OFF-TOPIC — buy my crypto", author: "spam99", category: "General", replies: 2, locked: false, flagged: true },
];

const AdminDiscussions = () => {
  const [items, setItems] = useState<Thread[]>(seed);
  const [q, setQ] = useState("");
  const filtered = items.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><MessageSquare className="h-7 w-7" /> Discussions</h1>
          <p className="text-muted-foreground">Moderate community threads and replies</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search threads…" className="pl-9" />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>All Threads</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Category</TableHead>
                <TableHead className="text-right">Replies</TableHead><TableHead>Flags</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell className="text-muted-foreground">@{t.author}</TableCell>
                  <TableCell><Badge variant="secondary">{t.category}</Badge></TableCell>
                  <TableCell className="text-right">{t.replies}</TableCell>
                  <TableCell>
                    {t.flagged && <Badge variant="destructive" className="gap-1"><Flag className="h-3 w-3" /> Reported</Badge>}
                    {t.locked && <Badge variant="outline" className="ml-1">Locked</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => { setItems((xs) => xs.map((x) => x.id === t.id ? { ...x, locked: !x.locked } : x)); toast.success(t.locked ? "Unlocked" : "Locked"); }}>
                      <Lock className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setItems((xs) => xs.filter((x) => x.id !== t.id)); toast.success("Thread removed"); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
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

export default AdminDiscussions;
