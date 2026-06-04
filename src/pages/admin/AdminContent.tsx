import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Eye } from "lucide-react";

type Bag = Record<string, any>;

const useSection = (key: string) => {
  const [value, setValue] = useState<Bag>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("value").eq("key", key).maybeSingle();
      setValue((data?.value as Bag) ?? {});
      setLoading(false);
    })();
  }, [key]);
  const save = async () => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value, updated_by: (await supabase.auth.getUser()).data.user?.id }, { onConflict: "key" });
    if (error) return toast.error(error.message);
    toast.success("Saved · live on site");
  };
  return { value, setValue, loading, save };
};

const AdminContent = () => {
  const hero = useSection("homepage_hero");
  const cta = useSection("homepage_cta");
  const banner = useSection("site_banner");
  const footer = useSection("footer_brand");

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Edit the public site — changes go live instantly</p>
        </div>
        <Button variant="outline" onClick={() => window.open("/", "_blank")}>
          <Eye className="h-4 w-4" /> Preview site
        </Button>
      </div>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="cta">CTA Section</TabsTrigger>
          <TabsTrigger value="banner">Banner</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Hero</CardTitle>
              <CardDescription>Top of the landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={hero.value.title ?? ""} onChange={(e) => hero.setValue({ ...hero.value, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Subtitle</Label>
                <Textarea value={hero.value.subtitle ?? ""} onChange={(e) => hero.setValue({ ...hero.value, subtitle: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Primary button label</Label>
                  <Input value={hero.value.primary_cta ?? ""} onChange={(e) => hero.setValue({ ...hero.value, primary_cta: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Primary button link</Label>
                  <Input value={hero.value.primary_link ?? ""} onChange={(e) => hero.setValue({ ...hero.value, primary_link: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Secondary button label</Label>
                  <Input value={hero.value.secondary_cta ?? ""} onChange={(e) => hero.setValue({ ...hero.value, secondary_cta: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Secondary button link</Label>
                  <Input value={hero.value.secondary_link ?? ""} onChange={(e) => hero.setValue({ ...hero.value, secondary_link: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end"><Button onClick={hero.save}><Save className="h-4 w-4" /> Save & publish</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader><CardTitle>CTA Section</CardTitle><CardDescription>Bottom call-to-action band</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5"><Label>Title</Label><Input value={cta.value.title ?? ""} onChange={(e) => cta.setValue({ ...cta.value, title: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Subtitle</Label><Textarea value={cta.value.subtitle ?? ""} onChange={(e) => cta.setValue({ ...cta.value, subtitle: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Primary label</Label><Input value={cta.value.primary_cta ?? ""} onChange={(e) => cta.setValue({ ...cta.value, primary_cta: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Primary link</Label><Input value={cta.value.primary_link ?? ""} onChange={(e) => cta.setValue({ ...cta.value, primary_link: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Secondary label</Label><Input value={cta.value.secondary_cta ?? ""} onChange={(e) => cta.setValue({ ...cta.value, secondary_cta: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Secondary link</Label><Input value={cta.value.secondary_link ?? ""} onChange={(e) => cta.setValue({ ...cta.value, secondary_link: e.target.value })} /></div>
              </div>
              <div className="flex justify-end"><Button onClick={cta.save}><Save className="h-4 w-4" /> Save & publish</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banner">
          <Card>
            <CardHeader><CardTitle>Site Banner</CardTitle><CardDescription>Announcement bar shown at the top of every page</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable banner</Label>
                <Switch checked={!!banner.value.enabled} onCheckedChange={(v) => banner.setValue({ ...banner.value, enabled: v })} />
              </div>
              <div className="space-y-1.5"><Label>Message</Label><Input value={banner.value.message ?? ""} onChange={(e) => banner.setValue({ ...banner.value, message: e.target.value })} placeholder="Scheduled maintenance Saturday 8 PM…" /></div>
              <div className="flex justify-end"><Button onClick={banner.save}><Save className="h-4 w-4" /> Save & publish</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardHeader><CardTitle>Footer</CardTitle><CardDescription>Brand name, tagline and contact</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5"><Label>Name</Label><Input value={footer.value.name ?? ""} onChange={(e) => footer.setValue({ ...footer.value, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Tagline</Label><Input value={footer.value.tagline ?? ""} onChange={(e) => footer.setValue({ ...footer.value, tagline: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Contact email</Label><Input value={footer.value.email ?? ""} onChange={(e) => footer.setValue({ ...footer.value, email: e.target.value })} /></div>
              <div className="flex justify-end"><Button onClick={footer.save}><Save className="h-4 w-4" /> Save & publish</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
