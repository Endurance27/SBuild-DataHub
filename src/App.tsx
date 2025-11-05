import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import Datasets from "./pages/Datasets";
import Competitions from "./pages/Competitions";
import CompetitionDetail from "./pages/CompetitionDetail";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import UploadDataset from "./pages/UploadDataset";
import Notebooks from "./pages/Notebooks";
import Discussions from "./pages/Discussions";
import DatasetDetail from "./pages/DatasetDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/dataset/:id" element={<DatasetDetail />} />
          <Route path="/upload" element={<UploadDataset />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/competition/:id" element={<CompetitionDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/notebooks" element={<Notebooks />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
