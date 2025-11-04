import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Clock, DollarSign, TrendingUp, Award, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Competitions = () => {
  const activeCompetitions = [
    {
      id: "1",
      title: "Ghana Crop Yield Prediction Challenge",
      description: "Predict crop yields across different regions using climate and soil data to help farmers optimize production.",
      organization: "Ministry of Agriculture",
      prize: "GH₵50,000",
      participants: 432,
      daysLeft: 23,
      totalSubmissions: 1247,
      tags: ["Agriculture", "Machine Learning", "Regression"],
      difficulty: "Intermediate",
      category: "Featured"
    },
    {
      id: "2",
      title: "Healthcare Facility Optimization",
      description: "Optimize the distribution and staffing of healthcare facilities to improve accessibility across Ghana.",
      organization: "Ghana Health Service",
      prize: "GH₵30,000",
      participants: 287,
      daysLeft: 45,
      totalSubmissions: 856,
      tags: ["Healthcare", "Optimization", "GIS"],
      difficulty: "Advanced",
      category: "Featured"
    },
    {
      id: "3",
      title: "Traffic Pattern Analysis Accra",
      description: "Analyze traffic patterns in Accra to predict congestion and suggest optimal routes for commuters.",
      organization: "Urban Roads Department",
      prize: "GH₵20,000",
      participants: 156,
      daysLeft: 12,
      totalSubmissions: 423,
      tags: ["Transportation", "Time Series", "Prediction"],
      difficulty: "Beginner",
      category: "Getting Started"
    },
    {
      id: "4",
      title: "Education Dropout Prediction",
      description: "Build models to identify students at risk of dropping out and recommend intervention strategies.",
      organization: "Ghana Education Service",
      prize: "GH₵40,000",
      participants: 523,
      daysLeft: 34,
      totalSubmissions: 1689,
      tags: ["Education", "Classification", "Social Impact"],
      difficulty: "Intermediate",
      category: "Research"
    }
  ];

  const completedCompetitions = [
    {
      id: "5",
      title: "COVID-19 Impact Analysis",
      description: "Analyzed the economic and social impact of COVID-19 on different sectors in Ghana.",
      organization: "Ghana Statistical Service",
      winner: "DataMasters Team",
      participants: 678,
      completed: "2024-02-15",
      tags: ["Economics", "Healthcare", "Analysis"]
    },
    {
      id: "6",
      title: "Energy Consumption Forecasting",
      description: "Forecast energy demand across Ghana's regions to optimize power distribution.",
      organization: "Energy Commission",
      winner: "PowerPredictors",
      participants: 234,
      completed: "2024-01-28",
      tags: ["Energy", "Forecasting", "Infrastructure"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-border py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                  <Trophy className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-4">
                Data Science Competitions
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Compete with Ghana's best data scientists to solve real-world challenges and win prizes
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/competitions">
                  <Button size="lg">
                    Browse Competitions
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Host a Competition
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">127</div>
                <div className="text-sm text-muted-foreground">Total Competitions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-1">8.2K</div>
                <div className="text-sm text-muted-foreground">Active Participants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">GH₵2.5M</div>
                <div className="text-sm text-muted-foreground">Total Prize Money</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">12</div>
                <div className="text-sm text-muted-foreground">Active Now</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="active">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Active Competitions
                </TabsTrigger>
                <TabsTrigger value="completed">
                  <Award className="h-4 w-4 mr-2" />
                  Completed
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming
                </TabsTrigger>
              </TabsList>

              {/* Active Competitions */}
              <TabsContent value="active" className="mt-0">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{activeCompetitions.length}</span> active competitions
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeCompetitions.map((competition) => (
                    <Card key={competition.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{competition.category}</Badge>
                          <Badge variant={competition.difficulty === "Beginner" ? "default" : competition.difficulty === "Intermediate" ? "secondary" : "destructive"}>
                            {competition.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {competition.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {competition.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Organized by:</span>
                            <span className="ml-2">{competition.organization}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
                            <div className="text-center">
                              <div className="flex justify-center mb-1">
                                <DollarSign className="h-5 w-5 text-secondary" />
                              </div>
                              <div className="font-bold text-secondary">{competition.prize}</div>
                              <div className="text-xs text-muted-foreground">Prize</div>
                            </div>
                            <div className="text-center">
                              <div className="flex justify-center mb-1">
                                <Users className="h-5 w-5 text-primary" />
                              </div>
                              <div className="font-bold">{competition.participants}</div>
                              <div className="text-xs text-muted-foreground">Teams</div>
                            </div>
                            <div className="text-center">
                              <div className="flex justify-center mb-1">
                                <Clock className="h-5 w-5 text-accent" />
                              </div>
                              <div className="font-bold text-accent">{competition.daysLeft}d</div>
                              <div className="text-xs text-muted-foreground">Left</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {competition.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2">
                        <Link to={`/competition/${competition.id}`} className="flex-1">
                          <Button className="w-full">View Details</Button>
                        </Link>
                        <Button variant="outline">Leaderboard</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Completed Competitions */}
              <TabsContent value="completed" className="mt-0">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{completedCompetitions.length}</span> completed competitions
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {completedCompetitions.map((competition) => (
                    <Card key={competition.id} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">Completed</Badge>
                          <Badge variant="secondary">
                            <Trophy className="h-3 w-3 mr-1" />
                            Winner Announced
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">
                          {competition.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {competition.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Winner:</span>
                            <span className="font-semibold text-primary">{competition.winner}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Participants:</span>
                            <span className="font-medium">{competition.participants} teams</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Completed:</span>
                            <span className="font-medium">{competition.completed}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {competition.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2">
                        <Button variant="outline" className="flex-1">View Results</Button>
                        <Button variant="outline">Solutions</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Upcoming Competitions */}
              <TabsContent value="upcoming" className="mt-0">
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Upcoming Competitions</h3>
                  <p className="text-muted-foreground mb-6">
                    Check back soon for new challenges or host your own competition
                  </p>
                  <Button>Host a Competition</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Compete?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of data scientists solving real problems and making impact in Ghana
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/competitions/1">
                  <Button size="lg">Join Your First Competition</Button>
                </Link>
                <Button size="lg" variant="outline">Learn How It Works</Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Competitions;
