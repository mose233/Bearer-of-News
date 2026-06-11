import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
  Trash2,
  Copy,
  Clock,
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
  sceneDurations?: number[];
  onDeleteScene?: (index: number) => void;
  onDuplicateScene?: (index: number) => void;
  onUpdateSceneDuration?: (index: number, duration: number) => void;
};

export default function PreviewPanel({
  mediaFiles,
  imagePreviews,
  currentIndex,
  setCurrentIndex,
  isPlaying,
  setIsPlaying,
  facebookCaption,
  sceneDurations = [],
  onDeleteScene,
  onDuplicateScene,
  onUpdateSceneDuration,
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
      <div className="flex min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-5 text-center text-creator-muted">
        <div className="mb-3 rounded-2xl bg-white/10 p-4">
          <ImageIcon className="h-9 w-9 text-creator-muted" />
        </div>

        <p className="text-sm font-bold text-creator-text">Preview</p>

        <p className="mt-2 max-w-xs text-xs leading-5 text-creator-muted">
          Generate or upload photos/videos to preview them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {imagePreviews.length > 0 && (
        <div className="mx-auto w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[300px]">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black p-1.5 shadow-creator">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-black">
              <img
                src={imagePreviews[currentIndex]?.preview}
                alt="preview"
                className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out animate-kenburns"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/15" />

              <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                {currentIndex + 1} / {imagePreviews.length}
              </div>

              {facebookCaption && (
                <div className="absolute bottom-12 left-2 right-2">
                  <div className="rounded-xl bg-black/45 px-2 py-2 backdrop-blur-md">
                    <p className="line-clamp-4 whitespace-pre-wrap text-[11px] font-semibold leading-4 text-white drop-shadow-lg">
                      {facebookCaption}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold text-creator-text">Timeline</h3>

          <span className="text-[11px] text-creator-muted">
            {mediaFiles.length} scene{mediaFiles.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {mediaFiles.map((file, index) => {
            const imageIndex = imagePreviews.findIndex(
              (item) => item.file === file
            );

            const isSelected = imageIndex === currentIndex;
            const duration = sceneDurations[index] || 5;

            return (
              <div
                key={`${file.name}-${index}`}
                className={`min-w-[130px] rounded-xl border p-2 text-left transition ${
                  isSelected
                    ? "border-creator-purple bg-creator-purple/20"
                    : "border-white/10 bg-black/20 hover:bg-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (imageIndex >= 0) {
                      setCurrentIndex(imageIndex);
                    }
                  }}
                  className="w-full text-left"
                >
                  <div className="mb-2 flex h-12 items-center justify-center rounded-lg bg-white/10">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-5 w-5 text-creator-blue" />
                    ) : (
                      <Video className="h-5 w-5 text-creator-purple" />
                    )}
                  </div>

                  <p className="truncate text-[11px] font-semibold text-creator-text">
                    Scene {index + 1}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-creator-muted">
                    {file.name}
                  </p>
                </button>

                <div className="mt-2 flex items-center gap-1 rounded-lg bg-black/25 px-2 py-1.5">
                  <Clock className="h-3.5 w-3.5 text-creator-muted" />

                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={duration}
                    onChange={(e) =>
                      onUpdateSceneDuration?.(index, Number(e.target.value))
                    }
                    className="w-full bg-transparent text-[11px] font-semibold text-creator-text outline-none"
                  />

                  <span className="text-[10px] text-creator-muted">s</span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDuplicateScene?.(index)}
                    className="flex h-8 items-center justify-center rounded-lg bg-white/10 text-[10px] font-semibold text-creator-text hover:bg-white/15"
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    Copy
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteScene?.(index)}
                    className="flex h-8 items-center justify-center rounded-lg bg-red-500/20 text-[10px] font-semibold text-red-200 hover:bg-red-500/30"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
