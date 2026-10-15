import {
  Download,
  Facebook,
  Film,
  Loader2,
  MessageCircle,
  Music2,
  Instagram,
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
  onExportFinalMixedMp4?: () => void;
};

export default function ExportPanel({
  isRecording,
  isExporting,
  exportStatus = "",
  exportPrimaryLabel,
  onExportPrimary,
  onOpenFacebook,
}: ExportPanelProps) {
  const busy = isRecording || isExporting;

  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const socialButton =
    "h-11 w-full rounded-xl text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:h-12";

  return (
    <div className="space-y-3 text-white sm:space-y-4">
      {exportStatus && (
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3">
          <div className="flex items-center gap-3">
            {busy && <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />}
            <p className="text-sm font-bold leading-5 text-cyan-100">{exportStatus}</p>
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={onExportPrimary}
        disabled={busy}
        className="h-14 w-full rounded-xl border border-cyan-200/50 bg-gradient-to-r from-cyan-500 to-sky-500 text-base font-extrabold text-white shadow-[0_0_22px_rgba(6,182,212,0.22)] hover:from-cyan-400 hover:to-sky-400 disabled:opacity-60 sm:h-14"
      >
        {busy ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Download className="mr-2 h-5 w-5" />
        )}
        {exportPrimaryLabel || "Download Media"}
      </Button>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <Button
          type="button"
          onClick={onOpenFacebook}
          disabled={busy}
          className={`${socialButton} bg-[#1877F2] hover:bg-[#1669d8]`}
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.tiktok.com/upload")}
          disabled={busy}
          className={`${socialButton} bg-black hover:bg-zinc-900`}
        >
          <Film className="mr-2 h-4 w-4" />
          TikTok
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://web.whatsapp.com/")}
          disabled={busy}
          className={`${socialButton} bg-[#16A34A] hover:bg-green-700`}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.instagram.com/")}
          disabled={busy}
          className={`${socialButton} bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:brightness-110`}
        >
          <Instagram className="mr-2 h-4 w-4" />
          Instagram
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.messenger.com/")}
          disabled={busy}
          className={`${socialButton} col-span-2 bg-[#087EEC] hover:bg-blue-700`}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Messenger
        </Button>
      </div>
    </div>
  );
}
