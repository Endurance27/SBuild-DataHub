import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Star, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface NB {
  id: string;
  title: string;
  author_id: string | null;
  views: number;
  featured: boolean;
  hidden: boolean;
}

const AdminNotebooks = () => {
  const [items, setItems] = useState<NB[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notebooks")
      .select("id,title,author_id,views,featured,hidden")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as NB[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: Partial<NB>) => {
    const { error } = await supabase.from("notebooks").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    setItems((xs) => xs.map((x) => x.id === id ? { ...x, ...patch } : x));
    toast.success("Updated");
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("notebooks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((xs) => xs.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

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
        <CardHeader><CardTitle>{loading ? "Loading…" : `${filtered.length} Notebooks`}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Author</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium">{n.title}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{n.author_id?.slice(0, 8) ?? "—"}</TableCell>
                  <TableCell className="text-right">{n.views.toLocaleString()}</TableCell>
                  <TableCell className="space-x-1">
                    {n.featured && <Badge>Featured</Badge>}
                    {n.hidden && <Badge variant="outline">Hidden</Badge>}
                    {!n.featured && !n.hidden && <Badge variant="secondary">Public</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => update(n.id, { featured: !n.featured })}>
                      <Star className={`h-4 w-4 ${n.featured ? "fill-current" : ""}`} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => update(n.id, { hidden: !n.hidden })}>
                      <EyeOff className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(n.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">No notebooks yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotebooks;
