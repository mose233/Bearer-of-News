import { ImagePlus, Images, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MultiScenePlan } from "@/lib/creator/multiSceneGenerator";

type AiImagesPanelProps = {
  aiImagePrompt: string;
  setAiImagePrompt: (value: string) => void;
  isGeneratingImage: boolean;
  generatedImagePreview: string;
  multiScenePlan?: MultiScenePlan[];
  onGenerateImage: () => void;
  onGenerateMultiScenePlan?: () => void;
  onAddGeneratedImage: () => void;
  onGenerateSceneFromPlan?: (index: number) => void;
  onGenerateAllScenesFromPlan?: () => void;
};

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30";

export default function AiImagesPanel({
  aiImagePrompt,
  setAiImagePrompt,
  isGeneratingImage,
  generatedImagePreview,
  multiScenePlan = [],
  onGenerateImage,
  onGenerateMultiScenePlan,
  onAddGeneratedImage,
  onGenerateSceneFromPlan,
  onGenerateAllScenesFromPlan,
}: AiImagesPanelProps) {
  const hasMultiScenePlan = multiScenePlan.length > 0;

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/40 p-4 text-white">
      <div>
        <h3 className="text-base font-extrabold text-white">
          AI Scene Generator
        </h3>

        <p className="mt-1 text-sm font-medium leading-6 text-slate-300">
          Generate one scene, or split your idea into a 4-scene video plan.
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
          className="h-12 rounded-2xl bg-pink-600 px-5 text-sm font-extrabold text-white hover:bg-pink-700 disabled:opacity-60"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {isGeneratingImage ? "Generating..." : "Generate 1 Scene"}
        </Button>

        <Button
          type="button"
          onClick={onGenerateMultiScenePlan}
          disabled={isGeneratingImage || !onGenerateMultiScenePlan}
          className="h-12 rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          <Images className="mr-2 h-5 w-5" />
          Generate 4-Scene Plan
        </Button>

        {hasMultiScenePlan && (
          <Button
            type="button"
            onClick={onGenerateAllScenesFromPlan}
            disabled={isGeneratingImage || !onGenerateAllScenesFromPlan}
            className="h-12 rounded-2xl bg-emerald-600 px-5 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            <ImagePlus className="mr-2 h-5 w-5" />
            Generate All Scenes
          </Button>
        )}
      </div>

      {hasMultiScenePlan && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {multiScenePlan.map((scene, index) => (
            <div
              key={`${scene.title}-${index}`}
              className="rounded-3xl border border-white/10 bg-black/40 p-4"
            >
              <div className="mb-3 inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs font-extrabold text-violet-100">
                Scene {index + 1} · {scene.duration}s
              </div>

              <h4 className="text-sm font-extrabold text-white">
                {scene.title}
              </h4>

              <p className="mt-2 line-clamp-4 text-xs font-medium leading-5 text-slate-300">
                {scene.prompt}
              </p>

              <Button
                type="button"
                onClick={() => onGenerateSceneFromPlan?.(index)}
                disabled={isGeneratingImage || !onGenerateSceneFromPlan}
                className="mt-4 h-10 w-full rounded-2xl bg-cyan-600 text-sm font-extrabold text-white hover:bg-cyan-700 disabled:opacity-60"
              >
                Generate Scene {index + 1}
              </Button>
            </div>
          ))}
        </div>
      )}

      {generatedImagePreview && !hasMultiScenePlan && (
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
