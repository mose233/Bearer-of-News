import { Facebook } from "lucide-react";
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
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={onGenerateCompleteVideo}
        disabled={busy}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        {busy ? "Generating Complete Video..." : "Generate Complete AI Video"}
      </Button>

      <Button
        variant="outline"
        onClick={onShareToFacebook}
        className="flex items-center gap-2"
      >
        <Facebook className="w-4 h-4" />
        Share to Facebook
      </Button>

      <Button
        variant="secondary"
        onClick={onInitializeFFmpeg}
        disabled={isExporting}
      >
        {isExporting ? "Loading..." : "Initialize FFmpeg"}
      </Button>

      <Button
        variant="secondary"
        onClick={onExportSilentMp4}
        disabled={isRecording}
      >
        {isRecording ? "Rendering..." : "Export Silent MP4"}
      </Button>

      <Button
        onClick={onExportNarratedMp4}
        disabled={busy}
        className="bg-orange-600 hover:bg-orange-700"
      >
        {busy ? "Exporting Narrated MP4..." : "Export Narrated MP4"}
      </Button>

      <Button
        onClick={onExportFinalMixedMp4}
        disabled={busy}
        className="bg-indigo-600 hover:bg-indigo-700"
      >
        {busy ? "Exporting Final MP4..." : "Export Final Mixed MP4"}
      </Button>
    </div>
  );
}
