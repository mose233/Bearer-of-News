import {
  Download,
  Facebook,
  Film,
  Loader2,
  Settings2,
  Volume2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ExportPanelProps = {
  isRecording: boolean;
  isExporting: boolean;
  exportStatus?: string;
  exportPrimaryLabel: string;
  onExportPrimary: () => void;
  onOpenFacebook: () => void;
  onInitializeFFmpeg: () => void;
  onExportSilentMp4: () => void;
  onExportNarratedMp4: () => void;
};

export default function ExportPanel({
  isRecording,
  isExporting,
  exportStatus = "",
  exportPrimaryLabel,
  onExportPrimary,
  onOpenFacebook,
  onInitializeFFmpeg,
  onExportSilentMp4,
  onExportNarratedMp4,
}: ExportPanelProps) {
  const busy = isRecording || isExporting;
   alert(
  `ExportPanel\nRecording: ${isRecording}\nExporting: ${isExporting}\nBusy: ${busy}`
);


  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
console.log("EXPORT PANEL", {
  isRecording,
  isExporting,
  busy,
});
  return (
    <div className="space-y-4 text-white">
      <div>
        <h3 className="text-base font-extrabold text-white">
          Export & Download
        </h3>

        <p className="mt-1 text-xs font-medium leading-5 text-slate-300 sm:text-sm">
          Download your finished media, then post it anywhere.
        </p>
      </div>

      <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-xs font-semibold leading-5 text-blue-100">
        <p className="font-extrabold">Export first, then share</p>
        <p className="mt-1 text-blue-100/90">
          Save the file to your phone or laptop, then open your social app and upload it.
        </p>
      </div>

      {exportStatus && (
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3">
          <div className="flex items-center gap-3">
            {busy && <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />}

            <p className="text-sm font-bold leading-5 text-cyan-100">
              {exportStatus}
            </p>
          </div>
        </div>
      )}
console.log("DOWNLOAD BUTTON DISABLED:", busy);
      <Button
        type="button"
        onClick={onExportPrimary}
        disabled={busy}
        className="h-14 w-full rounded-3xl bg-cyan-600 text-base font-extrabold text-white shadow-2xl hover:bg-cyan-700 disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Download className="mr-2 h-5 w-5" />
        )}
        {exportPrimaryLabel || "Export / Download Media"}
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          onClick={onOpenFacebook}
          disabled={busy}
          className="h-12 rounded-2xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60 sm:text-sm"
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.tiktok.com/upload")}
          disabled={busy}
          className="h-12 rounded-2xl bg-black text-xs font-bold text-white hover:bg-zinc-900 disabled:opacity-60 sm:text-sm"
        >
          <Film className="mr-2 h-4 w-4" />
          TikTok
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://web.whatsapp.com/")}
          disabled={busy}
          className="h-12 rounded-2xl bg-green-600 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-60 sm:text-sm"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.instagram.com/")}
          disabled={busy}
          className="h-12 rounded-2xl bg-pink-600 text-xs font-bold text-white hover:bg-pink-700 disabled:opacity-60 sm:text-sm"
        >
          <Film className="mr-2 h-4 w-4" />
          Instagram
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.messenger.com/")}
          disabled={busy}
          className="col-span-2 h-12 rounded-2xl bg-sky-600 text-xs font-bold text-white hover:bg-sky-700 disabled:opacity-60 sm:text-sm"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Messenger
        </Button>

        <details className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-3">
          <summary className="cursor-pointer text-sm font-bold text-slate-200">
            Advanced export
          </summary>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={onInitializeFFmpeg}
              disabled={isExporting}
              className="h-12 rounded-2xl border-white/15 bg-slate-900/50 text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Settings2 className="mr-2 h-4 w-4 text-violet-300" />
              )}
              {isExporting ? "Loading..." : "Initialize FFmpeg"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onExportSilentMp4}
              disabled={isRecording}
              className="h-12 rounded-2xl border-white/15 bg-slate-900/50 text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {isRecording ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Film className="mr-2 h-4 w-4 text-cyan-300" />
              )}
              {isRecording ? "Rendering..." : "Silent MP4"}
            </Button>

            <Button
              type="button"
              onClick={onExportNarratedMp4}
              disabled={busy}
              className="h-12 rounded-2xl bg-amber-500 font-bold text-white hover:bg-amber-600 disabled:opacity-60 sm:col-span-2"
            >
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="mr-2 h-4 w-4" />
              )}
              Narrated MP4
            </Button>
          </div>
        </details>
      </div>
    </div>
  );
}
