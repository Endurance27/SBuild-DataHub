import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";

import Explore from "./pages/Explore";
import Datasets from "./pages/Datasets";
import Competitions from "./pages/Competitions";
import CompetitionDetail from "./pages/CompetitionDetail";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import UploadDataset from "./pages/UploadDataset";
import Notebooks from "./pages/Notebooks";
import NotebookDetail from "./pages/NotebookDetail";
import Discussions from "./pages/Discussions";
import DatasetDetail from "./pages/DatasetDetail";
import NotFound from "./pages/NotFound";
import HostCompetition from "./pages/HostCompetition";
import CreateNotebook from "./pages/CreateNotebook";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminCompetitions from "./pages/admin/AdminCompetitions";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminSettings from "./pages/admin/AdminSettings";
import { AuthProvider } from "./hooks/use-auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/explore" element={<Explore />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/dataset/:id" element={<DatasetDetail />} />
            <Route path="/upload" element={<UploadDataset />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competition/:id" element={<CompetitionDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/notebooks" element={<Notebooks />} />
            <Route path="/notebooks/:id" element={<NotebookDetail />} />
            <Route path="/notebooks/create" element={<CreateNotebook />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/about" element={<About />} />
            <Route path="/host-competition" element={<HostCompetition />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="competitions" element={<AdminCompetitions />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="audit" element={<AdminAuditLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
