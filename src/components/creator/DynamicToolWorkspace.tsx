import {
  ImagePlus,
  Music,
  Share2,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiToolSelection } from "@/components/creator/AiToolLauncher";

type DynamicToolWorkspaceProps = {
  selectedTool: AiToolSelection | null;
};

const boxClass =
  "rounded-[1.5rem] border border-white/10 bg-[#111827] p-5 text-white shadow-creator";

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30";

export default function DynamicToolWorkspace({
  selectedTool,
}: DynamicToolWorkspaceProps) {
  if (!selectedTool) {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">Choose a tool to begin</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Select Picture AI, Video AI, Audio / Music AI, or Social / Publishing
          above to open the right workspace.
        </p>
      </div>
    );
  }

  const { category, tool } = selectedTool;

  if (category === "Picture AI") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <ImagePlus className="h-5 w-5 text-pink-300" />
          <h3 className="text-lg font-extrabold">{tool}</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Upload a photo and choose how you want Bearer of News to enhance it.
          Real AI enhancement will be connected later.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/60 px-5 py-8 text-center hover:border-pink-400/50">
            <Upload className="mb-3 h-7 w-7 text-pink-300" />
            <span className="text-sm font-extrabold">Upload Photo</span>
            <Input type="file" accept="image/*" className="hidden" />
          </label>

          <div className="space-y-2">
            <label className="text-sm font-extrabold">Enhancement Style</label>
            <select className={inputClass}>
              <option>Natural Enhancement</option>
              <option>Beauty Glow</option>
              <option>Premium Studio</option>
              <option>HD Sharp</option>
              <option>Younger Look</option>
              <option>Background Upgrade</option>
            </select>
          </div>
        </div>

        <Button className="mt-5 h-12 rounded-2xl bg-pink-600 px-5 font-extrabold text-white hover:bg-pink-700">
          <Wand2 className="mr-2 h-4 w-4" />
          Preview Enhancement
        </Button>
      </div>
    );
  }

  if (category === "Video AI") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">{tool}</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Create a video workflow from your selected style. Existing video tools
          below will continue supporting uploads, scenes, music, and exports.
        </p>

        <div className="mt-5 space-y-3">
          <textarea
            placeholder="Describe your video idea..."
            className={`${inputClass} min-h-[110px] resize-y`}
          />

          <select className={inputClass}>
            <option>Facebook Reel</option>
            <option>WhatsApp Status</option>
            <option>Business Promo</option>
            <option>AI News Video</option>
            <option>Birthday Video</option>
            <option>Romantic Reel</option>
          </select>
        </div>

        <Button className="mt-5 h-12 rounded-2xl bg-violet-600 px-5 font-extrabold text-white hover:bg-violet-700">
          <Sparkles className="mr-2 h-4 w-4" />
          Prepare Video Workflow
        </Button>
      </div>
    );
  }

  if (category === "Audio / Music AI") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-extrabold">{tool}</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Generate voice, narration, music direction, or audio assets for your
          creator workflow.
        </p>

        <div className="mt-5 space-y-3">
          <textarea
            placeholder="Type your voiceover script or audio idea..."
            className={`${inputClass} min-h-[110px] resize-y`}
          />

          <select className={inputClass}>
            <option>Warm Narrator</option>
            <option>News Anchor</option>
            <option>Business Advert</option>
            <option>Radio Promo</option>
            <option>Motivational Voice</option>
          </select>
        </div>

        <Button className="mt-5 h-12 rounded-2xl bg-cyan-600 px-5 font-extrabold text-white hover:bg-cyan-700">
          <Music className="mr-2 h-4 w-4" />
          Prepare Audio
        </Button>
      </div>
    );
  }

  return (
    <div className={boxClass}>
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-emerald-300" />
        <h3 className="text-lg font-extrabold">{tool}</h3>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-300">
        Prepare captions, post ideas, hashtags, and Facebook-ready publishing
        content.
      </p>

      <div className="mt-5 space-y-3">
        <textarea
          placeholder="What is your Facebook post or campaign about?"
          className={`${inputClass} min-h-[110px] resize-y`}
        />

        <select className={inputClass}>
          <option>Professional</option>
          <option>Funny</option>
          <option>Emotional</option>
          <option>Business</option>
          <option>Breaking News</option>
          <option>Motivational</option>
        </select>
      </div>

      <Button className="mt-5 h-12 rounded-2xl bg-emerald-600 px-5 font-extrabold text-white hover:bg-emerald-700">
        <Share2 className="mr-2 h-4 w-4" />
        Prepare Social Content
      </Button>
    </div>
  );
}
