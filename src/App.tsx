import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import TeamManagement from "./pages/TeamManagement";
import ContentApproval from "./pages/ContentApproval";
import ContentReview from "./pages/ContentReview";
import ContentStudio from "./pages/ContentStudio";
import CreatorStudio from "./pages/CreatorStudio";
import Analytics from "./pages/Analytics";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Join from "./pages/Join";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* ✅ PUBLIC LANDING PAGE */}
                <Route path="/" element={<Index />} />

                {/* ✅ AUTH ROUTES */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* ✅ PUBLIC JOIN PAGE */}
                <Route path="/join" element={<Join />} />

                {/* ✅ PROTECTED ROUTES */}

                {/* Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Profile */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Team */}
                <Route
                  path="/team"
                  element={
                    <ProtectedRoute>
                      <TeamManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Content Approval */}
                <Route
                  path="/content"
                  element={
                    <ProtectedRoute>
                      <ContentApproval />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ CONTENT REVIEW PAGE */}
                <Route
                  path="/content-review/:id"
                  element={
                    <ProtectedRoute>
                      <ContentReview />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ NEW CREATOR STUDIO AI */}
                <Route
                  path="/creator-studio"
                  element={
                    <ProtectedRoute>
                      <CreatorStudio />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ KEEP OLD CONTENT STUDIO AS BACKUP */}
                <Route
                  path="/content-studio"
                  element={
                    <ProtectedRoute>
                      <ContentStudio />
                    </ProtectedRoute>
                  }
                />

                {/* Analytics */}
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />

                {/* ✅ PUBLIC INFO PAGES */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* ✅ 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
