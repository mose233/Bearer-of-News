import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // ✅ Show loading while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking session...</p>
      </div>
    );
  }

  // ❌ Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → show page
  return <>{children}</>;
}
