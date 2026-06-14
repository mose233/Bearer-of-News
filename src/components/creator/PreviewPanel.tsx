import { useEffect, useMemo, useRef, useState } from "react";
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

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

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
}: PreviewPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [previewTime, setPreviewTime] = useState(0);

  const totalScenes = Math.max(mediaFiles.length, imagePreviews.length);

  const safeCurrentIndex =
    totalScenes > 0 ? Math.min(Math.max(currentIndex, 0), totalScenes - 1) : 0;

  const currentDuration = sceneDurations[safeCurrentIndex] || 10;
  const isFinished = previewTime >= currentDuration;

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

  useEffect(() => {
    setPreviewTime(0);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [previewUrl, safeCurrentIndex]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setPreviewTime((prev) => {
        if (prev + 1 >= currentDuration) {
          setIsPlaying(false);

          if (videoRef.current) {
            videoRef.current.pause();
          }

          return currentDuration;
        }

        return prev + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying, currentDuration, setIsPlaying]);

  const togglePreview = () => {
    if (isFinished) {
      setPreviewTime(0);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }

      setIsPlaying(true);

      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }

      return;
    }

    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);

    if (videoRef.current) {
      if (nextPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

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
              ref={videoRef}
              src={previewUrl}
              playsInline
              preload="metadata"
              className="h-full w-full rounded-xl bg-black object-contain"
              onTimeUpdate={(event) => {
                setPreviewTime(
                  Math.min(event.currentTarget.currentTime, currentDuration)
                );
              }}
              onEnded={() => {
                setIsPlaying(false);
                setPreviewTime(currentDuration);
              }}
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/15" />

          <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
            {safeCurrentIndex + 1} / {totalScenes}
          </div>

          <div className="absolute right-2 top-2 rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font-extrabold text-white shadow-lg">
            {isFinished ? "Finished" : `${currentDuration}s`}
          </div>

          {facebookCaption && !isCurrentVideo && (
            <div className="absolute bottom-14 left-2 right-2">
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

          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded-full bg-black/70 px-2 py-1.5 backdrop-blur">
            <button
              type="button"
              onClick={togglePreview}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-lg"
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
            </button>

            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: `${Math.min(
                    (previewTime / currentDuration) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="min-w-[66px] text-right text-[10px] font-bold text-white">
              {isFinished
                ? "Finished"
                : `${formatTime(previewTime)} / ${formatTime(
                    currentDuration
                  )}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
