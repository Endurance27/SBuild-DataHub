import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

type Role = "admin" | "moderator" | "user";
interface ProfileRow {
  id: string;
  display_name: string | null;
  created_at: string;
  roles: Role[];
}

const AdminUsers = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, created_at")
      .order("created_at", { ascending: false });
    const { data: roleRows } = await supabase.from("user_roles").select("user_id, role");
    const byUser: Record<string, Role[]> = {};
    (roleRows ?? []).forEach((r: any) => {
      byUser[r.user_id] = [...(byUser[r.user_id] ?? []), r.role];
    });
    setRows((profiles ?? []).map((p: any) => ({ ...p, roles: byUser[p.id] ?? [] })));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRole = async (uid: string, role: Role, has: boolean) => {
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role });
      if (error) return toast.error(error.message);
    }
    await supabase.from("audit_logs").insert({
      actor_id: user?.id,
      action: has ? "revoke_role" : "grant_role",
      target_type: "user",
      target_id: uid,
      metadata: { role },
    });
    toast.success("Role updated");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users & Roles</h1>
        <p className="text-muted-foreground">Grant or revoke admin and moderator access</p>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No users yet</TableCell></TableRow>
            ) : rows.map((r) => {
              const isAdmin = r.roles.includes("admin");
              const isMod = r.roles.includes("moderator");
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.display_name ?? "—"}</TableCell>
                  <TableCell className="flex gap-1 flex-wrap">
                    {r.roles.length === 0 && <Badge variant="outline">user</Badge>}
                    {r.roles.map((role) => (
                      <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>{role}</Badge>
                    ))}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant={isAdmin ? "destructive" : "outline"} onClick={() => toggleRole(r.id, "admin", isAdmin)}>
                      {isAdmin ? "Revoke Admin" : "Make Admin"}
                    </Button>
                    <Button size="sm" variant={isMod ? "destructive" : "outline"} onClick={() => toggleRole(r.id, "moderator", isMod)}>
                      {isMod ? "Revoke Mod" : "Make Mod"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
