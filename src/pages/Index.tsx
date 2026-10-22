
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Facebook,
  Image as ImageIcon,
  MessageCircle,
  Music2,
  Rocket,
  Sparkles,
  Video,
} from "lucide-react";

import { AppProvider } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";

const media = {
  singer:
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85",
  musician:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
  city:
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85",
  studio:
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=700&q=85",
  concert:
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=700&q=85",
  microphone:
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=700&q=85",
  landscape:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=85",
  lion:
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=700&q=85",
};

const DevTools: React.FC = () => {
  if (import.meta.env.MODE !== "development") return null;

  return (
    <div className="fixed bottom-4 left-4 z-[999999]">
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

const startCreatingLink = "/creator-studio";

  const toolCards = [
    {
      title: "Picture AI",
      description: "Images, photos & designs",
      icon: ImageIcon,
      color: "from-pink-500 to-fuchsia-600",
      border: "border-fuchsia-500/80",
      images: [media.singer, media.lion, media.landscape, media.city],
      imageAlt: [
        "Creative portrait",
        "Wildlife image",
        "Landscape image",
        "City image",
      ],
    },
    {
      title: "Video AI",
      description: "Social videos",
      icon: Video,
      color: "from-violet-500 to-purple-700",
      border: "border-violet-500/80",
      images: [media.concert, media.city, media.musician, media.studio],
      imageAlt: [
        "Concert scene",
        "City scene",
        "Musician performing",
        "Creative studio",
      ],
    },
    {
      title: "Music AI",
      description: "Songs & audio",
      icon: Music2,
      color: "from-cyan-400 to-blue-600",
      border: "border-cyan-400/80",
      images: [media.singer, media.studio, media.microphone],
      imageAlt: ["Singer", "Music studio", "Studio microphone"],
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#030817] text-white">
      {/* Homepage header: Sign In and Sign Up buttons removed. */}
      <header className="relative z-20 border-b border-white/10 bg-[#030817]/95">
        <nav className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-4 lg:px-12">
          <Link
            to="/"
            aria-label="xnewsapp.com home"
            className="text-2xl font-black tracking-tight sm:text-3xl"
          >
            xnewsapp<span className="text-fuchsia-500">.com</span>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_30%,rgba(91,33,182,0.25),transparent_45%),radial-gradient(ellipse_at_90%_70%,rgba(8,145,178,0.14),transparent_40%)]" />

        <div className="mx-auto grid max-w-[1600px] items-start gap-4 px-5 pt-5 pb-2 sm:gap-8 sm:px-8 sm:pt-8 sm:pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-4 lg:px-12 lg:pt-8 lg:pb-5">
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/50 bg-violet-950/60 px-4 py-2 text-sm font-semibold text-violet-100 shadow-lg shadow-violet-950/40 sm:mb-6">
              <Sparkles className="h-4 w-4 text-fuchsia-300" />
              Bearer Of News AI Creator Studio
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-5xl xl:text-6xl">
              Your Imagination,
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                powered by an
              </span>
              <span className="block">all-in-one stage.</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
              Create stunning AI videos, images, voiceovers, music, and
              campaigns in minutes.
            </p>

            <div className="mt-5 sm:mt-8">
              <Link
                to={startCreatingLink}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 px-7 py-4 text-base font-extrabold shadow-[0_12px_45px_rgba(168,85,247,0.32)] transition hover:-translate-y-0.5 hover:brightness-110 sm:px-9 sm:text-lg"
              >
                <Rocket className="h-5 w-5" />
                Start Creating
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Cinematic artwork collage */}
          <div className="relative mx-auto mt-0 min-h-[290px] w-full max-w-2xl sm:min-h-[460px] lg:mt-0 lg:min-h-[530px]">
            <div className="pointer-events-none absolute inset-8 rounded-full bg-violet-600/30 blur-[90px]" />

            <div className="pointer-events-none absolute inset-x-8 top-1/3 h-40 rounded-full border-2 border-fuchsia-500/80 shadow-[0_0_35px_rgba(217,70,239,0.8)] [transform:perspective(500px)_rotateX(62deg)]" />

            <div className="absolute right-1 top-3 z-10 w-[48%] rotate-[6deg] overflow-hidden rounded-2xl border-2 border-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,0.5)] sm:right-4 sm:top-4">
              <img
                src={media.city}
                alt="City skyline creative image"
                className="h-32 w-full object-cover sm:h-48"
                loading="lazy"
              />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-slate-950/90 px-3 py-2 text-xs font-bold sm:text-sm">
                <ImageIcon className="h-4 w-4 text-orange-400" />
                AI Image
              </span>
            </div>

            <div className="absolute left-2 top-14 z-0 w-[53%] -rotate-[5deg] overflow-hidden rounded-2xl border-2 border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.55)] sm:left-5 sm:top-8">
              <img
                src={media.singer}
                alt="Singer in a creative music portrait"
                className="h-36 w-full object-cover sm:h-52"
                loading="lazy"
              />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-slate-950/90 px-3 py-2 text-xs font-bold sm:text-sm">
                <Music2 className="h-4 w-4 text-cyan-300" />
                AI Music
              </span>
            </div>

            <div className="absolute bottom-7 left-[13%] z-20 w-[75%] rotate-[1deg] overflow-hidden rounded-2xl border-2 border-fuchsia-400 shadow-[0_0_40px_rgba(217,70,239,0.55)] sm:bottom-8 sm:left-[12%]">
              <img
                src={media.musician}
                alt="Live music performance"
                className="h-48 w-full object-cover sm:h-64"
                loading="lazy"
              />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-slate-950/90 px-3 py-2 text-xs font-bold sm:text-sm">
                <Video className="h-4 w-4 text-fuchsia-300" />
                AI Video
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Tools */}
      <section className="relative mx-auto max-w-[1500px] px-5 pt-1 pb-5 sm:px-8 sm:pt-4 sm:pb-10 lg:px-12 lg:pt-2 lg:pb-8">
        <div className="pointer-events-none absolute inset-x-12 top-8 -z-10 h-48 rounded-full bg-violet-700/20 blur-[80px]" />

        <div className="mb-4 text-center sm:mb-6">
          <div className="mb-2 text-sm font-extrabold uppercase tracking-[0.2em] text-fuchsia-400 sm:mb-3">
            Creator Tools
          </div>

          <h2 className="text-3xl font-black italic leading-tight sm:text-4xl lg:text-5xl">
            Create Content That{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Stands Out
            </span>
          </h2>

          <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-slate-300 sm:mt-3 sm:text-base">
            Generate scenes, voice, music, captions, and MP4 exports from your
            phone or desktop.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
          {toolCards.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.title}
                to={startCreatingLink}
                className={`group overflow-hidden rounded-3xl border ${tool.border} bg-slate-950/80 p-3 shadow-[0_0_25px_rgba(76,29,149,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(168,85,247,0.2)] sm:p-4`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} shadow-lg`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-extrabold italic sm:text-2xl">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {tool.description}
                    </p>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-700/80 transition group-hover:bg-fuchsia-600">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>

                <div
                  className={`mt-3 grid gap-1.5 sm:mt-4 ${
                    tool.images.length === 3 ? "grid-cols-3" : "grid-cols-4"
                  }`}
                >
                  {tool.images.map((src, index) => (
                    <img
                      key={src}
                      src={src}
                      alt={tool.imageAlt[index]}
                      loading="lazy"
                      className="h-20 w-full rounded-xl object-cover sm:h-24"
                    />
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-400/30 bg-slate-950/80 px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] gap-8 md:grid-cols-[1.5fr_0.7fr_1fr]">
          <div>
            <h3 className="text-2xl font-extrabold">
              Bearer of <span className="text-fuchsia-500">News</span>
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
              AI Creator Studio for Facebook-ready videos, posts, campaigns,
              approvals, and publishing workflows.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-white">Legal</h4>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm text-slate-400">
              <Link to="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white">
                Terms of Service
              </Link>
              <Link to="/about" className="hover:text-white">
                About
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-white">Connect</h4>
            <a
              href="mailto:support@xnewsapp.com"
              className="mt-3 block break-words text-sm text-slate-300 hover:text-white"
            >
              support@xnewsapp.com
            </a>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-blue-600 p-3 transition hover:brightness-110"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>

              <a
                href="https://x.com/en_mose"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="rounded-full border border-white/20 bg-black p-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                X
              </a>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="rounded-full bg-emerald-500 p-3 transition hover:brightness-110"
              >
                <MessageCircle className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-[1500px] border-t border-white/10 pt-5 text-center text-xs text-slate-500">
          © 2024 Bearer of News. All rights reserved.
        </div>
      </footer>

      <DevTools />
    </main>
  );
};

const Index: React.FC = () => (
  <AppProvider>
    <HomeContent />
  </AppProvider>
);

export default Index;
