import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import DatasetCard from "@/components/DatasetCard";
import AIRecommendations from "@/components/AIRecommendations";
import AchievementSystem from "@/components/AchievementSystem";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Database, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-bg.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const fallbackDatasets = [
  { id: "1", title: "Ghana Population Census 2021", description: "Comprehensive demographic data from Ghana's 2021 national population census.", tags: ["Demographics", "Census", "Government"], downloads: 12543, uploadDate: "2024-01-15", fileSize: "45.2 MB" },
  { id: "2", title: "Ghana Economic Indicators", description: "Annual economic indicators including GDP, inflation rates, unemployment data.", tags: ["Economics", "Finance", "Statistics"], downloads: 8762, uploadDate: "2024-02-20", fileSize: "12.8 MB" },
  { id: "3", title: "Healthcare Facilities Database", description: "Complete listing of healthcare facilities across Ghana with location data.", tags: ["Healthcare", "GIS", "Public Services"], downloads: 5421, uploadDate: "2024-01-28", fileSize: "8.3 MB" },
  { id: "4", title: "Education Statistics 2023", description: "Educational metrics including enrollment rates, school infrastructure, and performance data.", tags: ["Education", "Statistics", "Development"], downloads: 6789, uploadDate: "2024-03-05", fileSize: "22.1 MB" },
];

const defaultHero = { title: "Open Data for a Smarter Ghana", subtitle: "Discover, share, and analyze datasets to drive innovation and research across Ghana", primary_cta: "Explore Datasets", primary_link: "/explore", secondary_cta: "Upload Dataset", secondary_link: "/upload" };
const defaultCta = { title: "Ready to Share Your Data?", subtitle: "Join Ghana's growing community of researchers, developers, and data enthusiasts", primary_cta: "Explore Datasets", primary_link: "/explore", secondary_cta: "Learn More", secondary_link: "/about" };

const Index = () => {
  const [hero, setHero] = useState<any>(defaultHero);
  const [cta, setCta] = useState<any>(defaultCta);
  const [featured, setFeatured] = useState<any[]>(fallbackDatasets);

  useEffect(() => {
    (async () => {
      const { data: content } = await supabase.from("site_content").select("key,value").in("key", ["homepage_hero", "homepage_cta"]);
      content?.forEach((c: any) => {
        if (c.key === "homepage_hero") setHero({ ...defaultHero, ...c.value });
        if (c.key === "homepage_cta") setCta({ ...defaultCta, ...c.value });
      });
      const { data: ds } = await supabase
        .from("datasets")
        .select("id,title,description,downloads,file_size_mb,created_at")
        .eq("status", "published")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (ds && ds.length > 0) {
        setFeatured(
          ds.map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description ?? "",
            tags: [],
            downloads: d.downloads ?? 0,
            uploadDate: (d.created_at ?? "").slice(0, 10),
            fileSize: d.file_size_mb ? `${d.file_size_mb} MB` : "—",
          })),
        );
      }
    })();
  }, []);

  const stats = [
    { icon: Database, label: "Datasets", value: "1,234" },
    { icon: Users, label: "Active Users", value: "5,678" },
    { icon: TrendingUp, label: "Downloads", value: "89K+" },
    { icon: Award, label: "Competitions", value: "23" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBackground})` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-primary-light/90" />
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">{hero.title}</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">{hero.subtitle}</p>

            <div className="max-w-2xl mx-auto"><SearchBar className="w-full" /></div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to={hero.primary_link}><Button size="lg" variant="secondary" className="text-base px-8">{hero.primary_cta}</Button></Link>
              <Link to={hero.secondary_link}><Button size="lg" variant="outline" className="text-base px-8 bg-white/10 text-white border-white/30 hover:bg-white/20">{hero.secondary_cta}</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="flex justify-center"><div className="p-3 bg-primary/10 rounded-lg"><stat.icon className="h-6 w-6 text-primary" /></div></div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Datasets</h2>
              <p className="text-muted-foreground">Popular and recently updated datasets</p>
            </div>
            <Link to="/explore"><Button variant="outline">View All</Button></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((dataset) => <DatasetCard key={dataset.id} {...dataset} />)}
          </div>
        </div>
      </section>

      <AIRecommendations />
      <AchievementSystem />

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">{cta.title}</h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">{cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to={cta.primary_link}><Button size="lg" variant="secondary" className="text-base px-8">{cta.primary_cta}</Button></Link>
            <Link to={cta.secondary_link}><Button size="lg" variant="outline" className="text-base px-8 bg-white/10 text-white border-white/30 hover:bg-white/20">{cta.secondary_cta}</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
