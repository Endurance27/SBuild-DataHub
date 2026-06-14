import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Permission = "read" | "write" | "delete" | "download";
type Role = "admin" | "moderator" | "user";

const ROLES: Role[] = ["admin", "moderator", "user"];
const PERMS: Permission[] = ["read", "write", "delete", "download"];

const AdminAccessControl = () => {
  const [matrix, setMatrix] = useState<Record<Role, Record<Permission, boolean>>>({
    admin: { read: true, write: true, delete: true, download: true },
    moderator: { read: true, write: true, delete: false, download: true },
    user: { read: true, write: false, delete: false, download: true },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("role_permissions").select("*");
      if (error) { toast.error(error.message); setLoading(false); return; }
      const next = { ...matrix };
      data?.forEach((r: any) => {
        if (ROLES.includes(r.role) && PERMS.includes(r.permission as Permission)) {
          next[r.role as Role][r.permission as Permission] = !!r.allowed;
        }
      });
      setMatrix(next);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (role: Role, perm: Permission) => {
    setMatrix((m) => ({ ...m, [role]: { ...m[role], [perm]: !m[role][perm] } }));
  };

  const save = async () => {
    setSaving(true);
    const rows = ROLES.flatMap((role) => PERMS.map((p) => ({ role, permission: p, allowed: matrix[role][p] })));
    const { error } = await supabase.from("role_permissions").upsert(rows, { onConflict: "role,permission" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Permissions saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Access Control</h1>
        <p className="text-muted-foreground">Configure permissions per role (persisted)</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Role Permissions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                {PERMS.map((p) => <TableHead key={p} className="text-center capitalize">{p}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROLES.map((role) => (
                <TableRow key={role}>
                  <TableCell className="font-medium capitalize">{role}</TableCell>
                  {PERMS.map((p) => (
                    <TableCell key={p} className="text-center">
                      <div className="flex justify-center">
                        <Switch checked={matrix[role][p]} onCheckedChange={() => toggle(role, p)} disabled={loading || role === "admin"} />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={save} disabled={saving || loading}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  );
};

export default AdminAccessControl;
