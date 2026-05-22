import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Facebook,
  Film,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { AppProvider } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

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

const HomeContent: React.FC = () => {
  const { user } = useAuth();

  const startCreatingLink = user
    ? "/creator-studio"
    : "/signup?redirect=/creator-studio";

  return (
    <main className="min-h-screen bg-[#0B1020] text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm font-bold text-violet-100">
              <Sparkles className="h-4 w-4" />
              AI Creator Studio for Facebook Pages
            </div>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
  Create Viral AI Videos, Images, and Audio, Then Publish Directly on Your Facebook Page
</h1>

<p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-300 sm:text-lg">
  Generate Stunning AI Videos, Images, Voiceovers, Music, and Campaign them in Minutes
</p>

            <div className="mt-8">
              <Link
                to={startCreatingLink}
                className="inline-flex h-16 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-lg font-extrabold text-white shadow-[0_20px_60px_rgba(139,92,246,0.45)] transition hover:scale-105"
              >
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
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
              <Link to="/privacy" className="transition hover:text-white">
                Privacy Policy
              </Link>

              <Link to="/terms" className="transition hover:text-white">
                Terms of Service
              </Link>

              <Link to="/about" className="transition hover:text-white">
                About
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-white">Connect</h4>

            <a
              href="mailto:support@xnewsapp.com"
              className="mt-3 block transition hover:text-white"
            >
              support@xnewsapp.com
            </a>

            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-white/10 p-3 transition hover:bg-white/20"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>

              <a
                href="https://x.com/en_mose"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="rounded-full bg-white/10 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-white/20"
              >
                X
              </a>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="rounded-full bg-white/10 p-3 transition hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5 text-white" />
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
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  );
};

export default Index;
