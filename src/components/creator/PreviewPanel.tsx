import { useMemo } from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import type { ImagePreviewItem } from "@/lib/creator/videoExport";

type PreviewMode = "image" | "video" | "cinematic";

type PreviewPanelProps = {
  mediaFiles: File[];
  imagePreviews: ImagePreviewItem[];
  currentIndex: number;
  setCurrentIndex: (value: number | ((prev: number) => number)) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  facebookCaption: string;
  sceneDurations?: number[];
  previewMode?: PreviewMode;
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
  previewMode = "image",
  onUpdateSceneDuration,
}: PreviewPanelProps) {
  const totalScenes = Math.max(mediaFiles.length, imagePreviews.length);

  const safeCurrentIndex =
    totalScenes > 0 ? Math.min(Math.max(currentIndex, 0), totalScenes - 1) : 0;

  const currentDuration = sceneDurations[safeCurrentIndex] || 5;

  const currentPreview = imagePreviews[safeCurrentIndex];
  const currentFile =
    currentPreview?.file || mediaFiles[safeCurrentIndex] || mediaFiles[0];

  const previewUrl = useMemo(() => {
    if (currentPreview?.preview) return currentPreview.preview;
    if (!currentFile) return "";
    return URL.createObjectURL(currentFile);
  }, [currentFile, currentPreview?.preview]);

  const isCurrentVideo = currentFile?.type?.startsWith("video/");
  const isCurrentImage =
    currentFile?.type?.startsWith("image/") || Boolean(currentPreview?.preview);

  const shouldAnimatePreview = previewMode !== "image" && isCurrentImage;

  const nextSlide = () => {
    if (totalScenes === 0) return;
    setCurrentIndex((prev) => (prev === totalScenes - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (totalScenes === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? totalScenes - 1 : prev - 1));
  };

  if (mediaFiles.length === 0 && imagePreviews.length === 0) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-5 text-center text-creator-muted sm:min-h-[260px] lg:min-h-[300px]">
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
    <div className="mx-auto w-full max-w-[220px] sm:max-w-[260px] lg:max-w-[300px]">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black p-1.5 shadow-creator">
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-black">
          {isCurrentVideo && previewUrl ? (
            <video
              src={previewUrl}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full rounded-xl bg-black object-contain"
            />
          ) : isCurrentImage && previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${
                shouldAnimatePreview ? "animate-kenburns" : ""
              }`}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-slate-300">
              <Video className="mb-3 h-8 w-8" />
              <p className="text-xs font-bold">Preview not available</p>
            </div>
          )}

          {!isCurrentVideo && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/15" />
          )}

          <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
            {safeCurrentIndex + 1} / {totalScenes}
          </div>

          <div className="absolute right-2 top-2 rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font-extrabold text-white shadow-lg">
            {currentDuration}s
          </div>

          {facebookCaption && !isCurrentVideo && (
            <div className="absolute bottom-12 left-2 right-2">
              <div className="rounded-xl bg-black/45 px-2 py-2 backdrop-blur-md">
                <p className="line-clamp-4 whitespace-pre-wrap text-[11px] font-semibold leading-4 text-white drop-shadow-lg">
                  {facebookCaption}
                </p>
              </div>
            </div>
          )}

          {totalScenes > 1 && (
            <>
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
            </>
          )}

          {!isCurrentVideo && (
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
          )}
        </div>
      </div>

      {onUpdateSceneDuration && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3">
          <label className="block text-xs font-extrabold text-white">
            Scene Duration
          </label>

          <select
            value={currentDuration}
            onChange={(event) =>
              onUpdateSceneDuration(
                safeCurrentIndex,
                Number(event.target.value)
              )
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white"
          >
            {[10, 20, 30, 40, 50, 60].map((duration) => (
              <option key={duration} value={duration}>
                {duration} Seconds
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
