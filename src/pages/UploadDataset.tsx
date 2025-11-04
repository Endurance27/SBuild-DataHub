import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, ArrowRight, ArrowLeft, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const UploadDataset = () => {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    toast({
      title: "Dataset Uploaded Successfully!",
      description: "Your dataset has been submitted for review.",
    });
    navigate("/datasets");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                    {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
                  </div>
                  <span className="ml-2 font-medium">Upload File</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-border">
                  <div className={`h-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-transparent'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                </div>
                <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                    {step > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
                  </div>
                  <span className="ml-2 font-medium">Add Details</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-border">
                  <div className={`h-full transition-all ${step >= 3 ? 'bg-primary' : 'bg-transparent'}`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
                </div>
                <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step >= 3 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                    {step > 3 ? <CheckCircle className="h-5 w-5" /> : "3"}
                  </div>
                  <span className="ml-2 font-medium">Review & Publish</span>
                </div>
              </div>
            </div>

            {/* Step 1: Upload File */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Dataset</CardTitle>
                  <CardDescription>Select a file from your computer (CSV, XLSX, JSON supported)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <Input
                      type="file"
                      accept=".csv,.xlsx,.json"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-lg font-medium mb-2">
                        {fileName || "Click to browse or drag and drop"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        CSV, XLSX, JSON (Max 100MB)
                      </div>
                    </Label>
                  </div>

                  {fileName && (
                    <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="flex-1 font-medium">{fileName}</span>
                      <Button size="sm" variant="ghost" onClick={() => setFileName("")}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)} disabled={!fileName}>
                      Next: Add Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Add Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Details</CardTitle>
                  <CardDescription>Provide information about your dataset</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Dataset Title *</Label>
                    <Input id="title" placeholder="Ghana Agriculture Yield Data 2024" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your dataset, its sources, and potential use cases..."
                      rows={5}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="economics">Economics</SelectItem>
                          <SelectItem value="environment">Environment</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license">License *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cc0">CC0: Public Domain</SelectItem>
                          <SelectItem value="ccby">CC BY 4.0</SelectItem>
                          <SelectItem value="ccbysa">CC BY-SA 4.0</SelectItem>
                          <SelectItem value="odc">ODC Open Database License</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="Add tag (press Enter)"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)}>
                      Next: Review
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review & Publish */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Publish</CardTitle>
                  <CardDescription>Confirm your dataset details before publishing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">File:</span>
                      <span className="font-medium">{fileName}</span>
                    </div>
                    <div className="p-4 border rounded-lg space-y-2">
                      <div className="font-medium">Preview</div>
                      <div className="text-sm text-muted-foreground">
                        Your dataset will be reviewed by our team before becoming publicly available.
                        You will receive a notification once it's approved.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleSubmit}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Publish Dataset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UploadDataset;
