import { ImagePlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type AiImagesPanelProps = {
  aiImagePrompt: string;
  setAiImagePrompt: (value: string) => void;
  isGeneratingImage: boolean;
  generatedImagePreview: string;
  onGenerateImage: () => void;
  onAddGeneratedImage: () => void;
};

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30";

export default function AiImagesPanel({
  aiImagePrompt,
  setAiImagePrompt,
  isGeneratingImage,
  generatedImagePreview,
  onGenerateImage,
  onAddGeneratedImage,
}: AiImagesPanelProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/40 p-4 text-white">
      <div>
        <h3 className="text-base font-extrabold text-white">AI Scene Image</h3>

        <p className="mt-1 text-sm font-medium leading-6 text-slate-300">
          Generate a visual scene from a prompt, then add it to your video.
        </p>
      </div>

      <textarea
        value={aiImagePrompt}
        onChange={(e) => setAiImagePrompt(e.target.value)}
        placeholder="Example: A cinematic scene of a young entrepreneur opening a shop in Nairobi..."
        className={`${inputClass} min-h-[105px] resize-y`}
      />

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={onGenerateImage}
          disabled={isGeneratingImage}
          className="h-12 rounded-2xl bg-pink-600 px-5 text-base font-extrabold text-white hover:bg-pink-700 disabled:opacity-60"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {isGeneratingImage ? "Generating Image..." : "Generate AI Scene Image"}
        </Button>

        {generatedImagePreview && (
          <Button
            type="button"
            onClick={onAddGeneratedImage}
            className="h-12 rounded-2xl bg-violet-600 px-5 text-base font-extrabold text-white hover:bg-violet-700"
          >
            <ImagePlus className="mr-2 h-5 w-5" />
            Add Image to Video
          </Button>
        )}
      </div>

      {generatedImagePreview && (
        <div className="rounded-3xl border border-white/10 bg-black p-3">
          <img
            src={generatedImagePreview}
            alt="Generated AI scene"
            className="mx-auto max-h-[360px] w-full rounded-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
