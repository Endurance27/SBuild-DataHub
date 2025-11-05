import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trophy, Upload, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const HostCompetition = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    toast({
      title: "Competition Submitted!",
      description: "Your competition is under review and will be published soon.",
    });
    navigate("/competitions");
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
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Host a Competition</h1>
              <p className="text-lg text-muted-foreground">
                Create a data science challenge and engage the community
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-1">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                        step >= s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                      )}>
                        {s}
                      </div>
                      {s < 3 && (
                        <div className={cn(
                          "flex-1 h-0.5 mx-2 transition-colors",
                          step > s ? "bg-primary" : "bg-border"
                        )} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">Basic Info</span>
                  <span className="text-sm">Competition Details</span>
                  <span className="text-sm">Review & Publish</span>
                </div>
              </div>

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Tell us about your competition</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Competition Title*</Label>
                      <Input id="title" placeholder="e.g., Ghana Crop Yield Prediction Challenge" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization*</Label>
                      <Input id="organization" placeholder="Your organization name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description*</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe the problem, objectives, and expected outcomes..."
                        className="min-h-32"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category*</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="featured">Featured</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="getting-started">Getting Started</SelectItem>
                            <SelectItem value="community">Community</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty Level*</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => setStep(2)}>Next Step</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Competition Details */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Competition Details</CardTitle>
                    <CardDescription>Set timeline, prizes, and evaluation criteria</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date*</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>End Date*</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prize">Prize Pool*</Label>
                      <Input id="prize" placeholder="e.g., GH₵50,000" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="evaluation">Evaluation Metric*</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select metric" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rmse">RMSE</SelectItem>
                          <SelectItem value="accuracy">Accuracy</SelectItem>
                          <SelectItem value="f1">F1 Score</SelectItem>
                          <SelectItem value="auc">AUC-ROC</SelectItem>
                          <SelectItem value="mae">MAE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rules">Rules & Guidelines*</Label>
                      <Textarea 
                        id="rules" 
                        placeholder="Specify competition rules, submission requirements, and guidelines..."
                        className="min-h-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tags (e.g., Agriculture, ML)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        />
                        <Button onClick={addTag} variant="outline">Add</Button>
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

                    <div className="space-y-2">
                      <Label htmlFor="dataset">Competition Dataset</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">Upload training and test datasets</p>
                        <p className="text-xs text-muted-foreground">CSV, JSON, or ZIP files (max 500MB)</p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>Previous</Button>
                      <Button onClick={() => setStep(3)}>Next Step</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review & Publish */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Publish</CardTitle>
                    <CardDescription>Review your competition details before publishing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                        <h3 className="font-semibold text-lg">Competition Summary</h3>
                        <p className="text-sm text-muted-foreground">
                          Your competition has been configured and is ready to be published. Once published, participants can start joining and submitting solutions.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Timeline</p>
                            <p className="font-medium">
                              {startDate && endDate ? `${format(startDate, "PP")} - ${format(endDate, "PP")}` : "Not set"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Tags</p>
                            <p className="font-medium">{tags.length || 0} tags added</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Before Publishing</h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Ensure all required fields are filled</li>
                          <li>• Upload datasets and evaluation scripts</li>
                          <li>• Review prize distribution and timeline</li>
                          <li>• Verify rules and evaluation criteria</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(2)}>Previous</Button>
                      <Button onClick={handleSubmit}>Publish Competition</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HostCompetition;
