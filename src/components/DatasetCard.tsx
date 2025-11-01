import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, Database } from "lucide-react";
import { Link } from "react-router-dom";

interface DatasetCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  downloads: number;
  uploadDate: string;
  fileSize: string;
}

const DatasetCard = ({ id, title, description, tags, downloads, uploadDate, fileSize }: DatasetCardProps) => {
  return (
    <Link to={`/dataset/${id}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] cursor-pointer group">
        <CardHeader>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{downloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>{fileSize}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{uploadDate}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DatasetCard;
