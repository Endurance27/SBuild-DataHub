import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Database, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const Auth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") ?? "";
  const adminMode = redirect.startsWith("/admin");
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (redirect) navigate(redirect, { replace: true });
      else navigate(isAdmin ? "/admin" : "/", { replace: true });
    }
  }, [user, isAdmin, loading, redirect, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: displayName || email.split("@")[0] },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Check your email to confirm, then sign in.");
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4",
        adminMode ? "admin-scope dark bg-background font-mono" : "bg-muted/20"
      )}
    >
      <Card
        className={cn(
          "w-full max-w-md",
          adminMode && "bg-slate-900/60 border-slate-800 text-slate-100 shadow-2xl shadow-indigo-950/40"
        )}
      >
        <CardHeader className="text-center">
          <div
            className={cn(
              "mx-auto h-12 w-12 rounded-lg flex items-center justify-center mb-2",
              adminMode
                ? "bg-gradient-to-br from-indigo-500 to-fuchsia-600 shadow-lg shadow-indigo-500/30"
                : "bg-primary"
            )}
          >
            {adminMode ? (
              <Shield className="h-6 w-6 text-white" />
            ) : (
              <Database className="h-6 w-6 text-primary-foreground" />
            )}
          </div>
          <CardTitle className={cn(adminMode && "text-white tracking-tight")}>
            {adminMode ? "Admin Console" : "SBuild DataHub"}
          </CardTitle>
          <CardDescription className={cn(adminMode && "text-indigo-300/70 uppercase tracking-[0.2em] text-[10px]")}>
            {adminMode ? "Authorized personnel only" : "Sign in or create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adminMode ? (
            <form onSubmit={signIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-pw">Password</Label>
                <Input id="admin-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500" disabled={busy}>
                {busy ? "…" : "Sign in to Admin Console"}
              </Button>
            </form>
          ) : (
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-pw">Password</Label>
                  <Input id="si-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button
                  type="submit"
                  className={cn("w-full", adminMode && "bg-indigo-600 hover:bg-indigo-500")}
                  disabled={busy}
                >
                  {busy ? "…" : adminMode ? "Sign in to Admin Console" : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="su-name">Display name</Label>
                  <Input id="su-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-pw">Password</Label>
                  <Input id="su-pw" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button
                  type="submit"
                  className={cn("w-full", adminMode && "bg-indigo-600 hover:bg-indigo-500")}
                  disabled={busy}
                >
                  {busy ? "…" : "Create account"}
                </Button>
                <p className={cn("text-xs text-center", adminMode ? "text-slate-500" : "text-muted-foreground")}>
                  The first registered account automatically becomes the admin.
                </p>
              </form>
            </TabsContent>
          </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
