import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

const recommendations = [
  {
    id: "r1",
    title: "Ghana Agricultural Output 2023",
    reason: "Based on your interest in economic data",
    matchScore: 95,
    type: "dataset",
    tags: ["Agriculture", "Economics"],
    icon: TrendingUp,
  },
  {
    id: "r2",
    title: "NLP for Ghanaian Languages",
    reason: "Popular in your field of study",
    matchScore: 88,
    type: "notebook",
    tags: ["NLP", "Deep Learning"],
    icon: Star,
  },
  {
    id: "r3",
    title: "Climate Change Impact Analysis",
    reason: "Trending this week",
    matchScore: 82,
    type: "dataset",
    tags: ["Climate", "Environment"],
    icon: TrendingUp,
  },
  {
    id: "r4",
    title: "Time Series Forecasting Workshop",
    reason: "Recently viewed similar content",
    matchScore: 79,
    type: "notebook",
    tags: ["Time Series", "Forecasting"],
    icon: Clock,
  },
];

const AIRecommendations = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-secondary/20 rounded-lg">
            <Sparkles className="h-6 w-6 text-secondary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Recommended for You</h2>
        </div>
        <p className="text-muted-foreground mb-8">
          AI-powered suggestions based on your interests and activity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {recommendations.map((rec) => (
            <Link
              key={rec.id}
              to={rec.type === "dataset" ? `/dataset/${rec.id}` : `/notebooks/${rec.id}`}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 group cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge
                      variant={rec.type === "dataset" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {rec.type}
                    </Badge>
                    <span className="text-xs font-semibold text-primary">
                      {rec.matchScore}% match
                    </span>
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">
                    {rec.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <rec.icon className="h-3.5 w-3.5" />
                    <span>{rec.reason}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            View All Recommendations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;
