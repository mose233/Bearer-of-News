import React from "react";

type SmartCanvasPanelProps = {
  canvasText: string;
  setCanvasText: (value: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onCanvasImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPublishEditedDesignToFacebook: () => void;
  onDownloadCanvasImage: () => void;
  onAddCanvasToTimeline: () => void;
  hasCanvasContent?: boolean;
};

const templates = [
  "Breaking News",
  "Facebook Post",
  "WhatsApp Status",
  "Business Promo",
  "Birthday",
  "Church Announcement",
  "Product Ad",
  "Reporter Card",
];

const aspectRatios = [
  "1:1 Facebook Post",
  "9:16 Reels / Status",
  "16:9 YouTube",
  "4:5 Facebook Feed",
];

export default function SmartCanvasPanel({
  canvasText,
  setCanvasText,
  canvasRef,
  onCanvasImageUpload,
  onPublishEditedDesignToFacebook,
  onDownloadCanvasImage,
  onAddCanvasToTimeline,
  hasCanvasContent = false,
}: SmartCanvasPanelProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold leading-5 text-slate-300">
        Polish your generated AI video or photo for free.
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold text-slate-300">
            Upload image
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={onCanvasImageUpload}
            className="w-full rounded-xl border border-white/10 bg-[#0B1020] p-2 text-xs text-slate-200"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold text-slate-300">
            Text overlay
          </span>

          <input
            value={canvasText}
            onChange={(e) => setCanvasText(e.target.value)}
            placeholder="Write text..."
            className="w-full rounded-xl border border-white/10 bg-[#0B1020] p-2 text-xs text-white outline-none focus:border-violet-400"
          />
        </label>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-bold text-slate-300">
          Quick templates
        </p>

        <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => setCanvasText(template)}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-violet-500/20 hover:text-white"
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-bold text-slate-300">
          Aspect ratio presets
        </p>

        <div className="grid gap-1.5 sm:grid-cols-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio}
              type="button"
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-white/10"
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black p-2">
        {!hasCanvasContent && (
          <div className="mb-2 rounded-lg border border-dashed border-white/10 bg-[#0B1020] px-3 py-2 text-center">
            <h4 className="text-xs font-extrabold text-white">
              Your Design Preview Appears Here
            </h4>

            <p className="mt-1 text-[11px] text-slate-400">
              Upload an image or send generated AI content to Smart Canvas.
            </p>
          </div>
        )}

        <div className="overflow-hidden rounded-lg bg-[#111827]">
          <canvas ref={canvasRef} className="block h-auto w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5 md:grid-cols-3">
        <button
          type="button"
          onClick={onPublishEditedDesignToFacebook}
          className="min-h-10 w-full rounded-xl bg-blue-600 px-2.5 py-2 text-[11px] font-bold text-white hover:bg-blue-500"
        >
          Publish Edited Design to Facebook
        </button>

        <button
          type="button"
          onClick={onAddCanvasToTimeline}
          className="min-h-10 w-full rounded-xl bg-violet-600 px-2.5 py-2 text-[11px] font-bold text-white hover:bg-violet-500"
        >
          Use Design in Video
        </button>

        <button
          type="button"
          onClick={onDownloadCanvasImage}
          className="min-h-10 w-full rounded-xl bg-slate-700 px-2.5 py-2 text-[11px] font-bold text-white hover:bg-slate-600"
        >
          Download Design
        </button>
      </div>
    </div>
  );
}
