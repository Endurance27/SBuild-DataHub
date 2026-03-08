import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

import imgMl from "@/assets/notebook-ml.jpg";
import imgDl from "@/assets/notebook-dl.jpg";
import imgDs from "@/assets/notebook-ds.jpg";
import imgNlp from "@/assets/notebook-nlp.jpg";
import imgCv from "@/assets/notebook-cv.jpg";
import imgStats from "@/assets/notebook-stats.jpg";
import imgTimeseries from "@/assets/notebook-timeseries.jpg";
import imgRl from "@/assets/notebook-rl.jpg";

const imageMap: Record<string, string> = {
  "1": imgMl,
  "2": imgDl,
  "3": imgDs,
  "4": imgNlp,
  "5": imgCv,
  "6": imgStats,
  "7": imgTimeseries,
  "8": imgRl,
};

interface NotebookCardProps {
  notebook: {
    id: string;
    title: string;
    author: string;
    description: string;
    likes: number;
    comments: number;
    views: number;
    tags: string[];
    language: string;
    featured: boolean;
  };
  showBorder?: boolean;
}

const NotebookCard = ({ notebook, showBorder = false }: NotebookCardProps) => {
  const coverImage = imageMap[notebook.id] || imgMl;

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden ${
        showBorder ? 'border-primary' : ''
      }`}
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={coverImage}
          alt={notebook.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-2 left-3 flex gap-1.5">
          <Badge variant="secondary" className="text-[10px] backdrop-blur-sm bg-secondary/80">
            {notebook.language}
          </Badge>
          {notebook.featured && (
            <Badge variant="default" className="text-[10px] backdrop-blur-sm">Featured</Badge>
          )}
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
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
        <Link to={`/notebooks/${notebook.id}`} className="flex-1">
          <Button className="w-full">View Notebook</Button>
        </Link>
        <Button variant="outline">
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotebookCard;
