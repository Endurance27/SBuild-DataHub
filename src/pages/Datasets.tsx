import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import DatasetCard from "@/components/DatasetCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Calendar } from "lucide-react";

const Datasets = () => {
  const datasets = [
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
    },
    {
      id: "5",
      title: "Agricultural Production Data",
      description: "Crop yields, farming practices, and agricultural production statistics across all regions of Ghana from 2015-2023.",
      tags: ["Agriculture", "Economics", "Environment"],
      downloads: 4532,
      uploadDate: "2024-02-10",
      fileSize: "18.7 MB"
    },
    {
      id: "6",
      title: "Transportation Network Dataset",
      description: "Road network data, public transport routes, and traffic patterns in major cities across Ghana.",
      tags: ["Transportation", "GIS", "Urban Planning"],
      downloads: 3891,
      uploadDate: "2024-03-01",
      fileSize: "32.4 MB"
    },
    {
      id: "7",
      title: "Climate & Weather Historical Data",
      description: "30 years of climate data including temperature, rainfall, humidity, and extreme weather events across all regions.",
      tags: ["Climate", "Environment", "Research"],
      downloads: 7234,
      uploadDate: "2024-02-28",
      fileSize: "156.3 MB"
    },
    {
      id: "8",
      title: "Mobile Money Transaction Patterns",
      description: "Anonymized mobile money transaction data showing financial inclusion trends and digital payment adoption.",
      tags: ["Finance", "Technology", "Economics"],
      downloads: 9876,
      uploadDate: "2024-03-10",
      fileSize: "78.9 MB"
    },
    {
      id: "9",
      title: "Real Estate Market Analysis",
      description: "Property prices, rental rates, and market trends across major cities in Ghana from 2018-2024.",
      tags: ["Real Estate", "Economics", "Urban"],
      downloads: 4123,
      uploadDate: "2024-01-22",
      fileSize: "15.6 MB"
    }
  ];

  const trendingTags = [
    "Demographics", "Economics", "Healthcare", "Education", "Agriculture",
    "Climate", "Finance", "Transportation", "GIS", "Technology"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-border py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h1 className="text-5xl font-bold mb-4">
                Discover Ghana's Open Data
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore over 10,000+ datasets from government agencies, researchers, and organizations
              </p>
              <SearchBar className="max-w-3xl mx-auto" />
            </div>

            {/* Trending Tags */}
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Trending Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">10,234</div>
                <div className="text-sm text-muted-foreground">Total Datasets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-1">2.5M+</div>
                <div className="text-sm text-muted-foreground">Total Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">1,842</div>
                <div className="text-sm text-muted-foreground">Contributors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">342</div>
                <div className="text-sm text-muted-foreground">Organizations</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <TabsList>
                  <TabsTrigger value="all">All Datasets</TabsTrigger>
                  <TabsTrigger value="trending">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="featured">
                    <Award className="h-4 w-4 mr-2" />
                    Featured
                  </TabsTrigger>
                  <TabsTrigger value="recent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Recent
                  </TabsTrigger>
                </TabsList>

                <div className="flex flex-wrap gap-4">
                  <Select defaultValue="popular">
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="downloads">Most Downloads</SelectItem>
                      <SelectItem value="discussed">Most Discussed</SelectItem>
                      <SelectItem value="votes">Highest Votes</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="demographics">Demographics</SelectItem>
                      <SelectItem value="economics">Economics & Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="climate">Climate & Environment</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="File Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{datasets.length}</span> of <span className="font-semibold text-foreground">10,234</span> datasets
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {datasets.map((dataset) => (
                    <DatasetCard key={dataset.id} {...dataset} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="mt-0">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Trending datasets in the last 7 days
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {datasets.slice(0, 6).map((dataset) => (
                    <DatasetCard key={dataset.id} {...dataset} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="featured" className="mt-0">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Datasets curated by our team for quality and impact
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {datasets.slice(0, 3).map((dataset) => (
                    <DatasetCard key={dataset.id} {...dataset} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-0">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Recently uploaded datasets
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {datasets.slice(0, 6).map((dataset) => (
                    <DatasetCard key={dataset.id} {...dataset} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2">
                <Button variant="outline" disabled>Previous</Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">...</Button>
                <Button variant="outline">10</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Datasets;
