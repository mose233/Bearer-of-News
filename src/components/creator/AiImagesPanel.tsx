import { ImagePlus, Images, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GeneratedSceneImage } from "@/lib/creator/imageGeneration";

type AiImagesPanelProps = {
  aiImagePrompt: string;
  setAiImagePrompt: (value: string) => void;
  isGeneratingImage: boolean;
  generatedImagePreview: string;
  generatedScenes?: GeneratedSceneImage[];
  onGenerateImage: () => void;
  onGenerateMultipleImages?: () => void;
  onAddGeneratedImage: () => void;
  onAddGeneratedScene?: (index: number) => void;
  onAddAllGeneratedScenes?: () => void;
};

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30";

export default function AiImagesPanel({
  aiImagePrompt,
  setAiImagePrompt,
  isGeneratingImage,
  generatedImagePreview,
  generatedScenes = [],
  onGenerateImage,
  onGenerateMultipleImages,
  onAddGeneratedImage,
  onAddGeneratedScene,
  onAddAllGeneratedScenes,
}: AiImagesPanelProps) {
  const hasMultipleScenes = generatedScenes.length > 0;

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/40 p-4 text-white">
      <div>
        <h3 className="text-base font-extrabold text-white">AI Scene Generator</h3>

        <p className="mt-1 text-sm font-medium leading-6 text-slate-300">
          Generate one scene or create multiple mock scenes for your video timeline.
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
          onClick={onGenerateMultipleImages}
          disabled={isGeneratingImage || !onGenerateMultipleImages}
          className="h-12 rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          <Images className="mr-2 h-5 w-5" />
          {isGeneratingImage ? "Generating..." : "Generate 4 Scenes"}
        </Button>

        {generatedImagePreview && !hasMultipleScenes && (
          <Button
            type="button"
            onClick={onAddGeneratedImage}
            className="h-12 rounded-2xl bg-cyan-600 px-5 text-sm font-extrabold text-white hover:bg-cyan-700"
          >
            <ImagePlus className="mr-2 h-5 w-5" />
            Add Image to Video
          </Button>
        )}

        {hasMultipleScenes && (
          <Button
            type="button"
            onClick={onAddAllGeneratedScenes}
            disabled={!onAddAllGeneratedScenes}
            className="h-12 rounded-2xl bg-emerald-600 px-5 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            <ImagePlus className="mr-2 h-5 w-5" />
            Add All Scenes
          </Button>
        )}
      </div>

      {hasMultipleScenes ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {generatedScenes.map((scene, index) => (
            <div
              key={`${scene.title}-${index}`}
              className="rounded-3xl border border-white/10 bg-black p-3"
            >
              <img
                src={scene.previewUrl}
                alt={scene.title}
                className="h-56 w-full rounded-2xl object-cover"
              />

              <div className="mt-3">
                <p className="text-sm font-extrabold text-white">
                  {scene.title}
                </p>

                <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-300">
                  {scene.prompt}
                </p>
              </div>

              <Button
                type="button"
                onClick={() => onAddGeneratedScene?.(index)}
                disabled={!onAddGeneratedScene}
                className="mt-3 h-10 w-full rounded-2xl bg-cyan-600 text-sm font-extrabold text-white hover:bg-cyan-700 disabled:opacity-60"
              >
                Add Scene {index + 1}
              </Button>
            </div>
          ))}
        </div>
      ) : generatedImagePreview ? (
        <div className="rounded-3xl border border-white/10 bg-black p-3">
          <img
            src={generatedImagePreview}
            alt="Generated AI scene"
            className="mx-auto max-h-[360px] w-full rounded-2xl object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}
