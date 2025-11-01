import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import DatasetCard from "@/components/DatasetCard";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Database, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-bg.jpg";

const Index = () => {
  // Sample featured datasets
  const featuredDatasets = [
    {
      id: "1",
      title: "Ghana Population Census 2021",
      description: "Comprehensive demographic data from Ghana's 2021 national population census, including age distribution, regional statistics, and household information.",
      tags: ["Demographics", "Census", "Government"],
      downloads: 12543,
      uploadDate: "2024-01-15",
      fileSize: "45.2 MB"
    },
    {
      id: "2",
      title: "Ghana Economic Indicators",
      description: "Annual economic indicators including GDP, inflation rates, unemployment data, and sector-wise growth statistics from 2010-2023.",
      tags: ["Economics", "Finance", "Statistics"],
      downloads: 8762,
      uploadDate: "2024-02-20",
      fileSize: "12.8 MB"
    },
    {
      id: "3",
      title: "Healthcare Facilities Database",
      description: "Complete listing of healthcare facilities across Ghana with location data, services offered, and capacity information.",
      tags: ["Healthcare", "GIS", "Public Services"],
      downloads: 5421,
      uploadDate: "2024-01-28",
      fileSize: "8.3 MB"
    },
    {
      id: "4",
      title: "Education Statistics 2023",
      description: "Educational metrics including enrollment rates, school infrastructure, teacher statistics, and performance data across all regions.",
      tags: ["Education", "Statistics", "Development"],
      downloads: 6789,
      uploadDate: "2024-03-05",
      fileSize: "22.1 MB"
    }
  ];

  const stats = [
    { icon: Database, label: "Datasets", value: "1,234" },
    { icon: Users, label: "Active Users", value: "5,678" },
    { icon: TrendingUp, label: "Downloads", value: "89K+" },
    { icon: Award, label: "Competitions", value: "23" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-primary-light/90" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
              Open Data for a Smarter Ghana
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Discover, share, and analyze datasets to drive innovation and research across Ghana
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar className="w-full" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/explore">
                <Button size="lg" variant="secondary" className="text-base px-8">
                  Explore Datasets
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="text-base px-8 bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Upload Dataset
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Datasets Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Datasets</h2>
              <p className="text-muted-foreground">Popular and recently updated datasets</p>
            </div>
            <Link to="/explore">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} {...dataset} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Share Your Data?</h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Join Ghana's growing community of researchers, developers, and data enthusiasts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Create Account
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-base px-8 bg-white/10 text-white border-white/30 hover:bg-white/20">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
