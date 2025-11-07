import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

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
  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        showBorder ? 'border-primary' : ''
      }`}
    >
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
