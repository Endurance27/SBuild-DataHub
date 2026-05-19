import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, RotateCw, Plus, Trash2 } from "lucide-react";

interface ApiKey { id: string; name: string; key: string; created: string; }

const AdminSettings = () => {
  const [allowSignups, setAllowSignups] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [notifyOnUpload, setNotifyOnUpload] = useState(true);
  const [storageLimit, setStorageLimit] = useState("1000");
  const [perUserLimit, setPerUserLimit] = useState("5");
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: "1", name: "Production", key: "sk_live_•••••••• 4f2a", created: "2026-04-10" },
  ]);

  const addKey = () => {
    const k: ApiKey = {
      id: Math.random().toString(36).slice(2),
      name: "New key",
      key: "sk_live_•••••••• " + Math.random().toString(36).slice(2, 6),
      created: new Date().toISOString().slice(0, 10),
    };
    setKeys((ks) => [k, ...ks]);
    toast.success("API key generated");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Repository & platform configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access</CardTitle>
          <CardDescription>Control how users join and use the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="signups">Allow public sign-ups</Label>
            <Switch id="signups" checked={allowSignups} onCheckedChange={(v) => { setAllowSignups(v); toast.success("Saved"); }} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="maint">Maintenance mode</Label>
            <Switch id="maint" checked={maintenance} onCheckedChange={(v) => { setMaintenance(v); toast.success("Saved"); }} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notif">Email admins on new uploads</Label>
            <Switch id="notif" checked={notifyOnUpload} onCheckedChange={(v) => { setNotifyOnUpload(v); toast.success("Saved"); }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storage Limits</CardTitle>
          <CardDescription>Set the maximum repository size</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="total">Total storage (GB)</Label>
            <Input id="total" type="number" value={storageLimit} onChange={(e) => setStorageLimit(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="peruser">Per-user quota (GB)</Label>
            <Input id="peruser" type="number" value={perUserLimit} onChange={(e) => setPerUserLimit(e.target.value)} />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button onClick={() => toast.success("Storage limits saved")}>Save limits</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Programmatic access to the repository</CardDescription>
          </div>
          <Button size="sm" onClick={addKey}><Plus className="h-4 w-4 mr-1" /> New key</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">{k.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{k.key}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{k.created}</Badge>
                <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(k.key); toast.success("Copied"); }}><Copy className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => toast.success("Rotated")}><RotateCw className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => { setKeys((ks) => ks.filter((x) => x.id !== k.id)); toast.success("Revoked"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
