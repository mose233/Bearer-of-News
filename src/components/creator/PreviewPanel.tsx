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
      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/30 px-6 text-center text-creator-muted">
        <div className="mb-4 rounded-3xl bg-white/10 p-5">
          <ImageIcon className="h-12 w-12 text-creator-muted" />
        </div>

        <p className="text-base font-semibold text-creator-text">
          Your video preview will appear here
        </p>

        <p className="mt-2 max-w-xs text-sm leading-6 text-creator-muted">
          Generate AI scenes or upload images to start building a Facebook-ready
          vertical video.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {imagePreviews.length > 0 && (
        <div className="mx-auto w-full max-w-[340px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black p-2 shadow-creator">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[1.55rem] bg-black">
              <img
                src={imagePreviews[currentIndex]?.preview}
                alt="preview"
                className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out animate-kenburns"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />

              <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                Scene {currentIndex + 1} / {imagePreviews.length}
              </div>

              {facebookCaption && (
                <div className="absolute bottom-16 left-4 right-4">
                  <div className="rounded-2xl bg-black/45 px-3 py-3 backdrop-blur-md">
                    <p className="line-clamp-6 whitespace-pre-wrap text-sm font-semibold leading-5 text-white drop-shadow-lg">
                      {facebookCaption}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-creator-text">Timeline</h3>

          <span className="text-xs text-creator-muted">
            {mediaFiles.length} scene{mediaFiles.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {mediaFiles.map((file, index) => {
            const imageIndex = imagePreviews.findIndex(
              (item) => item.file === file
            );

            const isSelected = imageIndex === currentIndex;
            const duration = sceneDurations[index] || 5;

            return (
              <div
                key={`${file.name}-${index}`}
                className={`min-w-[160px] rounded-2xl border p-3 text-left transition ${
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
                  <div className="mb-3 flex h-16 items-center justify-center rounded-xl bg-white/10">
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-6 w-6 text-creator-blue" />
                    ) : (
                      <Video className="h-6 w-6 text-creator-purple" />
                    )}
                  </div>

                  <p className="truncate text-xs font-semibold text-creator-text">
                    Scene {index + 1}
                  </p>

                  <p className="mt-1 truncate text-[11px] text-creator-muted">
                    {file.name}
                  </p>
                </button>

                <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/25 px-2 py-2">
                  <Clock className="h-4 w-4 text-creator-muted" />

                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={duration}
                    onChange={(e) =>
                      onUpdateSceneDuration?.(index, Number(e.target.value))
                    }
                    className="w-full bg-transparent text-xs font-semibold text-creator-text outline-none"
                  />

                  <span className="text-[11px] text-creator-muted">sec</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onDuplicateScene?.(index)}
                    className="flex h-9 items-center justify-center rounded-xl bg-white/10 text-xs font-semibold text-creator-text hover:bg-white/15"
                  >
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Copy
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteScene?.(index)}
                    className="flex h-9 items-center justify-center rounded-xl bg-red-500/20 text-xs font-semibold text-red-200 hover:bg-red-500/30"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
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
