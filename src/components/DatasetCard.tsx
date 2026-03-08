import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import imgCensus from "@/assets/dataset-census.jpg";
import imgEconomics from "@/assets/dataset-economics.jpg";
import imgHealthcare from "@/assets/dataset-healthcare.jpg";
import imgEducation from "@/assets/dataset-education.jpg";
import imgAgriculture from "@/assets/dataset-agriculture.jpg";
import imgTransport from "@/assets/dataset-transport.jpg";
import imgClimate from "@/assets/dataset-climate.jpg";
import imgFintech from "@/assets/dataset-fintech.jpg";
import imgRealestate from "@/assets/dataset-realestate.jpg";

const imageMap: Record<string, string> = {
  "1": imgCensus,
  "2": imgEconomics,
  "3": imgHealthcare,
  "4": imgEducation,
  "5": imgAgriculture,
  "6": imgTransport,
  "7": imgClimate,
  "8": imgFintech,
  "9": imgRealestate,
};

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

  const coverImage = imageMap[id] || imgCensus;

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] group flex flex-col overflow-hidden">
      <Link to={`/dataset/${id}`} className="flex-1 flex flex-col">
        <div className="relative h-40 overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-2 left-3 flex gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] backdrop-blur-sm bg-secondary/80">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-2">
            {tags.slice(2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
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
