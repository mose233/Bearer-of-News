import { useState } from "react";
import { Image, Music, Sparkles, Video } from "lucide-react";

export type AiToolCategoryTitle =
  | "Picture AI"
  | "Video AI"
  | "Music AI";

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
    <div className="rounded-[1.5rem] border border-white/10 bg-[#111827] p-4 text-white shadow-creator sm:p-5">
      <div className="mb-5">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-100">
          <Sparkles className="h-4 w-4" />
          Creator Tools
        </div>

        <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Choose a creation tool
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Rest of component unchanged */}
      </div>
    </div>
  );
}
