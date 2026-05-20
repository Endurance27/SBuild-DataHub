import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Announcement { id: string; title: string; body: string; published: boolean; created_at: string; }

const AdminAnnouncements = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", body: "", published: true });

  const load = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("id,title,body,published,created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data ?? []) as Announcement[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Sign in required");
    const { error } = await supabase.from("announcements").insert({
      title: form.title, body: form.body, published: form.published, created_by: user.id,
    });
    if (error) return toast.error(error.message);
    toast.success("Announcement posted");
    setForm({ title: "", body: "", published: true });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  const togglePublish = async (a: Announcement) => {
    const { error } = await supabase.from("announcements").update({ published: !a.published }).eq("id", a.id);
    if (error) return toast.error(error.message);
    setItems((xs) => xs.map((x) => x.id === a.id ? { ...x, published: !x.published } : x));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><Megaphone className="h-7 w-7" /> Announcements</h1>
        <p className="text-muted-foreground">Send platform-wide messages to users</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> New announcement</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={create} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="t">Title</Label>
                <Input id="t" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b">Message</Label>
                <Textarea id="b" rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pub">Publish immediately</Label>
                <Switch id="pub" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              </div>
              <Button type="submit" className="w-full">Post announcement</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No announcements yet</p>
            ) : items.map((a) => (
              <div key={a.id} className="rounded-md border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div>
                  </div>
                  <Badge variant={a.published ? "default" : "outline"}>{a.published ? "Published" : "Draft"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{a.body}</p>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => togglePublish(a)}>
                    {a.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(a.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
