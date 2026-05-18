import { Button } from "@/components/ui/button";

type AiImagesPanelProps = {
  aiImagePrompt: string;
  setAiImagePrompt: (value: string) => void;
  isGeneratingImage: boolean;
  generatedImagePreview: string;
  onGenerateImage: () => void;
  onAddGeneratedImage: () => void;
};

export default function AiImagesPanel({
  aiImagePrompt,
  setAiImagePrompt,
  isGeneratingImage,
  generatedImagePreview,
  onGenerateImage,
  onAddGeneratedImage,
}: AiImagesPanelProps) {
  return (
    <div className="space-y-3 border rounded-xl p-4">
      <div>
        <h3 className="font-semibold">AI Scene Image</h3>
        <p className="text-sm text-gray-500">
          Generate a visual scene from a prompt, then add it to your video.
        </p>
      </div>

      <textarea
        value={aiImagePrompt}
        onChange={(e) => setAiImagePrompt(e.target.value)}
        placeholder="Example: A cinematic scene of a young entrepreneur opening a shop in Nairobi..."
        className="w-full border rounded-lg p-3 min-h-[90px]"
      />

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={onGenerateImage}
          disabled={isGeneratingImage}
          className="bg-pink-600 hover:bg-pink-700"
        >
          {isGeneratingImage ? "Generating Image..." : "Generate AI Scene Image"}
        </Button>

        {generatedImagePreview && (
          <Button
            type="button"
            variant="secondary"
            onClick={onAddGeneratedImage}
          >
            Add Image to Video
          </Button>
        )}
      </div>

      {generatedImagePreview && (
        <div className="rounded-xl overflow-hidden border bg-black">
          <img
            src={generatedImagePreview}
            alt="Generated AI scene"
            className="w-full max-h-[320px] object-contain"
          />
        </div>
      )}
    </div>
  );
}
