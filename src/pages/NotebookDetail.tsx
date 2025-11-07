import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageSquare, Eye, Download, Share2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotebookDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, this would fetch from API
  const notebook = {
    id: id || "1",
    title: "Exploratory Data Analysis - Ghana Agriculture",
    author: "Kwame Mensah",
    description: "Comprehensive EDA of Ghana's agricultural data with visualizations and statistical insights.",
    likes: 234,
    comments: 45,
    views: 3421,
    tags: ["EDA", "Agriculture", "Visualization"],
    language: "Python",
    featured: true,
    content: `# Ghana Agriculture Data Analysis

## Introduction
This notebook provides a comprehensive exploratory data analysis of Ghana's agricultural sector data.

## Data Loading
\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
df = pd.read_csv('ghana_agriculture.csv')
df.head()
\`\`\`

## Data Overview
- Total records: 10,000+
- Features: Crop type, yield, rainfall, temperature, soil type
- Time period: 2015-2023

## Key Findings
1. Maize production shows 15% increase over the period
2. Rainfall patterns correlate strongly with yield (r=0.78)
3. Temperature variations affect different crops differently
`,
  };

  const handleLike = () => {
    toast({
      title: "Liked!",
      description: "Added to your favorites",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading notebook",
      description: "Your download will start shortly",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link copied",
      description: "Notebook link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-6">
            <Link to="/notebooks">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Notebooks
              </Button>
            </Link>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{notebook.language}</Badge>
                    {notebook.featured && <Badge variant="default">Featured</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleLike}>
                      <Heart className="h-4 w-4 mr-2" />
                      {notebook.likes}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardTitle className="text-3xl mb-2">{notebook.title}</CardTitle>
                <p className="text-muted-foreground mb-4">by {notebook.author}</p>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {notebook.views} views
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {notebook.comments} comments
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {notebook.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg mb-6">{notebook.description}</p>
                  <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-6 rounded-lg">
                    {notebook.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comments ({notebook.comments})</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Comments will appear here
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotebookDetail;
