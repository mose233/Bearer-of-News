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
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">Video Type</label>

        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value as CreatorContentType)}
          className="w-full border rounded-lg p-3 bg-background"
        >
          {Object.entries(creatorTemplates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Video Prompt</label>

        <textarea
          value={videoPrompt}
          onChange={(e) => setVideoPrompt(e.target.value)}
          placeholder="Example: Create a motivational video about never giving up..."
          className="w-full border rounded-lg p-3 min-h-[120px]"
        />

        <Button
          onClick={onGenerateScript}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          Generate Script
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Social Caption</label>

        <textarea
          value={facebookCaption}
          onChange={(e) => setFacebookCaption(e.target.value)}
          placeholder="Caption for Facebook, Instagram, TikTok, or YouTube..."
          className="w-full border rounded-lg p-3 min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Voiceover Script</label>

        <textarea
          value={voiceText}
          onChange={(e) => setVoiceText(e.target.value)}
          placeholder="Narration text..."
          className="w-full border rounded-lg p-3 min-h-[120px]"
        />
      </div>
    </div>
  );
}
