import {
  Download,
  Facebook,
  Film,
  Loader2,
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
}: ExportPanelProps) {
  const busy = isRecording || isExporting;

  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-3 rounded-2xl border border-blue-400/15 bg-[#061329] p-3 text-white sm:space-y-3.5 sm:p-4">
      {exportStatus && (
        <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-2.5">
            {busy && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-cyan-200" />}
            <p className="text-xs font-semibold leading-5 text-cyan-100 sm:text-sm">
              {exportStatus}
            </p>
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={onExportPrimary}
        disabled={busy}
        className="h-11 w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-sm font-extrabold text-white shadow-lg shadow-cyan-950/30 transition hover:brightness-110 disabled:opacity-60 sm:h-12 sm:text-base"
      >
        {busy ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Download className="mr-2 h-5 w-5" />
        )}
        {exportPrimaryLabel || "Download Media"}
      </Button>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-2.5">
        <Button
          type="button"
          onClick={onOpenFacebook}
          disabled={busy}
          className="h-9 rounded-lg bg-blue-600 px-2 text-[11px] font-bold text-white hover:bg-blue-700 disabled:opacity-60 sm:h-10 sm:text-xs"
        >
          <Facebook className="mr-1.5 h-4 w-4 shrink-0" />
          Facebook
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.tiktok.com/upload")}
          disabled={busy}
          className="h-9 rounded-lg bg-black px-2 text-[11px] font-bold text-white hover:bg-zinc-900 disabled:opacity-60 sm:h-10 sm:text-xs"
        >
          <Film className="mr-1.5 h-4 w-4 shrink-0" />
          TikTok
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://web.whatsapp.com/")}
          disabled={busy}
          className="h-9 rounded-lg bg-green-600 px-2 text-[11px] font-bold text-white hover:bg-green-700 disabled:opacity-60 sm:h-10 sm:text-xs"
        >
          <MessageCircle className="mr-1.5 h-4 w-4 shrink-0" />
          WhatsApp
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.instagram.com/")}
          disabled={busy}
          className="h-9 rounded-lg bg-pink-600 px-2 text-[11px] font-bold text-white hover:bg-pink-700 disabled:opacity-60 sm:h-10 sm:text-xs"
        >
          <Film className="mr-1.5 h-4 w-4 shrink-0" />
          Instagram
        </Button>

        <Button
          type="button"
          onClick={() => openExternal("https://www.messenger.com/")}
          disabled={busy}
          className="col-span-2 h-9 rounded-lg bg-blue-600 px-2 text-[11px] font-bold text-white hover:bg-blue-700 disabled:opacity-60 sm:col-span-1 sm:h-10 sm:text-xs"
        >
          <MessageCircle className="mr-1.5 h-4 w-4 shrink-0" />
          Messenger
        </Button>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/[0.06] px-3 py-2.5 text-[11px] leading-4 text-amber-200 sm:text-xs">
        <span className="mt-0.5 shrink-0" aria-hidden="true">🛡️</span>
        <p>Review your content before downloading or sharing.</p>
      </div>
    </div>
  );
}
