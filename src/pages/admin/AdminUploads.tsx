import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

const ACCEPTED = [".csv", ".json", ".xlsx", ".xls", ".parquet"];

const AdminUploads = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [meta, setMeta] = useState({ title: "", tags: "", category: "", description: "" });

  const pick = (f: File | null) => {
    if (!f) return;
    const ok = ACCEPTED.some((ext) => f.name.toLowerCase().endsWith(ext));
    if (!ok) return toast.error(`Unsupported file. Allowed: ${ACCEPTED.join(", ")}`);
    setFile(f);
    setMeta((m) => ({ ...m, title: m.title || f.name.replace(/\.[^.]+$/, "") }));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    pick(e.dataTransfer.files?.[0] ?? null);
  };

  const startUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Choose a file first");
    if (!meta.title.trim()) return toast.error("Title is required");
    setUploading(true);
    setProgress(0);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setUploading(false);
          toast.success("Upload complete");
          setFile(null);
          setMeta({ title: "", tags: "", category: "", description: "" });
          setProgress(0);
          return 0;
        }
        return p + 8;
      });
    }, 150);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Uploads</h1>
        <p className="text-muted-foreground">Add a new dataset to the repository</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>File</CardTitle></CardHeader>
          <CardContent>
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg py-12 px-6 cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
              }`}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <div className="font-medium">Drag & drop your file here</div>
              <div className="text-sm text-muted-foreground mt-1">or click to browse</div>
              <div className="text-xs text-muted-foreground mt-3">Allowed: {ACCEPTED.join(", ")}</div>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={ACCEPTED.join(",")}
                onChange={(e) => pick(e.target.files?.[0] ?? null)}
              />
            </div>

            {file && (
              <div className="mt-4 flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{file.name.split(".").pop()?.toUpperCase()}</Badge>
                  <Button size="icon" variant="ghost" onClick={() => setFile(null)} disabled={uploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {uploading && (
              <div className="mt-4 space-y-2">
                <Progress value={progress} />
                <div className="text-xs text-muted-foreground">Uploading… {progress}%</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={startUpload} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cat">Category</Label>
                  <Input id="cat" placeholder="Healthcare, Climate…" value={meta.category} onChange={(e) => setMeta({ ...meta, category: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="comma, separated" value={meta.tags} onChange={(e) => setMeta({ ...meta, tags: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={5} value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} />
              </div>
              <Button type="submit" disabled={uploading || !file} className="w-full">
                {uploading ? "Uploading…" : "Upload dataset"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUploads;
