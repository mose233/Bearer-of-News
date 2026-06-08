import {
  Download,
  Facebook,
  Film,
  Loader2,
  Settings2,
  Volume2,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ExportPanelProps = {
  isRecording: boolean;
  isExporting: boolean;
  exportStatus?: string;
  onGenerateCompleteVideo: () => void;
  onOpenFacebook: () => void;
  onInitializeFFmpeg: () => void;
  onExportSilentMp4: () => void;
  onExportNarratedMp4: () => void;
  onExportFinalMixedMp4: () => void;
};

export default function ExportPanel({
  isRecording,
  isExporting,
  exportStatus = "",
  onGenerateCompleteVideo,
  onOpenFacebook,
  onInitializeFFmpeg,
  onExportSilentMp4,
  onExportNarratedMp4,
  onExportFinalMixedMp4,
}: ExportPanelProps) {
  const busy = isRecording || isExporting;

  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-5 text-white">
      <div>
        <h3 className="text-base font-extrabold text-white">
          Export & Share
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
          Export your finished video/photo, then open your preferred social app
          and select the saved file.
        </p>
      </div>

      <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-xs font-semibold leading-5 text-blue-100">
        <p className="font-extrabold">How to Post</p>

        <ol className="mt-2 list-decimal space-y-2 pl-4">
          <li>
            <span className="font-extrabold">Export Video/Photo</span>
            <br />
            Save your finished media to your phone.
          </li>

          <li>
            <span className="font-extrabold">
              Open Facebook, TikTok, WhatsApp, Instagram, or Messenger
            </span>
            <br />
            Select the exported video/photo and publish it.
          </li>
        </ol>
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

      <Button
        type="button"
        onClick={onGenerateCompleteVideo}
        disabled={busy}
        className="h-14 w-full rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-base font-extrabold text-white shadow-2xl hover:opacity-95 disabled:opacity-60"
      >
        {busy ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Working...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Content
          </span>
        )}
      </Button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          type="button"
          onClick={onExportFinalMixedMp4}
          disabled={busy}
          className="h-12 rounded-2xl bg-cyan-600 font-bold text-white hover:bg-cyan-700 disabled:opacity-60 sm:col-span-2"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Video/Photo
        </Button>

        <Button
          type="button"
          onClick={onOpenFacebook}
          disabled={busy}
          className="h-12 rounded-2xl bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.tiktok.com/upload")}
          disabled={busy}
          className="h-12 rounded-2xl bg-black font-bold text-white hover:bg-zinc-900 disabled:opacity-60"
        >
          <Film className="mr-2 h-4 w-4" />
          TikTok
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://web.whatsapp.com/")}
          disabled={busy}
          className="h-12 rounded-2xl bg-green-600 font-bold text-white hover:bg-green-700 disabled:opacity-60"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.instagram.com/")}
          disabled={busy}
          className="h-12 rounded-2xl bg-pink-600 font-bold text-white hover:bg-pink-700 disabled:opacity-60"
        >
          <Film className="mr-2 h-4 w-4" />
          Instagram
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.messenger.com/")}
          disabled={busy}
          className="h-12 rounded-2xl bg-sky-600 font-bold text-white hover:bg-sky-700 disabled:opacity-60 sm:col-span-2"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Messenger
        </Button>

        <details className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:col-span-2">
          <summary className="cursor-pointer text-sm font-bold text-slate-200">
            Advanced export options
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
