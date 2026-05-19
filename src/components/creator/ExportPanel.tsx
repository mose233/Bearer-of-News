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
  onGenerateCompleteVideo: () => void;
  onShareToFacebook: () => void;
  onInitializeFFmpeg: () => void;
  onExportSilentMp4: () => void;
  onExportNarratedMp4: () => void;
  onExportFinalMixedMp4: () => void;
};

export default function ExportPanel({
  isRecording,
  isExporting,
  onGenerateCompleteVideo,
  onShareToFacebook,
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
          Export & Publishing
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
          Render your final video, export MP4 versions, and share to Facebook.
        </p>
      </div>

      <Button
        onClick={onGenerateCompleteVideo}
        disabled={busy}
        className="h-14 w-full rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-base font-extrabold text-white shadow-2xl hover:opacity-95 disabled:opacity-60"
      >
        {busy ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating video...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Complete AI Video
          </span>
        )}
      </Button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          onClick={onShareToFacebook}
          className="h-12 rounded-2xl border-white/15 bg-slate-900/50 text-white hover:bg-slate-800"
        >
          <Facebook className="mr-2 h-4 w-4 text-blue-300" />
          Share to Facebook
        </Button>

        <Button
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
          onClick={onExportNarratedMp4}
          disabled={busy}
          className="h-12 rounded-2xl bg-amber-500 text-white font-bold hover:bg-amber-600 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Volume2 className="mr-2 h-4 w-4" />
          )}
          Narrated MP4
        </Button>

        <Button
          onClick={onExportFinalMixedMp4}
          disabled={busy}
          className="h-12 rounded-2xl bg-cyan-600 text-white font-bold hover:bg-cyan-700 disabled:opacity-60 sm:col-span-2"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Final Mixed MP4
        </Button>
      </div>

      <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3">
        <p className="text-xs font-medium leading-5 text-amber-100">
          Review your video before sharing. Avoid copyrighted media, misleading
          claims, impersonation, spam, or unsafe content.
        </p>
      </div>
    </div>
  );
}
