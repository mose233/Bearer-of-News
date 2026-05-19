import React from "react";
import { Link } from "react-router-dom";

import AppLayout from "@/components/AppLayout";
import { AppProvider } from "@/contexts/AppContext";

const DevTools: React.FC = () => {
  if (import.meta.env.MODE !== "development") return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        zIndex: 999999,
      }}
    >
      <button
        onClick={() => alert("DEV CLICK WORKS")}
        style={{
          background: "red",
          color: "white",
          padding: "12px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        DEV CLICK
      </button>
    </div>
  );
};

const Index: React.FC = () => {
  const isDev = import.meta.env.MODE === "development";

  const redirectUrl = isDev
    ? "http://localhost:5173"
    : "https://newsapp.com/dashboard";

  const facebookOAuthUrl =
    `https://bjclqqynzsljskfeqfdj.supabase.co/auth/v1/authorize?provider=facebook&scopes=email,public_profile,pages_show_list,pages_read_engagement&redirect_to=${encodeURIComponent(
      redirectUrl
    )}`;

  return (
    <AppProvider>
      <div className="relative min-h-screen">
        <AppLayout />

        {/* CREATOR STUDIO CTA */}
        <div className="fixed left-4 bottom-24 z-[999998] sm:left-6 sm:bottom-6">
          <Link
            to="/creator-studio"
            className="block rounded-2xl border border-violet-400/30 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-4 text-white shadow-2xl transition hover:scale-105"
          >
            <div className="text-xs font-bold uppercase tracking-wider opacity-90">
              Creator Studio AI
            </div>

            <div className="mt-1 text-base font-extrabold sm:text-lg">
              🚀 Launch Creator Studio
            </div>

            <div className="mt-1 text-xs text-violet-100 sm:text-sm">
              Create Facebook-ready AI videos
            </div>
          </Link>
        </div>

        {/* FACEBOOK CONNECT BUTTON */}
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 999999,
          }}
        >
          <a
            href={facebookOAuthUrl}
            style={{
              display: "block",
              background: "#1877F2",
              color: "white",
              padding: "14px 20px",
              borderRadius: "12px",
              fontWeight: "bold",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
          >
            Connect with Facebook
          </a>
        </div>

        <DevTools />
      </div>
    </AppProvider>
  );
};

export default Index;
