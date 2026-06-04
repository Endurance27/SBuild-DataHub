import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Tag as TagIcon } from "lucide-react";
import { toast } from "sonner";

interface Cat { id: string; name: string; slug: string; sort_order: number; }
interface T { id: string; name: string; slug: string; }

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminCategories = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [tags, setTags] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", sort_order: 0 });
  const [newTag, setNewTag] = useState("");

  const load = async () => {
    const [c, t] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("tags").select("*").order("name"),
    ]);
    setCats((c.data as Cat[]) ?? []);
    setTags((t.data as T[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const createCat = async () => {
    if (!form.name.trim()) return;
    const { error } = await supabase.from("categories").insert({ name: form.name, slug: slugify(form.name), sort_order: form.sort_order });
    if (error) return toast.error(error.message);
    toast.success("Category created");
    setForm({ name: "", sort_order: 0 });
    setOpen(false);
    load();
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    const { error } = await supabase.from("tags").insert({ name: newTag, slug: slugify(newTag) });
    if (error) return toast.error(error.message);
    setNewTag("");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories & Tags</h1>
        <p className="text-muted-foreground">Taxonomy used across the platform</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4" /> Add</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New category</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} /></div>
                </div>
                <DialogFooter><Button onClick={createCat}>Create</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Order</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {cats.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{c.slug}</TableCell>
                    <TableCell>{c.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={async () => { if (confirm("Delete?")) { await supabase.from("categories").delete().eq("id", c.id); load(); } }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="New tag…" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()} />
              <Button onClick={addTag}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge key={t.id} variant="secondary" className="gap-1 cursor-pointer" onClick={async () => { if (confirm(`Delete tag "${t.name}"?`)) { await supabase.from("tags").delete().eq("id", t.id); load(); } }}>
                  <TagIcon className="h-3 w-3" /> {t.name}
                </Badge>
              ))}
              {tags.length === 0 && <p className="text-sm text-muted-foreground">No tags yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCategories;
