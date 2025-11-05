import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleQuickDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Download Started",
      description: `Downloading ${title}...`,
    });

    // Simulate file download
    setTimeout(() => {
      const blob = new Blob(['Sample CSV Data'], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 1000);
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] group flex flex-col">
      <Link to={`/dataset/${id}`} className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-2">
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
      </Link>
      <CardFooter className="flex-col gap-3 pt-4">
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
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleQuickDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Quick Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatasetCard;
