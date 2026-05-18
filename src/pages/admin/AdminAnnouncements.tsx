import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Trash2 } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
}

const AdminAnnouncements = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as Announcement[]);
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("announcements").insert({ title, body, created_by: user?.id });
    setSaving(false);
    if (error) return toast.error(error.message);
    setTitle(""); setBody("");
    toast.success("Announcement posted");
    load();
  };

  const togglePublish = async (a: Announcement) => {
    await supabase.from("announcements").update({ published: !a.published }).eq("id", a.id);
    load();
  };
  const remove = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    toast.success("Removed");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">Broadcast updates to the community</p>
      </div>

      <Card>
        <CardHeader><CardTitle>New Announcement</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={create} className="space-y-3">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Message body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
            <Button type="submit" disabled={saving}>{saving ? "Posting..." : "Post"}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.length === 0 && <p className="text-muted-foreground text-sm">No announcements yet.</p>}
        {items.map((a) => (
          <Card key={a.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{a.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{new Date(a.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={a.published ? "default" : "outline"}>{a.published ? "Published" : "Draft"}</Badge>
                <Button size="sm" variant="outline" onClick={() => togglePublish(a)}>
                  {a.published ? "Unpublish" : "Publish"}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="text-sm whitespace-pre-wrap">{a.body}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
