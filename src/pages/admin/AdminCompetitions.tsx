import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Trophy, Search, Check, X, Award } from "lucide-react";
import { toast } from "sonner";

interface Comp { id: string; title: string; host: string; status: "draft" | "active" | "closed"; participants: number; prize: string; }

const seed: Comp[] = [
  { id: "1", title: "Ghana Climate Forecasting", host: "Dr. Mensah", status: "active", participants: 142, prize: "GHS 10,000" },
  { id: "2", title: "Cocoa Yield Prediction", host: "AgriTech Lab", status: "draft", participants: 0, prize: "GHS 5,000" },
  { id: "3", title: "Accra Traffic Optimization", host: "UrbanData", status: "closed", participants: 87, prize: "GHS 7,500" },
];

const AdminCompetitions = () => {
  const [items, setItems] = useState<Comp[]>(seed);
  const [q, setQ] = useState("");
  const filtered = items.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));

  const update = (id: string, patch: Partial<Comp>) => setItems((xs) => xs.map((x) => x.id === id ? { ...x, ...patch } : x));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Trophy className="h-7 w-7" /> Competitions</h1>
          <p className="text-muted-foreground">Approve, monitor and close competitions</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search competitions…" className="pl-9" />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>All Competitions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Host</TableHead><TableHead>Status</TableHead>
                <TableHead className="text-right">Participants</TableHead><TableHead>Prize</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell className="text-muted-foreground">{c.host}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "active" ? "default" : c.status === "draft" ? "secondary" : "outline"}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{c.participants}</TableCell>
                  <TableCell>{c.prize}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {c.status === "draft" && (
                      <Button size="sm" variant="ghost" onClick={() => { update(c.id, { status: "active" }); toast.success("Approved"); }}>
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                    {c.status === "active" && (
                      <Button size="sm" variant="ghost" onClick={() => { update(c.id, { status: "closed" }); toast.success("Closed"); }}>
                        <X className="h-4 w-4 mr-1" /> Close
                      </Button>
                    )}
                    {c.status === "closed" && (
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Winner announced")}>
                        <Award className="h-4 w-4 mr-1" /> Pick winner
                      </Button>
                    )}
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

export default AdminCompetitions;
