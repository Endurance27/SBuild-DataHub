import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const AdminSettings = () => {
  const [allowSignups, setAllowSignups] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Platform-wide configuration</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Access</CardTitle>
          <CardDescription>Control how users join and use the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="signups">Allow new sign-ups</Label>
            <Switch id="signups" checked={allowSignups} onCheckedChange={(v) => { setAllowSignups(v); toast.success("Saved"); }} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="maint">Maintenance mode</Label>
            <Switch id="maint" checked={maintenance} onCheckedChange={(v) => { setMaintenance(v); toast.success("Saved"); }} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>SBuild DataHub Admin Console · v1.0</p>
          <p>For deeper backend changes (auth providers, secrets, database) use the Cloud dashboard.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
