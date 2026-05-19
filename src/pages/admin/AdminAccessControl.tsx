import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";

type Permission = "read" | "write" | "delete" | "download";
type Role = "Admin" | "Editor" | "Viewer";

const initial: Record<Role, Record<Permission, boolean>> = {
  Admin: { read: true, write: true, delete: true, download: true },
  Editor: { read: true, write: true, delete: false, download: true },
  Viewer: { read: true, write: false, delete: false, download: true },
};

const AdminAccessControl = () => {
  const [matrix, setMatrix] = useState(initial);

  const toggle = (role: Role, perm: Permission) => {
    setMatrix((m) => ({ ...m, [role]: { ...m[role], [perm]: !m[role][perm] } }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Access Control</h1>
        <p className="text-muted-foreground">Configure permissions per role</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Role Permissions</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Read</TableHead>
                <TableHead className="text-center">Write</TableHead>
                <TableHead className="text-center">Delete</TableHead>
                <TableHead className="text-center">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(Object.keys(matrix) as Role[]).map((role) => (
                <TableRow key={role}>
                  <TableCell className="font-medium">{role}</TableCell>
                  {(["read", "write", "delete", "download"] as Permission[]).map((p) => (
                    <TableCell key={p} className="text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={matrix[role][p]}
                          onCheckedChange={() => toggle(role, p)}
                          disabled={role === "Admin"}
                        />
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
        <Button onClick={() => toast.success("Permissions saved")}>Save changes</Button>
      </div>
    </div>
  );
};

export default AdminAccessControl;
