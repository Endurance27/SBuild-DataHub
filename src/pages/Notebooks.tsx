import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, Search, Heart, MessageSquare, Eye, TrendingUp, Award, Plus } from "lucide-react";
import { useState } from "react";

const Notebooks = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const notebooks = [
    {
      id: "1",
      title: "Exploratory Data Analysis - Ghana Agriculture",
      author: "Kwame Mensah",
      description: "Comprehensive EDA of Ghana's agricultural data with visualizations and statistical insights.",
      likes: 234,
      comments: 45,
      views: 3421,
      tags: ["EDA", "Agriculture", "Visualization"],
      language: "Python",
      votes: 89,
      featured: true,
    },
    {
      id: "2",
      title: "XGBoost Model for Crop Yield Prediction",
      author: "Ama Osei",
      description: "Step-by-step implementation of XGBoost with hyperparameter tuning for crop yield forecasting.",
      likes: 189,
      comments: 32,
      views: 2156,
      tags: ["Machine Learning", "XGBoost", "Tutorial"],
      language: "Python",
      votes: 67,
      featured: true,
    },
    {
      id: "3",
      title: "Feature Engineering Techniques",
      author: "Kofi Addo",
      description: "Advanced feature engineering methods for improving model performance on agricultural datasets.",
      likes: 156,
      comments: 28,
      views: 1876,
      tags: ["Feature Engineering", "Best Practices"],
      language: "Python",
      votes: 54,
      featured: false,
    },
    {
      id: "4",
      title: "Time Series Analysis with LSTM",
      author: "Abena Frimpong",
      description: "Deep learning approach using LSTM networks for temporal patterns in climate data.",
      likes: 201,
      comments: 41,
      views: 2543,
      tags: ["Deep Learning", "LSTM", "Time Series"],
      language: "Python",
      votes: 72,
      featured: false,
    },
    {
      id: "5",
      title: "Ensemble Methods Comparison",
      author: "Yaw Boateng",
      description: "Comparing Random Forest, Gradient Boosting, and Stacking techniques for yield prediction.",
      likes: 143,
      comments: 24,
      views: 1654,
      tags: ["Ensemble", "Comparison", "Model Selection"],
      language: "R",
      votes: 48,
      featured: false,
    },
    {
      id: "6",
      title: "Data Cleaning Pipeline",
      author: "Efua Asare",
      description: "Robust data cleaning and preprocessing pipeline for handling missing values and outliers.",
      likes: 167,
      comments: 19,
      views: 1432,
      tags: ["Data Cleaning", "Preprocessing", "Pipeline"],
      language: "Python",
      votes: 61,
      featured: false,
    },
  ];

  const filteredNotebooks = notebooks.filter(notebook =>
    notebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notebook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notebook.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-border py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                  <FileCode className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-4">Code Notebooks</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore, learn, and share data science notebooks and analysis with the community
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Notebook
                </Button>
                <Button size="lg" variant="outline">
                  Browse Tutorials
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notebooks, authors, or tags..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Tabs defaultValue="popular" className="w-full">
                <TabsList>
                  <TabsTrigger value="popular">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Most Popular
                  </TabsTrigger>
                  <TabsTrigger value="featured">
                    <Award className="h-4 w-4 mr-2" />
                    Featured
                  </TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="votes">Most Voted</TabsTrigger>
                </TabsList>

                <TabsContent value="popular" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredNotebooks.map((notebook) => (
                      <Card key={notebook.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex gap-2">
                              <Badge variant="secondary">{notebook.language}</Badge>
                              {notebook.featured && <Badge variant="default">Featured</Badge>}
                            </div>
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {notebook.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {notebook.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">by {notebook.author}</span>
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {notebook.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {notebook.likes}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {notebook.comments}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {notebook.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>

                        <CardFooter className="flex gap-2">
                          <Button className="flex-1">View Notebook</Button>
                          <Button variant="outline">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="featured" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredNotebooks.filter(n => n.featured).map((notebook) => (
                      <Card key={notebook.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-primary">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex gap-2">
                              <Badge variant="secondary">{notebook.language}</Badge>
                              <Badge variant="default">Featured</Badge>
                            </div>
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {notebook.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {notebook.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">by {notebook.author}</span>
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {notebook.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {notebook.likes}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {notebook.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>

                        <CardFooter className="flex gap-2">
                          <Button className="flex-1">View Notebook</Button>
                          <Button variant="outline">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="recent" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">Recent notebooks will appear here</p>
                </TabsContent>

                <TabsContent value="votes" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">Most voted notebooks will appear here</p>
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

export default Notebooks;
