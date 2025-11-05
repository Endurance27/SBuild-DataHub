import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar, Database, Users, ExternalLink, Share2, BookmarkPlus, FileText } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const DatasetDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your dataset is being prepared for download.",
    });
    
    // Simulate file download
    setTimeout(() => {
      const blob = new Blob(['Sample CSV Data'], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ghana-dataset.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 1000);
  };

  const dataset = {
    id: id || "1",
    title: "Ghana Population Census 2021",
    description: "Comprehensive demographic data from Ghana's 2021 national population census, including age distribution, regional statistics, and household information.",
    tags: ["Demographics", "Census", "Government"],
    downloads: 12543,
    uploadDate: "2024-01-15",
    fileSize: "45.2 MB",
    uploader: "Ghana Statistical Service",
    license: "Open Data Commons",
    columns: 24,
    rows: 458920,
    format: "CSV"
  };

  const sampleData = [
    { region: "Greater Accra", population: 5455692, households: 1236789, avg_age: 28.5 },
    { region: "Ashanti", population: 5792187, households: 1345672, avg_age: 27.8 },
    { region: "Northern", population: 2834567, households: 678234, avg_age: 26.2 },
    { region: "Eastern", population: 2987456, households: 712345, avg_age: 29.1 },
    { region: "Western", population: 2567234, households: 634567, avg_age: 28.9 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        <section className="bg-muted/30 border-b border-border py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Link to="/datasets" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
                ← Back to Datasets
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3">{dataset.title}</h1>
                  <p className="text-lg text-muted-foreground mb-4">{dataset.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{dataset.uploader}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{dataset.uploadDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="lg" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Dataset
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <BookmarkPlus className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dataset.downloads.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">File Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dataset.fileSize}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Rows</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dataset.rows.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Columns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dataset.columns}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="data" className="w-full">
                <TabsList>
                  <TabsTrigger value="data">Data Preview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="discussion">Discussion</TabsTrigger>
                </TabsList>

                <TabsContent value="data" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sample Data</CardTitle>
                      <CardDescription>First 5 rows of the dataset</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left p-3 font-medium">Region</th>
                              <th className="text-left p-3 font-medium">Population</th>
                              <th className="text-left p-3 font-medium">Households</th>
                              <th className="text-left p-3 font-medium">Avg Age</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sampleData.map((row, idx) => (
                              <tr key={idx} className="border-b border-border">
                                <td className="p-3">{row.region}</td>
                                <td className="p-3">{row.population.toLocaleString()}</td>
                                <td className="p-3">{row.households.toLocaleString()}</td>
                                <td className="p-3">{row.avg_age}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dataset Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">License</h3>
                        <p className="text-muted-foreground">{dataset.license}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Format</h3>
                        <p className="text-muted-foreground">{dataset.format}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground">{dataset.description}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Source</h3>
                        <p className="text-muted-foreground">{dataset.uploader}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="discussion" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Discussion</CardTitle>
                      <CardDescription>Join the conversation about this dataset</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center py-8">
                        No discussions yet. Be the first to start a conversation!
                      </p>
                      <div className="flex justify-center">
                        <Link to="/discussions">
                          <Button>Go to Discussions</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default DatasetDetail;
