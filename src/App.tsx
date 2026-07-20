import { useAuth } from "@/contexts/AuthContext";
import LaunchingSoon from "./pages/LaunchingSoon";
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
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import Join from "./pages/Join";
import Download from "./pages/Download";
import FacebookCallback from "./pages/FacebookCallback";

const queryClient = new QueryClient();
const ADMIN_EMAIL = "enockmose743@gmail.com";
const App = () => {
const { user } = useAuth();

const isAdmin = user?.email === ADMIN_EMAIL;
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/join" element={<Join />} />

                <Route path="/facebook-callback" element={<FacebookCallback />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/team"
                  element={
                    <ProtectedRoute>
                      <TeamManagement />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/content"
                  element={
                    <ProtectedRoute>
                      <ContentApproval />
                    </ProtectedRoute>
                  }
                />

               <Route
  path="/creator-studio"
  element={
    <ProtectedRoute>
      <LaunchingSoon />
    </ProtectedRoute>
  }
/>
               <Route
  path="/content-studio"
  element={
    <ProtectedRoute>
      <LaunchingSoon />
    </ProtectedRoute>
  }
/>
                <Route path="/about" element={<About />} />
                <Route path="/download" element={<Download />} />

                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />

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
