import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Facebook,
  Film,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { AppProvider } from "@/contexts/AppContext";

const DevTools: React.FC = () => {
  if (import.meta.env.MODE !== "development") return null;

  return (
    <div className="fixed left-5 top-5 z-[999999]">
      <button
        onClick={() => alert("DEV CLICK WORKS")}
        className="rounded-lg bg-red-600 px-4 py-3 font-bold text-white"
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
    : "https://xnewsapp.com/dashboard";

  const facebookOAuthUrl = `https://bjclqqynzsljskfeqfdj.supabase.co/auth/v1/authorize?provider=facebook&scopes=email,public_profile,pages_show_list,pages_read_engagement&redirect_to=${encodeURIComponent(
    redirectUrl
  )}`;

  return (
    <AppProvider>
      <main className="min-h-screen bg-[#0B1020] text-white">
        <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 py-10 sm:px-8 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm font-bold text-violet-100">
                <Sparkles className="h-4 w-4" />
                AI Creator Studio for Facebook Pages
              </div>

              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Create Facebook-ready AI videos, posts, and campaigns in minutes.
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-300 sm:text-lg">
                Create content, review it, connect your Facebook Page on Bearer
                of News, then post, share, or publish it.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/creator-studio"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 text-base font-extrabold text-white shadow-2xl transition hover:scale-[1.02]"
                >
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <a
                  href={facebookOAuthUrl}
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#1877F2] px-6 text-base font-extrabold text-white shadow-2xl transition hover:scale-[1.02]"
                >
                  <Facebook className="mr-2 h-5 w-5" />
                  Connect Facebook
                </a>

                <Link
                  to="/creator-studio"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 text-base font-extrabold text-white transition hover:bg-white/15"
                >
                  Open Video Creator
                </Link>
              </div>

              <div className="mt-8 grid gap-3 text-sm font-semibold text-slate-200 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  AI video creation
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  Facebook Page publishing
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  Team review and approval
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  Mobile-first MP4 export
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#111827] p-5 shadow-2xl">
              <div className="rounded-[1.5rem] bg-slate-950 p-4">
                <div className="aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-violet-700 via-slate-950 to-fuchsia-600 p-5">
                  <div className="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                    Creator Studio AI
                  </div>

                  <h2 className="text-2xl font-extrabold">
                    Facebook-ready video campaign
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-200">
                    Generate scenes, voice, music, captions, and MP4 exports
                    from your phone.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <Film className="mb-2 h-5 w-5 text-cyan-200" />
                      <p className="text-sm font-bold">AI video creator</p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-4">
                      <Users className="mb-2 h-5 w-5 text-violet-200" />
                      <p className="text-sm font-bold">Team approval flow</p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-4">
                      <ShieldCheck className="mb-2 h-5 w-5 text-amber-200" />
                      <p className="text-sm font-bold">Facebook-safe review</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-8 text-sm text-slate-400 md:grid-cols-3">
            <div>
              <h3 className="text-base font-extrabold text-white">
                Bearer of News
              </h3>

              <p className="mt-3 leading-7">
                AI Creator Studio for Facebook-ready videos, posts, campaigns,
                approvals, and publishing workflows.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-white">Legal</h4>

              <div className="mt-3 flex flex-col gap-3">
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>

                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>

                <Link to="/about" className="hover:text-white transition">
                  About
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-white">Connect</h4>

              <div className="mt-3 flex flex-col gap-3">
                <a
                  href="mailto:support@xnewsapp.com"
                  className="hover:text-white transition"
                >
                  support@xnewsapp.com
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  Facebook
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  X / Twitter
                </a>

                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-slate-500">
            © 2024 Bearer of News. All rights reserved.
          </div>
        </footer>

        <DevTools />
      </main>
    </AppProvider>
  );
};

export default Index;
