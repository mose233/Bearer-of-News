import React from "react";

type SmartCanvasPanelProps = {
  canvasText: string;
  setCanvasText: (value: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onCanvasImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPublishEditedDesignToFacebook: () => void;
  onDownloadCanvasImage: () => void;
  onAddCanvasToTimeline: () => void;
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
}: SmartCanvasPanelProps) {
  return (
    <div className="space-y-5">
      <p className="text-sm font-semibold leading-5 text-slate-300">
        Polish Your Generated AI Video or Photo for Free.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-slate-300">
            Upload image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={onCanvasImageUpload}
            className="w-full rounded-xl border border-white/10 bg-[#0B1020] p-3 text-sm text-slate-200"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-slate-300">
            Text overlay
          </span>
          <input
            value={canvasText}
            onChange={(e) => setCanvasText(e.target.value)}
            placeholder="Write text..."
            className="w-full rounded-xl border border-white/10 bg-[#0B1020] p-3 text-sm text-white outline-none focus:border-violet-400"
          />
        </label>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-slate-300">
          Quick templates
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => setCanvasText(template)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-violet-500/20 hover:text-white"
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold text-slate-300">
          Aspect ratio presets
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio}
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
        <canvas ref={canvasRef} className="h-auto w-full" />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <button
          type="button"
          onClick={onPublishEditedDesignToFacebook}
          className="h-12 w-full rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500"
        >
          Publish Edited Design to Facebook
        </button>

        <button
          type="button"
          onClick={onAddCanvasToTimeline}
          className="h-12 w-full rounded-2xl bg-violet-600 px-4 text-sm font-bold text-white hover:bg-violet-500"
        >
          Use Design in Video
        </button>

        <button
          type="button"
          onClick={onDownloadCanvasImage}
          className="h-12 w-full rounded-2xl bg-slate-700 px-4 text-sm font-bold text-white hover:bg-slate-600"
        >
          Download Design
        </button>
      </div>
    </div>
  );
}
