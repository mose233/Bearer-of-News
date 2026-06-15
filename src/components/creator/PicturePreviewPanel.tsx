import { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import type { ImagePreviewItem } from "@/lib/creator/videoExport";

type PicturePreviewPanelProps = {
  mediaFiles: File[];
  imagePreviews: ImagePreviewItem[];
  currentIndex: number;
  setCurrentIndex: (value: number | ((prev: number) => number)) => void;
  facebookCaption: string;
};

export default function PicturePreviewPanel({
  mediaFiles,
  imagePreviews,
  currentIndex,
  setCurrentIndex,
  facebookCaption,
}: PicturePreviewPanelProps) {
  const totalScenes = Math.max(mediaFiles.length, imagePreviews.length);

  const safeCurrentIndex =
    totalScenes > 0 ? Math.min(Math.max(currentIndex, 0), totalScenes - 1) : 0;

  const currentFile = mediaFiles[safeCurrentIndex] || mediaFiles[0];
  const currentPreview = imagePreviews[safeCurrentIndex];

  const previewUrl = useMemo(() => {
    if (currentPreview?.preview) return currentPreview.preview;
    if (!currentFile) return "";
    return URL.createObjectURL(currentFile);
  }, [currentFile, currentPreview?.preview]);

  const isCurrentVideo = currentFile?.type?.startsWith("video/");
  const isCurrentImage =
    currentFile?.type?.startsWith("image/") || Boolean(currentPreview?.preview);

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
          Generate or upload photos to preview them here.
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
              key={previewUrl}
              src={previewUrl}
              controls
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full rounded-xl bg-black object-contain"
            />
          ) : isCurrentImage && previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-slate-300">
              <Video className="mb-3 h-8 w-8" />
              <p className="text-xs font-bold">Preview not available</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

          <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
            {safeCurrentIndex + 1} / {totalScenes}
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
        </div>
      </div>
    </div>
  );
}
