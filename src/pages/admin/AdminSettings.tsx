import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const [siteName, setSiteName] = useState("GH DataHub");
  const [allowSignups, setAllowSignups] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("platform_settings").select("*");
      data?.forEach((row: any) => {
        if (row.key === "site_name") setSiteName(typeof row.value === "string" ? row.value : row.value);
        if (row.key === "allow_signups") setAllowSignups(!!row.value);
        if (row.key === "maintenance_mode") setMaintenance(!!row.value);
      });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const uid = (await supabase.auth.getUser()).data.user?.id;
    const rows = [
      { key: "site_name", value: siteName as any, updated_by: uid },
      { key: "allow_signups", value: allowSignups as any, updated_by: uid },
      { key: "maintenance_mode", value: maintenance as any, updated_by: uid },
    ];
    const { error } = await supabase.from("platform_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Platform configuration (persisted)</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Public-facing identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="sitename">Site name</Label>
            <Input id="sitename" value={siteName} onChange={(e) => setSiteName(e.target.value)} disabled={loading} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Access</CardTitle>
          <CardDescription>Control how users join and use the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="signups">Allow public sign-ups</Label>
            <Switch id="signups" checked={allowSignups} onCheckedChange={setAllowSignups} disabled={loading} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="maint">Maintenance mode</Label>
            <Switch id="maint" checked={maintenance} onCheckedChange={setMaintenance} disabled={loading} />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={save} disabled={saving || loading}>{saving ? "Saving…" : "Save all"}</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
