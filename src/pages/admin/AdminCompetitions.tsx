import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const mock = [
  { id: "1", title: "Crop Yield Prediction Challenge", entrants: 124, status: "active", endsAt: "2026-06-30" },
  { id: "2", title: "Traffic Flow in Accra", entrants: 56, status: "upcoming", endsAt: "2026-08-15" },
  { id: "3", title: "Healthcare Outcomes 2025", entrants: 312, status: "closed", endsAt: "2026-03-12" },
];

const AdminCompetitions = () => {
  const [rows, setRows] = useState(mock);
  const setStatus = (id: string, status: string) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success(`Competition ${status}`);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Competitions</h1>
          <p className="text-muted-foreground">Manage challenges & submissions</p>
        </div>
        <Button onClick={() => toast.info("Create flow uses /host-competition")}>New Competition</Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead><TableHead>Entrants</TableHead><TableHead>Status</TableHead><TableHead>Ends</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell>{c.entrants}</TableCell>
                <TableCell><Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
                <TableCell>{c.endsAt}</TableCell>
                <TableCell className="text-right space-x-2">
                  {c.status !== "closed" && <Button size="sm" variant="outline" onClick={() => setStatus(c.id, "closed")}>Close</Button>}
                  {c.status !== "active" && <Button size="sm" onClick={() => setStatus(c.id, "active")}>Activate</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCompetitions;
