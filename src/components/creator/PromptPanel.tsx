import { Sparkles } from "lucide-react";

import { CreatorContentType, creatorTemplates } from "@/lib/creator/templates";
import { Button } from "@/components/ui/button";

type PromptPanelProps = {
  videoPrompt: string;
  setVideoPrompt: (value: string) => void;
  contentType: CreatorContentType;
  setContentType: (value: CreatorContentType) => void;
  facebookCaption: string;
  setFacebookCaption: (value: string) => void;
  voiceText: string;
  setVoiceText: (value: string) => void;
  onGenerateScript: () => void;
};

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30";

const labelClass = "text-sm font-extrabold text-white";

export default function PromptPanel({
  videoPrompt,
  setVideoPrompt,
  contentType,
  setContentType,
  facebookCaption,
  setFacebookCaption,
  voiceText,
  setVoiceText,
  onGenerateScript,
}: PromptPanelProps) {
  return (
    <div className="space-y-5 text-white">
      <div className="space-y-2">
        <label className={labelClass}>Video Type</label>

        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value as CreatorContentType)}
          className={inputClass}
        >
          {Object.entries(creatorTemplates).map(([key, template]) => (
            <option key={key} value={key} className="bg-slate-950 text-white">
              {template.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Video Prompt</label>

        <textarea
          value={videoPrompt}
          onChange={(e) => setVideoPrompt(e.target.value)}
          placeholder="Example: Create a motivational video about never giving up..."
          className={`${inputClass} min-h-[115px] resize-y`}
        />

        <Button
          onClick={onGenerateScript}
          className="h-12 rounded-2xl bg-cyan-500 px-5 text-base font-extrabold text-white hover:bg-cyan-600"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Script
        </Button>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Social Caption</label>

        <textarea
          value={facebookCaption}
          onChange={(e) => setFacebookCaption(e.target.value)}
          placeholder="Caption for Facebook, Instagram, TikTok, or YouTube..."
          className={`${inputClass} min-h-[105px] resize-y`}
        />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Voiceover Script</label>

        <textarea
          value={voiceText}
          onChange={(e) => setVoiceText(e.target.value)}
          placeholder="Narration text..."
          className={`${inputClass} min-h-[115px] resize-y`}
        />
      </div>
    </div>
  );
}
