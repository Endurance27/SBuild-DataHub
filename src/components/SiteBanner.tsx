import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone } from "lucide-react";

const SiteBanner = () => {
  const [banner, setBanner] = useState<{ enabled: boolean; message: string } | null>(null);
  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "site_banner").maybeSingle().then(({ data }) => {
      if (data?.value) setBanner(data.value as any);
    });
  }, []);
  if (!banner?.enabled || !banner.message) return null;
  return (
    <div className="bg-primary text-primary-foreground text-sm px-4 py-2 flex items-center justify-center gap-2">
      <Megaphone className="h-4 w-4" />
      <span>{banner.message}</span>
    </div>
  );
};

export default SiteBanner;
