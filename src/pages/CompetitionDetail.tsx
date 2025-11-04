import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Clock, DollarSign, Download, Upload, MessageSquare } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CompetitionDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = () => {
    setIsJoined(true);
    toast({
      title: "Successfully Joined!",
      description: "You can now download the dataset and submit your predictions.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading Dataset...",
      description: "Your download will begin shortly.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-border py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">Featured</Badge>
                <Badge variant="default">Intermediate</Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                Ghana Crop Yield Prediction Challenge
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Predict crop yields across different regions using climate and soil data to help farmers optimize production.
              </p>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-secondary" />
                    <div className="text-2xl font-bold text-secondary">GH₵50,000</div>
                    <div className="text-sm text-muted-foreground">Prize Pool</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">432</div>
                    <div className="text-sm text-muted-foreground">Teams</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <div className="text-2xl font-bold text-accent">23</div>
                    <div className="text-sm text-muted-foreground">Days Left</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-muted-foreground">Submissions</div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4">
                {!isJoined ? (
                  <Button size="lg" onClick={handleJoin}>
                    Join Competition
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Dataset
                    </Button>
                    <Button size="lg" variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Predictions
                    </Button>
                  </>
                )}
                <Link to={`/competitions/${id}/leaderboard`}>
                  <Button size="lg" variant="outline">
                    <Trophy className="mr-2 h-4 w-4" />
                    View Leaderboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="overview" className="max-w-6xl">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                <TabsTrigger value="discussion">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Competition Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Challenge</h3>
                      <p className="text-muted-foreground">
                        Agriculture is a critical sector in Ghana's economy. This challenge aims to build 
                        predictive models that can forecast crop yields based on historical climate data, 
                        soil conditions, and farming practices. Your model will help farmers make better 
                        decisions about planting, resource allocation, and harvest planning.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Impact</h3>
                      <p className="text-muted-foreground">
                        Winning solutions will be implemented by the Ministry of Agriculture to support 
                        smallholder farmers across Ghana with data-driven recommendations.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Organized By</h3>
                      <p className="text-muted-foreground">Ministry of Agriculture, Ghana</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dataset Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      The dataset includes 10 years of agricultural data from all 16 regions of Ghana.
                    </p>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">Files</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>train.csv - Training data with yield outcomes</li>
                        <li>test.csv - Test data for predictions</li>
                        <li>sample_submission.csv - Sample submission format</li>
                        <li>climate_data.csv - Historical weather patterns</li>
                        <li>soil_data.csv - Soil composition by region</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Features</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Region, District, Farm ID</li>
                        <li>Crop type, Planting date, Harvest date</li>
                        <li>Rainfall, Temperature, Humidity</li>
                        <li>Soil pH, Nitrogen, Phosphorus, Potassium levels</li>
                        <li>Farm size, Fertilizer usage, Irrigation type</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Competition Rules</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Teams may have up to 5 members</li>
                      <li>Maximum 5 submissions per day</li>
                      <li>External data is allowed but must be documented</li>
                      <li>Code and methodology must be shared with winning submissions</li>
                      <li>Submissions must be made before the deadline</li>
                      <li>Winners will be required to present their solution</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evaluation" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Submissions are evaluated using Root Mean Squared Error (RMSE) between predicted 
                      and actual crop yields.
                    </p>
                    
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      RMSE = sqrt(mean((predicted - actual)²))
                    </div>

                    <p className="text-muted-foreground">
                      Lower RMSE values indicate better model performance. The leaderboard is updated 
                      in real-time based on a subset of the test data. Final rankings will be determined 
                      using the complete test set after the competition ends.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Discussion Forum</CardTitle>
                    <CardDescription>Connect with other participants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        Discuss strategies, ask questions, and collaborate with the community
                      </p>
                      <Link to="/discussions">
                        <Button>Go to Discussions</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CompetitionDetail;
