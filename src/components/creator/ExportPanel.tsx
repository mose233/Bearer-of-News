import {
  Download,
  Facebook,
  Film,
  Loader2,
  Settings2,
  Volume2,
  Sparkles,
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

  return (
    <div className="space-y-5 text-white">
      <div>
        <h3 className="text-base font-extrabold text-white">
          Export & Share
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
          Download your MP4 and share it on social media.
        </p>
      </div>

      <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-xs font-semibold leading-5 text-blue-100">
        <p className="font-extrabold">How to Share</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>Download MP4</li>
          <li>Open Facebook</li>
          <li>Create Post or Reel</li>
          <li>Select your video</li>
          <li>Publish</li>
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
            Generate Video
          </span>
        )}
      </Button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          type="button"
          onClick={onOpenFacebook}
          disabled={busy}
          className="h-12 rounded-2xl bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:opacity-60 sm:col-span-2"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Facebook className="mr-2 h-4 w-4" />
          )}
          Open Facebook
        </Button>

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
          className="h-12 rounded-2xl bg-amber-500 font-bold text-white hover:bg-amber-600 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Volume2 className="mr-2 h-4 w-4" />
          )}
          Narrated MP4
        </Button>

        <Button
          type="button"
          onClick={onExportFinalMixedMp4}
          disabled={busy}
          className="h-12 rounded-2xl bg-cyan-600 font-bold text-white hover:bg-cyan-700 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Final MP4
        </Button>
      </div>
    </div>
  );
}
