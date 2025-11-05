import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileCode, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateNotebook = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notebook Created!",
      description: "Your notebook has been created successfully.",
    });
    navigate("/notebooks");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b border-border py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                  <FileCode className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Create New Notebook</h1>
              <p className="text-lg text-muted-foreground">
                Start coding and share your data science analysis with the community
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Notebook Details</CardTitle>
                  <CardDescription>Provide information about your notebook</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Notebook Title*</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g., Exploratory Data Analysis - Ghana Agriculture" 
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description*</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe what your notebook covers, the methods used, and key findings..."
                        className="min-h-32"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Programming Language*</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="r">R</SelectItem>
                            <SelectItem value="julia">Julia</SelectItem>
                            <SelectItem value="sql">SQL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="visibility">Visibility*</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="unlisted">Unlisted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataset">Associated Dataset (Optional)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Link to a dataset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Ghana Agriculture Dataset</SelectItem>
                          <SelectItem value="2">Climate Change Data</SelectItem>
                          <SelectItem value="3">Healthcare Statistics</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="competition">Associated Competition (Optional)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Link to a competition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Ghana Crop Yield Prediction</SelectItem>
                          <SelectItem value="2">Healthcare Facility Optimization</SelectItem>
                          <SelectItem value="3">Traffic Pattern Analysis</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tags (e.g., EDA, Visualization, ML)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} variant="outline">Add</Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="gap-1">
                              {tag}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                      <h3 className="font-semibold">Code Environment</h3>
                      <p className="text-sm text-muted-foreground">
                        Your notebook will be created with a pre-configured environment including popular libraries like pandas, numpy, scikit-learn, and visualization tools.
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline">Jupyter</Badge>
                        <Badge variant="outline">Python 3.11</Badge>
                        <Badge variant="outline">GPU Available</Badge>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => navigate("/notebooks")}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Notebook</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CreateNotebook;
