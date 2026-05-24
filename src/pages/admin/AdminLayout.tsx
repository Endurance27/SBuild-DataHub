import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Database,
  Upload,
  Users,
  ShieldCheck,
  BarChart3,
  ScrollText,
  Settings,
  Shield,
  LogOut,
  Home,
  Search,
  Bell,
  Trophy,
  BookOpen,
  MessageSquare,
  Award,
  Medal,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/datasets", label: "Datasets", icon: Database },
  { to: "/admin/uploads", label: "Data Uploads", icon: Upload },
  { to: "/admin/notebooks", label: "Notebooks", icon: BookOpen },
  { to: "/admin/competitions", label: "Competitions", icon: Trophy },
  { to: "/admin/discussions", label: "Discussions", icon: MessageSquare },
  { to: "/admin/leaderboard", label: "Leaderboard", icon: Award },
  { to: "/admin/badges", label: "Badges", icon: Medal },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/access", label: "Access Control", icon: ShieldCheck },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/logs", label: "Logs", icon: ScrollText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user || !isAdmin) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking permissions…
      </div>
    );
  }

  const displayEmail = user.email ?? "admin";
  const initials = displayEmail.slice(0, 2).toUpperCase();

  return (
    <div className="dark min-h-screen flex bg-slate-950 text-slate-100 font-mono">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-4 border-b border-slate-800">
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-tight">Admin Console</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-indigo-300/70">Control Panel</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium tracking-wide transition-colors border border-transparent",
                  isActive
                    ? "bg-indigo-500/15 text-indigo-200 border-indigo-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800/60" onClick={() => navigate("/")}>
            <Home className="h-4 w-4" /> Back to site
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800/60"
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur flex items-center gap-4 px-6">
          <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-indigo-300/70 mr-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            System Online
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search datasets, users, logs…"
              className="pl-9 bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-indigo-500/40"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-slate-800/60" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-fuchsia-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="text-sm">New dataset awaiting review</span>
                  <span className="text-xs text-muted-foreground">2 minutes ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="text-sm">Storage usage above 70%</span>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-slate-800/60 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-xs font-medium leading-tight text-slate-200">{displayEmail}</span>
                    <Badge variant="outline" className="text-[10px] h-4 px-1 mt-0.5 border-indigo-500/40 text-indigo-300">Admin</Badge>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="truncate">{displayEmail}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")}>
                  <Home className="h-4 w-4 mr-2" /> Back to site
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => { await signOut(); navigate("/"); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto font-sans">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
