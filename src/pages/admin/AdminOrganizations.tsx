import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

interface Org { id: string; name: string; slug: string; description: string | null; website: string | null; verified: boolean; }

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminOrganizations = () => {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", website: "" });

  const load = async () => {
    const { data } = await supabase.from("organizations").select("*").order("created_at", { ascending: false });
    setOrgs((data as Org[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name.trim()) return;
    const { error } = await supabase.from("organizations").insert({
      name: form.name, slug: slugify(form.name), description: form.description, website: form.website,
    });
    if (error) return toast.error(error.message);
    toast.success("Organization created");
    setForm({ name: "", description: "", website: "" });
    setOpen(false);
    load();
  };

  const toggleVerified = async (o: Org) => {
    await supabase.from("organizations").update({ verified: !o.verified }).eq("id", o.id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete organization?")) return;
    await supabase.from("organizations").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">Institutions, agencies and partners</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> New organization</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New organization</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" /></div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={create}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>{orgs.length} organizations</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Website</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {orgs.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{o.slug}</TableCell>
                  <TableCell className="text-sm">{o.website ?? "—"}</TableCell>
                  <TableCell>{o.verified ? <Badge>Verified</Badge> : <Badge variant="outline">Unverified</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => toggleVerified(o)}><BadgeCheck className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {orgs.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">No organizations yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrganizations;
