import {
  Image,
  Music,
  Share2,
  Sparkles,
  Video,
} from "lucide-react";

type AiToolCategory = {
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  tools: string[];
};

const categories: AiToolCategory[] = [
  {
    title: "Picture AI",
    description: "Create, enhance, or transform images.",
    icon: Image,
    accent: "from-pink-500 to-fuchsia-600",
    tools: [
      "Photo Enhancer",
      "Studio Portrait",
      "Beauty Glow",
      "Younger Look",
      "Background Changer",
      "Product Ad Image",
      "Facebook Post Image",
      "Poster / Flyer",
    ],
  },
  {
    title: "Video AI",
    description: "Create motion content and social videos.",
    icon: Video,
    accent: "from-violet-500 to-purple-600",
    tools: [
      "Text to Video",
      "Photo Music Video",
      "Dancing Photo",
      "Business Promo",
      "AI News Video",
      "WhatsApp Status",
      "Birthday Video",
      "Romantic Reel",
      "Motivational Video",
    ],
  },
  {
    title: "Audio / Music AI",
    description: "Generate voice, narration, and music assets.",
    icon: Music,
    accent: "from-cyan-500 to-blue-600",
    tools: [
      "AI Voiceover",
      "Text to Speech",
      "Background Music",
      "Voice Changer",
      "Radio Ad Voice",
      "Narration Studio",
      "Jingle Creator",
      "Lyric Video",
    ],
  },
  {
    title: "Social / Publishing",
    description: "Prepare Facebook-ready captions and posts.",
    icon: Share2,
    accent: "from-emerald-500 to-teal-600",
    tools: [
      "Facebook Caption",
      "Post Creator",
      "Campaign Creator",
      "Ad Copy",
      "Headline Generator",
      "Hashtags",
      "Share to Facebook",
      "Publishing Workflow",
    ],
  },
];

export default function AiToolLauncher() {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#111827] p-4 text-white shadow-creator sm:p-5">
      <div className="mb-5">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-100">
          <Sparkles className="h-4 w-4" />
          Creator Tools
        </div>

        <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          What would you like to create today?
        </h2>

        <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-300">
          Choose a tool for pictures, videos, audio, or Facebook-ready
          publishing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <details
              key={category.title}
              className="group rounded-3xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-white/20 hover:bg-slate-950/80"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                <div>
                  <div
                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r ${category.accent}`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <h3 className="text-base font-extrabold text-white">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-300">
                    {category.description}
                  </p>
                </div>

                <span className="mt-1 rounded-full bg-white/10 px-2 py-1 text-xs font-bold text-white transition group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="mt-4 space-y-2">
                {category.tools.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
