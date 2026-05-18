import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const mockDatasets = [
  { id: "1", title: "Ghana 2021 Census Microdata", author: "GSS", status: "published" },
  { id: "2", title: "Accra Climate Records", author: "GMet", status: "published" },
  { id: "3", title: "Cocoa Yields by Region", author: "COCOBOD", status: "pending" },
  { id: "4", title: "Mobile Money Transactions", author: "Bank of Ghana", status: "published" },
];
const mockNotebooks = [
  { id: "1", title: "Predicting Maize Yields", author: "Ama K.", status: "published" },
  { id: "2", title: "NLP on Twi Tweets", author: "Kojo M.", status: "pending" },
  { id: "3", title: "Time-series of Cedi vs USD", author: "Yaw B.", status: "published" },
];

const AdminContent = () => {
  const [datasets, setDatasets] = useState(mockDatasets);
  const [notebooks, setNotebooks] = useState(mockNotebooks);

  const setStatus = (kind: "dataset" | "notebook", id: string, status: string) => {
    if (kind === "dataset") setDatasets((d) => d.map((x) => (x.id === id ? { ...x, status } : x)));
    else setNotebooks((d) => d.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success(`${kind} ${status}`);
  };
  const remove = (kind: "dataset" | "notebook", id: string) => {
    if (kind === "dataset") setDatasets((d) => d.filter((x) => x.id !== id));
    else setNotebooks((d) => d.filter((x) => x.id !== id));
    toast.success(`${kind} removed`);
  };

  const Row = ({ kind, item }: any) => (
    <TableRow>
      <TableCell className="font-medium">{item.title}</TableCell>
      <TableCell>{item.author}</TableCell>
      <TableCell>
        <Badge variant={item.status === "published" ? "default" : item.status === "pending" ? "secondary" : "outline"}>
          {item.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right space-x-2">
        {item.status === "pending" && (
          <Button size="sm" onClick={() => setStatus(kind, item.id, "published")}>Approve</Button>
        )}
        {item.status === "published" && (
          <Button size="sm" variant="outline" onClick={() => setStatus(kind, item.id, "hidden")}>Hide</Button>
        )}
        {item.status === "hidden" && (
          <Button size="sm" variant="outline" onClick={() => setStatus(kind, item.id, "published")}>Restore</Button>
        )}
        <Button size="sm" variant="destructive" onClick={() => remove(kind, item.id)}>Delete</Button>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Datasets & Notebooks</h1>
        <p className="text-muted-foreground">Moderate user-submitted content</p>
      </div>
      <Tabs defaultValue="datasets">
        <TabsList>
          <TabsTrigger value="datasets">Datasets ({datasets.length})</TabsTrigger>
          <TabsTrigger value="notebooks">Notebooks ({notebooks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="datasets" className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{datasets.map((d) => <Row key={d.id} kind="dataset" item={d} />)}</TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="notebooks" className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{notebooks.map((d) => <Row key={d.id} kind="notebook" item={d} />)}</TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
