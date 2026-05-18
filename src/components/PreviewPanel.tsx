import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import type { ImagePreviewItem } from "@/lib/creator/videoExport";

type PreviewPanelProps = {
  mediaFiles: File[];
  imagePreviews: ImagePreviewItem[];
  currentIndex: number;
  setCurrentIndex: (value: number | ((prev: number) => number)) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  facebookCaption: string;
};

export default function PreviewPanel({
  mediaFiles,
  imagePreviews,
  currentIndex,
  setCurrentIndex,
  isPlaying,
  setIsPlaying,
  facebookCaption,
}: PreviewPanelProps) {
  const nextSlide = () => {
    if (imagePreviews.length === 0) return;

    setCurrentIndex((prev) =>
      prev === imagePreviews.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (imagePreviews.length === 0) return;

    setCurrentIndex((prev) =>
      prev === 0 ? imagePreviews.length - 1 : prev - 1
    );
  };

  if (mediaFiles.length === 0) {
    return (
      <div className="h-[420px] border rounded-xl flex flex-col items-center justify-center text-gray-400">
        <ImageIcon className="w-16 h-16 mb-4" />
        <p>Generated video will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {imagePreviews.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border bg-black">
          <div className="relative w-full h-[420px] overflow-hidden">
            <img
              src={imagePreviews[currentIndex]?.preview}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {facebookCaption && (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3">
                  <p className="text-white text-lg font-semibold leading-relaxed whitespace-pre-wrap drop-shadow-lg">
                    {facebookCaption}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={prevSlide}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {currentIndex + 1} / {imagePreviews.length}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-medium">Uploaded Files</h3>

        <div className="space-y-2 max-h-[160px] overflow-y-auto">
          {mediaFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 border rounded-lg p-2"
            >
              {file.type.startsWith("image/") ? (
                <ImageIcon className="w-5 h-5 text-blue-500" />
              ) : (
                <Video className="w-5 h-5 text-purple-500" />
              )}

              <div className="flex-1 overflow-hidden">
                <p className="text-sm truncate">{file.name}</p>

                <p className="text-xs text-gray-500">
                  {Math.round(file.size / 1024)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
