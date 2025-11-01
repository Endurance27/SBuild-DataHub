import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import DatasetCard from "@/components/DatasetCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Explore = () => {
  // Sample datasets
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
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Search Header */}
        <section className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Explore Datasets</h1>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Browse through Ghana's largest collection of open datasets
            </p>
            <SearchBar className="max-w-3xl" />
          </div>
        </section>

        {/* Filters and Results */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <Select defaultValue="recent">
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="downloads">Most Downloads</SelectItem>
                  <SelectItem value="discussed">Most Discussed</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="demographics">Demographics</SelectItem>
                  <SelectItem value="economics">Economics</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
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
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="md:ml-auto">
                Reset Filters
              </Button>
            </div>

            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{datasets.length}</span> datasets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((dataset) => (
                <DatasetCard key={dataset.id} {...dataset} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2">
                <Button variant="outline" disabled>Previous</Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
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

export default Explore;
