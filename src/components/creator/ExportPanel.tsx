import { Download, Facebook, Film, Loader2, Settings2, Volume2 } from "lucide-react";
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
    <div className="space-y-4">
      <Button
        onClick={onGenerateCompleteVideo}
        disabled={busy}
        className="h-14 w-full rounded-2xl bg-creator-purple text-base font-bold text-white shadow-creator hover:bg-purple-700 disabled:opacity-60"
      >
        {busy ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating video...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            Generate Complete AI Video
          </span>
        )}
      </Button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          onClick={onShareToFacebook}
          className="h-12 rounded-2xl border-white/10 bg-white/5 text-creator-text hover:bg-white/10"
        >
          <Facebook className="mr-2 h-4 w-4" />
          Share to Facebook
        </Button>

        <Button
          variant="secondary"
          onClick={onInitializeFFmpeg}
          disabled={isExporting}
          className="h-12 rounded-2xl bg-white/10 text-creator-text hover:bg-white/15 disabled:opacity-60"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Settings2 className="mr-2 h-4 w-4" />
          )}
          {isExporting ? "Loading..." : "Initialize FFmpeg"}
        </Button>

        <Button
          variant="secondary"
          onClick={onExportSilentMp4}
          disabled={isRecording}
          className="h-12 rounded-2xl bg-white/10 text-creator-text hover:bg-white/15 disabled:opacity-60"
        >
          {isRecording ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isRecording ? "Rendering..." : "Silent MP4"}
        </Button>

        <Button
          onClick={onExportNarratedMp4}
          disabled={busy}
          className="h-12 rounded-2xl bg-creator-amber text-white hover:bg-amber-600 disabled:opacity-60"
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
          className="h-12 rounded-2xl bg-creator-blue text-white hover:bg-blue-700 disabled:opacity-60 sm:col-span-2"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Final Mixed MP4
        </Button>
      </div>

      <p className="text-xs leading-5 text-creator-muted">
        Review your video before sharing. Avoid copyrighted media, misleading claims,
        impersonation, spam, or unsafe content.
      </p>
    </div>
  );
}
