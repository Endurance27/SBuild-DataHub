import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";


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
import AdminBadges from "./pages/admin/AdminBadges";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDatasets from "./pages/admin/AdminDatasets";
import AdminUploads from "./pages/admin/AdminUploads";
import AdminAccessControl from "./pages/admin/AdminAccessControl";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCompetitions from "./pages/admin/AdminCompetitions";
import AdminNotebooks from "./pages/admin/AdminNotebooks";
import AdminDiscussions from "./pages/admin/AdminDiscussions";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminLeaderboard from "./pages/admin/AdminLeaderboard";
import AdminContent from "./pages/admin/AdminContent";
import AdminOrganizations from "./pages/admin/AdminOrganizations";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminDatasetReviews from "./pages/admin/AdminDatasetReviews";
import AdminReports from "./pages/admin/AdminReports";

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
            <Route path="/auth" element={<Auth />} />

            
            
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
              <Route path="datasets" element={<AdminDatasets />} />
              <Route path="uploads" element={<AdminUploads />} />
              <Route path="notebooks" element={<AdminNotebooks />} />
              <Route path="competitions" element={<AdminCompetitions />} />
              <Route path="discussions" element={<AdminDiscussions />} />
              <Route path="leaderboard" element={<AdminLeaderboard />} />
              <Route path="badges" element={<AdminBadges />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="access" element={<AdminAccessControl />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="logs" element={<AdminAuditLogs />} />
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
