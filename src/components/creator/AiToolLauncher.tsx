import { useState } from "react";
import type { ElementType } from "react";
import { Image, Music, Sparkles, Video, Clapperboard } from "lucide-react";

export type AiToolCategoryTitle =
  | "Picture AI"
  | "Video AI"
  | "Music AI"
  | "Cinematic AI";

export type AiToolSelection = {
  category: AiToolCategoryTitle;
  tool: string;
};

type AiToolCategory = {
  title: AiToolCategoryTitle;
  description: string;
  icon: ElementType;
  accent: string;
  tools: string[];
};

type AiToolLauncherProps = {
  selectedTool: AiToolSelection | null;
  onSelectTool: (selection: AiToolSelection) => void;
};

const categories: AiToolCategory[] = [
  {
    title: "Picture AI",
    description: "Images, photos & designs",
    icon: Image,
    accent: "from-pink-500 to-fuchsia-600",
    tools: [
      "Photo Enhancer",
      "Background Changer",
      "Studio Portrait",
      "Hairstyle Changer",
      "Outfit Changer",
      "Scene Changer",
      "Facebook Post Image",
      "Instagram Post Image",
      "WhatsApp Status Image",
      "Poster / Flyer",
      "Event Poster",
      "Business Banner",
      "Product Ad Image",
      "Thumbnail Creator",
      "Beauty Glow",
      "Younger Look",
      "Text to Image",
      "AI Art Generator",
      "Quote Image Creator",
      "Meme Generator",
    ],
  },
  {
    title: "Video AI",
    description: "Social videos",
    icon: Video,
    accent: "from-violet-500 to-purple-600",
    tools: [
      "AI Greeting Video Studio",
      "Birthday Video",
      "Wedding Video",
      "Graduation Video",
      "Baby Shower Video",
      "Photo Music Video",
      "AI Music Video Studio",
      "Dance Animation",
      "WhatsApp Status Maker",
      "Facebook Reel Maker",
      "TikTok Video Maker",
      "Instagram Reel Maker",
      "YouTube Shorts Maker",
      "Business Promo Video",
      "Product Ad Generator",
      "Real Estate Video",
      "Event Promotion Video",
      "Obituary / Tribute Studio",
      "Funeral Program Video",
      "Church Announcement Video",
      "Bible Verse Video",
      "Crusade Promo Video",
      "Youth Service Promo Video",
      "Conference Promo Video",
      "Motivational Video",
      "Quote Video",
      "News Summary Video",
      "News Slideshow Video",
      "Educational Explainer Video",
      "Story Generator",
    ],
  },
  {
    title: "Music AI",
    description: "Songs & audio",
    icon: Music,
    accent: "from-cyan-500 to-blue-600",
    tools: [
      "AI Song Studio",
      "Birthday Song Creator",
      "Wedding Song Creator",
      "Love Song Creator",
      "Baby Dedication Song Creator",
      "Gospel Song Creator",
      "Praise & Worship Song Creator",
      "Bible Verse Song Creator",
      "Choir Song Creator",
      "Afrobeats Song Creator",
      "Amapiano Song Creator",
      "Bongo Flava Song Creator",
      "Hip Hop Song Creator",
      "Dancehall Song Creator",
      "Business Jingle Creator",
      "Political Campaign Song Creator",
      "School Anthem Creator",
      "Lyrics Generator",
      "Song Writer",
      "Background Music Generator",
      "Beat Generator",
    ],
  },
  {
    title: "Cinematic AI",
    description: "Premium motion",
    icon: Clapperboard,
    accent: "from-amber-500 to-orange-600",
    tools: [
      "Talking Avatar",
      "Singing Animation",
      
      "Lip Sync Video",
      
      "Photo to Video",
      "Image to Video",
      "AI News Presenter",
      "AI Spokesperson",
      "Virtual Influencer",
      "Story-to-Video Generator",
      "Short Film Generator",
      "Movie Scene Generator",
      "Trailer Generator",
      "Text to Video",
      "Wedding Cinematic Film",
      "Travel Cinematic Film",
      "Real Estate Cinematic Tour",
      "Product Commercial Generator",
      "Church Sermon Cinematic",
      "Motivational Cinematic Video",
      "Documentary Generator",
    ],
  },
];

export default function AiToolLauncher({
  selectedTool,
  onSelectTool,
}: AiToolLauncherProps) {
  const [openCategory, setOpenCategory] =
    useState<AiToolCategoryTitle | null>(null);

  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-[#111827] p-3 text-white shadow-creator sm:p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-1 text-[11px] font-bold text-violet-100">
            <Sparkles className="h-3.5 w-3.5" />
            Creator Tools
          </div>

          <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
            Choose a tool
          </h2>

          <p className="mt-1 text-xs font-medium text-slate-400">
            Pick what you want to create.
          </p>
        </div>

        {selectedTool && (
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-200">
            {selectedTool.category}: {selectedTool.tool}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isOpen = openCategory === category.title;
          const selectedInCategory =
            selectedTool?.category === category.title ? selectedTool.tool : "";

          return (
            <div
              key={category.title}
              className={`rounded-2xl border p-3 transition ${
                selectedInCategory
                  ? "border-violet-300/50 bg-violet-500/10"
                  : "border-white/10 bg-slate-950/50 hover:border-white/20 hover:bg-slate-950/80"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenCategory(isOpen ? null : category.title)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div className="min-w-0">
                  <div
                    className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r ${category.accent}`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>

                  <h3 className="text-sm font-extrabold text-white">
                    {category.title}
                  </h3>

                  <p className="mt-1 truncate text-[11px] font-medium leading-4 text-slate-300">
                    {selectedInCategory || category.description}
                  </p>
                </div>

                <span
                  className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="mt-3 max-h-[300px] space-y-1.5 overflow-y-auto pr-1">
                  {category.tools.map((tool) => {
                    const active =
                      selectedTool?.category === category.title &&
                      selectedTool?.tool === tool;

                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => {
                          onSelectTool({
                            category: category.title,
                            tool,
                          });

                          setOpenCategory(null);
                        }}
                        className={`w-full rounded-xl border px-3 py-2.5 text-left text-[11px] font-bold transition ${
                          active
                            ? "border-violet-300 bg-violet-500/25 text-white"
                            : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {tool}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
