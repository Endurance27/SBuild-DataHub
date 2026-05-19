import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Pencil, Trash2, Lock, Search } from "lucide-react";
import { toast } from "sonner";

interface Row {
  id: string;
  name: string;
  owner: string;
  size: string;
  status: "published" | "pending" | "restricted" | "hidden";
  updated: string;
  description?: string;
}

const seed: Row[] = [
  { id: "1", name: "Ghana 2021 Census Microdata", owner: "GSS", size: "1.2 GB", status: "published", updated: "2026-05-10" },
  { id: "2", name: "Accra Climate Records", owner: "GMet", size: "320 MB", status: "published", updated: "2026-05-08" },
  { id: "3", name: "Cocoa Yields by Region", owner: "COCOBOD", size: "84 MB", status: "pending", updated: "2026-05-12" },
  { id: "4", name: "Mobile Money Transactions", owner: "Bank of Ghana", size: "2.7 GB", status: "restricted", updated: "2026-05-01" },
  { id: "5", name: "Public Health Indicators", owner: "MoH", size: "560 MB", status: "published", updated: "2026-04-22" },
  { id: "6", name: "Road Traffic Sensors Accra", owner: "Urban Roads", size: "910 MB", status: "hidden", updated: "2026-03-30" },
];

const statusVariant: Record<Row["status"], "default" | "secondary" | "outline" | "destructive"> = {
  published: "default",
  pending: "secondary",
  restricted: "outline",
  hidden: "destructive",
};

const AdminDatasets = () => {
  const [rows, setRows] = useState<Row[]>(seed);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [viewing, setViewing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);

  const filtered = useMemo(
    () => rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.owner.toLowerCase().includes(query.toLowerCase())),
    [rows, query]
  );

  const saveEdit = (r: Row) => {
    setRows((rs) => rs.map((x) => (x.id === r.id ? r : x)));
    toast.success("Dataset updated");
    setEditing(null);
  };
  const confirmDelete = () => {
    if (!deleting) return;
    setRows((rs) => rs.filter((x) => x.id !== deleting.id));
    toast.success("Dataset deleted");
    setDeleting(null);
  };
  const toggleRestrict = (r: Row) => {
    setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: x.status === "restricted" ? "published" : "restricted" } : x)));
    toast.success(r.status === "restricted" ? "Access opened" : "Access restricted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Datasets</h1>
          <p className="text-muted-foreground">Manage all repository datasets</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search datasets…" className="pl-9 w-64" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No datasets match your search</TableCell></TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.owner}</TableCell>
                  <TableCell>{r.size}</TableCell>
                  <TableCell><Badge variant={statusVariant[r.status]}>{r.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.updated}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => setViewing(r)}><Eye className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditing({ ...r })}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => toggleRestrict(r)}><Lock className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeleting(r)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewing?.name}</DialogTitle>
            <DialogDescription>Owner: {viewing?.owner} · {viewing?.size}</DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Status: <Badge variant={viewing ? statusVariant[viewing.status] : "default"}>{viewing?.status}</Badge></p>
            <p>Last updated: {viewing?.updated}</p>
            <p>{viewing?.description ?? "No description provided."}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit dataset</DialogTitle>
            <DialogDescription>Update metadata for this dataset</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Owner</Label>
                  <Input value={editing.owner} onChange={(e) => setEditing({ ...editing, owner: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Size</Label>
                  <Input value={editing.size} onChange={(e) => setEditing({ ...editing, size: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && saveEdit(editing)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete dataset?</DialogTitle>
            <DialogDescription>This will permanently remove <strong>{deleting?.name}</strong>. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDatasets;
