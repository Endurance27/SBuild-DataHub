import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Trophy,
  Megaphone,
  ScrollText,
  Settings,
  Shield,
  LogOut,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users & Roles", icon: Users },
  { to: "/admin/content", label: "Datasets & Notebooks", icon: FileText },
  { to: "/admin/competitions", label: "Competitions", icon: Trophy },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/audit", label: "Audit Logs", icon: ScrollText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    else if (!isAdmin) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking permissions...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/20">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="h-16 flex items-center gap-2 px-4 border-b border-border">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-sm">Admin Console</div>
            <div className="text-xs text-muted-foreground">SBuild DataHub</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => navigate("/")}>
            <Home className="h-4 w-4" /> Back to site
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
