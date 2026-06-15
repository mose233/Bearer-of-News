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
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
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
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoRealDuration, setVideoRealDuration] = useState(0);

  const totalScenes = Math.max(mediaFiles.length, imagePreviews.length);

  const safeCurrentIndex =
    totalScenes > 0 ? Math.min(Math.max(currentIndex, 0), totalScenes - 1) : 0;

  const selectedDuration = sceneDurations[safeCurrentIndex] || 10;

  const currentFile = mediaFiles[safeCurrentIndex] || mediaFiles[0];
  const currentPreview = imagePreviews[safeCurrentIndex];

  const previewUrl = useMemo(() => {
    if (currentFile) return URL.createObjectURL(currentFile);
    if (currentPreview?.preview) return currentPreview.preview;
    return "";
  }, [currentFile, currentPreview?.preview]);

  useEffect(() => {
    setVideoCurrentTime(0);
    setVideoRealDuration(0);

    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const isCurrentVideo = currentFile?.type?.startsWith("video/");
  const isCurrentImage =
    currentFile?.type?.startsWith("image/") || Boolean(currentPreview?.preview);

  const shouldAnimatePreview = previewMode !== "image" && isCurrentImage;
  const displayDuration = videoRealDuration || selectedDuration;
  const progressPercent =
    displayDuration > 0
      ? Math.min((videoCurrentTime / displayDuration) * 100, 100)
      : 0;

  const nextSlide = () => {
    if (totalScenes === 0) return;
    setCurrentIndex((prev) => (prev === totalScenes - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (totalScenes === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? totalScenes - 1 : prev - 1));
  };

  const toggleVideoPlayback = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
      return;
    }

    video.pause();
    setIsPlaying(false);
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
            <>
              <video
                ref={videoRef}
                key={previewUrl}
                src={previewUrl}
                controls
                autoPlay
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={(event) => {
                  const video = event.currentTarget;
                  setVideoRealDuration(video.duration || 0);
                  video.play().catch(() => {});
                }}
                onTimeUpdate={(event) => {
                  setVideoCurrentTime(event.currentTarget.currentTime || 0);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="absolute inset-0 h-full w-full rounded-xl bg-black object-contain"
              />

              <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                {safeCurrentIndex + 1} / {totalScenes}
              </div>

              <div className="absolute bottom-3 left-2 right-2 rounded-2xl bg-black/65 p-2 backdrop-blur">
                <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-white">
                  <span>{formatTime(videoCurrentTime)}</span>
                  <span>{formatTime(displayDuration)}</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/25">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={toggleVideoPlayback}
                  className="pointer-events-auto mt-2 flex h-8 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-extrabold text-black transition hover:scale-[1.02]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      Play
                    </>
                  )}
                </button>
              </div>
            </>
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
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/15" />

              <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                {safeCurrentIndex + 1} / {totalScenes}
              </div>
            </>
          )}

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
    </div>
  );
}
