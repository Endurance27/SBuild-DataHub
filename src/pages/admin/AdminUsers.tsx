import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

type Role = "admin" | "moderator" | "user";
interface ProfileRow {
  id: string;
  display_name: string | null;
  created_at: string;
  roles: Role[];
}
type ProfileRecord = Pick<ProfileRow, "id" | "display_name" | "created_at">;
type UserRoleRow = { user_id: string; role: Role };

const roleLabel = (roles: Role[]) =>
  roles.includes("admin") ? "Admin" : roles.includes("moderator") ? "Editor" : "Viewer";

const AdminUsers = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, created_at")
      .order("created_at", { ascending: false });
    const { data: roleRows } = await supabase.from("user_roles").select("user_id, role");
    const byUser: Record<string, Role[]> = {};
    ((roleRows ?? []) as UserRoleRow[]).forEach((r) => {
      byUser[r.user_id] = [...(byUser[r.user_id] ?? []), r.role];
    });
    setRows(((profiles ?? []) as ProfileRecord[]).map((p) => ({ ...p, roles: byUser[p.id] ?? [] })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setRole = async (uid: string, target: Role | "user") => {
    // Remove existing admin/moderator, then add target (unless 'user' which is none)
    await supabase.from("user_roles").delete().eq("user_id", uid).in("role", ["admin", "moderator"]);
    if (target !== "user") {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: target });
      if (error) return toast.error(error.message);
    }
    await supabase.from("audit_logs").insert({
      actor_id: user?.id,
      action: "set_role",
      target_type: "user",
      target_id: uid,
      metadata: { role: target },
    });
    toast.success("Role updated");
    load();
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = query.toLowerCase();
      const matchQ = !q || (r.display_name ?? "").toLowerCase().includes(q) || r.id.includes(q);
      const matchR =
        roleFilter === "all" ||
        (roleFilter === "admin" && r.roles.includes("admin")) ||
        (roleFilter === "moderator" && r.roles.includes("moderator")) ||
        (roleFilter === "user" && !r.roles.includes("admin") && !r.roles.includes("moderator"));
      return matchQ && matchR;
    });
  }, [rows, query, roleFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage accounts and roles</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users…" className="pl-9" />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as "all" | Role)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Editor</SelectItem>
            <SelectItem value="user">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No users found</TableCell></TableRow>
              ) : filtered.map((r) => {
                const role = roleLabel(r.roles);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.display_name ?? "—"}</TableCell>
                    <TableCell><Badge variant={role === "Admin" ? "default" : role === "Editor" ? "secondary" : "outline"}>{role}</Badge></TableCell>
                    <TableCell><Badge variant="outline">Active</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={r.roles.includes("admin") ? "admin" : r.roles.includes("moderator") ? "moderator" : "user"}
                        onValueChange={(v) => setRole(r.id, v as Role)}
                      >
                        <SelectTrigger className="w-32 ml-auto"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="moderator">Editor</SelectItem>
                          <SelectItem value="user">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
