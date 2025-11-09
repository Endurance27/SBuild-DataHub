import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotebookCard from "@/components/NotebookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode, Search, TrendingUp, Award, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const Notebooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const tutorialsRef = useRef<HTMLDivElement>(null);

  const notebooks = [
    {
      id: "1",
      title: "Introduction to Machine Learning",
      author: "Dr. Kwame Mensah",
      description: "Complete beginner's guide to ML concepts, algorithms, and implementation from scratch.",
      likes: 567,
      comments: 89,
      views: 8921,
      tags: ["Tutorial", "Machine Learning", "Beginner"],
      language: "Python",
      votes: 234,
      featured: true,
    },
    {
      id: "2",
      title: "Deep Learning Fundamentals with PyTorch",
      author: "Ama Osei",
      description: "Step-by-step tutorial on neural networks, CNNs, and RNNs using PyTorch framework.",
      likes: 489,
      comments: 72,
      views: 7156,
      tags: ["Tutorial", "AI", "Deep Learning", "PyTorch"],
      language: "Python",
      votes: 198,
      featured: true,
    },
    {
      id: "3",
      title: "Data Science with Python - Complete Course",
      author: "Kofi Addo",
      description: "Comprehensive data science tutorial covering pandas, numpy, matplotlib, and scikit-learn.",
      likes: 723,
      comments: 156,
      views: 12876,
      tags: ["Tutorial", "Data Science", "Python"],
      language: "Python",
      votes: 312,
      featured: true,
    },
    {
      id: "4",
      title: "Natural Language Processing Tutorial",
      author: "Abena Frimpong",
      description: "Learn NLP from basics to advanced: tokenization, sentiment analysis, and transformers.",
      likes: 401,
      comments: 64,
      views: 5543,
      tags: ["Tutorial", "AI", "NLP", "Machine Learning"],
      language: "Python",
      votes: 187,
      featured: true,
    },
    {
      id: "5",
      title: "Computer Vision with TensorFlow",
      author: "Yaw Boateng",
      description: "Master image classification, object detection, and segmentation with hands-on projects.",
      likes: 534,
      comments: 98,
      views: 9654,
      tags: ["Tutorial", "AI", "Computer Vision", "TensorFlow"],
      language: "Python",
      votes: 267,
      featured: true,
    },
    {
      id: "6",
      title: "Statistical Learning for Data Science",
      author: "Efua Asare",
      description: "Essential statistics tutorial: hypothesis testing, regression, and probability theory.",
      likes: 298,
      comments: 45,
      views: 4432,
      tags: ["Tutorial", "Data Science", "Statistics"],
      language: "R",
      votes: 145,
      featured: false,
    },
    {
      id: "7",
      title: "Time Series Forecasting with ARIMA and LSTM",
      author: "Kwabena Owusu",
      description: "Complete guide to time series analysis using classical and deep learning methods.",
      likes: 376,
      comments: 58,
      views: 6234,
      tags: ["Tutorial", "Machine Learning", "Time Series"],
      language: "Python",
      votes: 189,
      featured: false,
    },
    {
      id: "8",
      title: "Reinforcement Learning Basics",
      author: "Akosua Sarpong",
      description: "Introduction to RL concepts: Q-learning, policy gradients, and practical applications.",
      likes: 445,
      comments: 71,
      views: 7821,
      tags: ["Tutorial", "AI", "Reinforcement Learning"],
      language: "Python",
      votes: 223,
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
                <Link to="/notebooks/create">
                  <Button size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Notebook
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    tutorialsRef.current?.scrollIntoView({ behavior: 'smooth' });
                    setSearchQuery("Tutorial");
                  }}
                >
                  Browse Tutorials
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12" ref={tutorialsRef}>
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
                      <NotebookCard key={notebook.id} notebook={notebook} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="featured" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredNotebooks.filter(n => n.featured).map((notebook) => (
                      <NotebookCard key={notebook.id} notebook={notebook} showBorder />
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
