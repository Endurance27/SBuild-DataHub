import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Search, TrendingUp, HelpCircle, Lightbulb, AlertCircle, Plus, MessageCircle } from "lucide-react";
import { useState } from "react";

const Discussions = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const discussions = [
    {
      id: "1",
      title: "Best practices for handling missing climate data",
      author: "Kwame Mensah",
      category: "Question",
      replies: 23,
      views: 456,
      lastActive: "2 hours ago",
      tags: ["data-cleaning", "preprocessing"],
      solved: true,
    },
    {
      id: "2",
      title: "Sharing my approach to feature engineering",
      author: "Ama Osei",
      category: "Discussion",
      replies: 18,
      views: 342,
      lastActive: "5 hours ago",
      tags: ["feature-engineering", "tips"],
      solved: false,
    },
    {
      id: "3",
      title: "How to improve RMSE score from 0.28 to 0.24?",
      author: "Kofi Addo",
      category: "Question",
      replies: 31,
      views: 678,
      lastActive: "1 day ago",
      tags: ["model-improvement", "competition"],
      solved: false,
    },
    {
      id: "4",
      title: "Ensemble methods: When to use stacking vs blending",
      author: "Abena Frimpong",
      category: "Discussion",
      replies: 15,
      views: 523,
      lastActive: "3 hours ago",
      tags: ["ensemble", "advanced"],
      solved: false,
    },
    {
      id: "5",
      title: "Dataset anomaly in test.csv - row 4523",
      author: "Yaw Boateng",
      category: "Issue",
      replies: 8,
      views: 234,
      lastActive: "12 hours ago",
      tags: ["dataset", "bug-report"],
      solved: true,
    },
    {
      id: "6",
      title: "Interesting insights from regional yield patterns",
      author: "Efua Asare",
      category: "Insight",
      replies: 12,
      views: 389,
      lastActive: "8 hours ago",
      tags: ["insights", "visualization"],
      solved: false,
    },
    {
      id: "7",
      title: "Cross-validation strategy for time series data",
      author: "Kwabena Owusu",
      category: "Question",
      replies: 27,
      views: 612,
      lastActive: "6 hours ago",
      tags: ["cross-validation", "time-series"],
      solved: true,
    },
    {
      id: "8",
      title: "Comparison of different deep learning architectures",
      author: "Akosua Mensah",
      category: "Discussion",
      replies: 19,
      views: 445,
      lastActive: "4 hours ago",
      tags: ["deep-learning", "comparison"],
      solved: false,
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Question":
        return <HelpCircle className="h-4 w-4" />;
      case "Discussion":
        return <MessageCircle className="h-4 w-4" />;
      case "Issue":
        return <AlertCircle className="h-4 w-4" />;
      case "Insight":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Question":
        return "default";
      case "Discussion":
        return "secondary";
      case "Issue":
        return "destructive";
      case "Insight":
        return "outline";
      default:
        return "default";
    }
  };

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
                  <MessageSquare className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-4">Community Discussions</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Connect with researchers, ask questions, and share insights with Ghana's data science community
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Start New Discussion
                </Button>
                <Button size="lg" variant="outline">
                  Browse Topics
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">1,247</div>
                <div className="text-sm text-muted-foreground">Total Discussions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-1">3.2K</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">8.5K</div>
                <div className="text-sm text-muted-foreground">Total Replies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">456</div>
                <div className="text-sm text-muted-foreground">Solved Questions</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions or tags..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="trending">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="unsolved">Unsolved</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6 space-y-4">
                  {filteredDiscussions.map((discussion) => (
                    <Card key={discussion.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{discussion.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getCategoryColor(discussion.category) as any} className="gap-1">
                                {getCategoryIcon(discussion.category)}
                                {discussion.category}
                              </Badge>
                              {discussion.solved && (
                                <Badge variant="outline" className="gap-1 border-green-500 text-green-600">
                                  ✓ Solved
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors mb-2">
                              {discussion.title}
                            </CardTitle>
                            <CardDescription>
                              Started by {discussion.author} • {discussion.lastActive}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {discussion.replies} replies
                            </div>
                            <div className="flex items-center gap-1">
                              {discussion.views} views
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="trending" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">Trending discussions will appear here</p>
                </TabsContent>

                <TabsContent value="questions" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">Question threads will appear here</p>
                </TabsContent>

                <TabsContent value="unsolved" className="mt-6">
                  <p className="text-center text-muted-foreground py-8">Unsolved questions will appear here</p>
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

export default Discussions;
