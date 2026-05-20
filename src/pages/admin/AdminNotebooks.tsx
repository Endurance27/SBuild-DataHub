import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Star, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface NB { id: string; title: string; author: string; views: number; featured: boolean; hidden: boolean; }

const seed: NB[] = [
  { id: "1", title: "Intro to Pandas with Ghana Census", author: "ama.k", views: 1240, featured: true, hidden: false },
  { id: "2", title: "Climate trends in Accra (2010-2024)", author: "kwame.o", views: 820, featured: false, hidden: false },
  { id: "3", title: "Spammy notebook ❌❌", author: "anon42", views: 4, featured: false, hidden: true },
];

const AdminNotebooks = () => {
  const [items, setItems] = useState<NB[]>(seed);
  const [q, setQ] = useState("");
  const filtered = items.filter((n) => n.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><BookOpen className="h-7 w-7" /> Notebooks</h1>
          <p className="text-muted-foreground">Feature, hide, or remove community notebooks</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notebooks…" className="pl-9" />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>All Notebooks</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead className="text-right">Views</TableHead>
                <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium">{n.title}</TableCell>
                  <TableCell className="text-muted-foreground">@{n.author}</TableCell>
                  <TableCell className="text-right">{n.views.toLocaleString()}</TableCell>
                  <TableCell className="space-x-1">
                    {n.featured && <Badge>Featured</Badge>}
                    {n.hidden && <Badge variant="outline">Hidden</Badge>}
                    {!n.featured && !n.hidden && <Badge variant="secondary">Public</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => { setItems((xs) => xs.map((x) => x.id === n.id ? { ...x, featured: !x.featured } : x)); toast.success(n.featured ? "Unfeatured" : "Featured"); }}>
                      <Star className={`h-4 w-4 ${n.featured ? "fill-current" : ""}`} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setItems((xs) => xs.map((x) => x.id === n.id ? { ...x, hidden: !x.hidden } : x)); toast.success(n.hidden ? "Shown" : "Hidden"); }}>
                      <EyeOff className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setItems((xs) => xs.filter((x) => x.id !== n.id)); toast.success("Deleted"); }}>
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

export default AdminNotebooks;
