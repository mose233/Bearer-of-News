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
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-violet-300/15 bg-[#061126] px-5 text-center text-slate-400 sm:min-h-[260px] lg:min-h-[300px]">
        <div className="mb-3 rounded-2xl border border-violet-300/15 bg-violet-500/10 p-4">
          <ImageIcon className="h-9 w-9 text-violet-300" />
        </div>
        <p className="text-sm font-bold text-white">Preview</p>
        <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
          Your generated content will appear here.
        </p>
      </div>
    );
  }

  const thumbnailItems = Array.from({ length: totalScenes }, (_, index) => ({
    index,
    file: mediaFiles[index],
    preview: imagePreviews[index],
    url: imagePreviews[index]?.preview || (mediaFiles[index] ? URL.createObjectURL(mediaFiles[index]) : ""),
  }));

  return (
    <div className="w-full min-w-0 space-y-2">
      <div className="relative overflow-hidden rounded-xl border border-blue-300/20 bg-[#061126] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] sm:p-2">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-black">
          {isCurrentVideo && previewUrl ? (
            <video
              key={previewUrl}
              src={previewUrl}
              controls
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full bg-black object-contain"
            />
          ) : isCurrentImage && previewUrl ? (
            <img src={previewUrl} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-slate-300">
              <Video className="mb-3 h-8 w-8 text-violet-300" />
              <p className="text-xs font-bold">Preview not available</p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
          <div className="absolute left-2 top-2 rounded-lg border border-white/10 bg-[#030817]/85 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
            {safeCurrentIndex + 1} / {totalScenes}
          </div>

          {facebookCaption && (
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
              <div className="rounded-lg border border-white/10 bg-black/55 px-2 py-1.5 backdrop-blur-md sm:px-3 sm:py-2">
                <p className="line-clamp-3 whitespace-pre-wrap text-[10px] font-semibold leading-4 text-white drop-shadow-lg sm:text-xs">
                  {facebookCaption}
                </p>
              </div>
            </div>
          )}

          {totalScenes > 1 && (
            <>
              <button type="button" aria-label="Previous preview" onClick={prevSlide} className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#030817]/75 text-white backdrop-blur transition hover:bg-violet-700/90">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Next preview" onClick={nextSlide} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#030817]/75 text-white backdrop-blur transition hover:bg-violet-700/90">
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {totalScenes > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {thumbnailItems.map(({ index, file, preview, url }) => {
            const isVideo = file?.type?.startsWith("video/");
            const isImage = file?.type?.startsWith("image/") || Boolean(preview?.preview);
            return (
              <button
                key={`${file?.name || "scene"}-${index}`}
                type="button"
                aria-label={`Show preview ${index + 1}`}
                aria-pressed={safeCurrentIndex === index}
                onClick={() => setCurrentIndex(index)}
                className={`relative h-[58px] w-[76px] shrink-0 overflow-hidden rounded-lg border-2 bg-[#071226] transition sm:h-[66px] sm:w-[92px] ${safeCurrentIndex === index ? "border-fuchsia-400 shadow-[0_0_0_1px_rgba(217,70,239,0.3)]" : "border-white/10 hover:border-violet-300/50"}`}
              >
                {isImage && url ? (
                  <img src={url} alt={`Scene ${index + 1}`} className="h-full w-full object-cover" />
                ) : isVideo && url ? (
                  <video src={url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-violet-300"><ImageIcon className="h-5 w-5" /></div>
                )}
                <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 text-[9px] font-bold text-white">{index + 1}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
