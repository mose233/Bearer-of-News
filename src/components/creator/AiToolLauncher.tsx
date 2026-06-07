import { useState } from "react";
import { Image, Music, Sparkles, Video } from "lucide-react";

export type AiToolCategoryTitle = "Picture AI" | "Video AI" | "Music AI";

export type AiToolSelection = {
  category: AiToolCategoryTitle;
  tool: string;
};

type AiToolCategory = {
  title: AiToolCategoryTitle;
  description: string;
  icon: React.ElementType;
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
    description: "Generate & enhance images",
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
    description: "Create social videos",
    icon: Video,
    accent: "from-violet-500 to-purple-600",
    tools: [
      "Text to Video Studio",
      "Photo to Video",
      "Photo Music Video",
      "Talking Avatars",
      "AI News Presenter",
      "Product Ad Generator",
      "Dance Animation",
      "AI Music Video Studio",
      "Story Generator",
      "Birthday Video",
    ],
  },
  {
    title: "Music AI",
    description: "Generate songs & audio",
    icon: Music,
    accent: "from-cyan-500 to-blue-600",
    tools: ["AI Song Studio"],
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
      <div className="mb-4">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-1 text-[11px] font-bold text-violet-100">
          <Sparkles className="h-3.5 w-3.5" />
          Creator Tools
        </div>

        <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
          Choose a creation tool
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isOpen = openCategory === category.title;
          const selectedInCategory =
            selectedTool?.category === category.title ? selectedTool.tool : "";

          return (
            <div
              key={category.title}
              className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 transition hover:border-white/20 hover:bg-slate-950/80"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenCategory(isOpen ? null : category.title)
                }
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div>
                  <div
                    className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r ${category.accent}`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>

                  <h3 className="text-sm font-extrabold text-white">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-[11px] font-medium leading-4 text-slate-300">
                    {selectedInCategory || category.description}
                  </p>
                </div>

                <span
                  className={`mt-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-white transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="mt-3 space-y-1.5">
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
                        className={`w-full rounded-xl border px-3 py-2 text-left text-[11px] font-bold transition ${
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
