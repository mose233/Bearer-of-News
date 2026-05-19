import { Mic, Play, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type VoicePanelProps = {
  speechRate: number;
  setSpeechRate: (value: number) => void;
  voiceVolume: number;
  setVoiceVolume: (value: number) => void;
  isSpeaking: boolean;
  aiVoiceBlob: Blob | null;
  isExporting: boolean;
  onPlayVoiceover: () => void;
  onStopVoiceover: () => void;
  onGenerateRealVoice: () => void;
};

export default function VoicePanel({
  speechRate,
  setSpeechRate,
  voiceVolume,
  setVoiceVolume,
  isSpeaking,
  aiVoiceBlob,
  isExporting,
  onPlayVoiceover,
  onStopVoiceover,
  onGenerateRealVoice,
}: VoicePanelProps) {
  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-white">
      <div>
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-cyan-300" />
          <label className="text-base font-extrabold text-white">
            Voice Controls
          </label>
        </div>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
          Preview narration, adjust speed and volume, then generate export-ready
          AI voice.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-white">
          Speech Speed: {speechRate.toFixed(1)}x
        </label>

        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speechRate}
          onChange={(e) => setSpeechRate(Number(e.target.value))}
          className="w-full accent-cyan-400"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-white">
          AI Voice Volume: {Math.round(voiceVolume * 100)}%
        </label>

        <input
          type="range"
          min="0"
          max="2"
          step="0.05"
          value={voiceVolume}
          onChange={(e) => setVoiceVolume(Number(e.target.value))}
          className="w-full accent-violet-400"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onPlayVoiceover}
          className="h-12 rounded-2xl bg-emerald-600 px-5 text-sm font-extrabold text-white hover:bg-emerald-700"
        >
          <Play className="mr-2 h-4 w-4" />
          Play Voiceover
        </Button>

        <Button
          onClick={onStopVoiceover}
          className="h-12 rounded-2xl bg-red-600 px-5 text-sm font-extrabold text-white hover:bg-red-700"
        >
          <Square className="mr-2 h-4 w-4" />
          Stop Voice
        </Button>

        <Button
          onClick={onGenerateRealVoice}
          disabled={isExporting}
          className="h-12 rounded-2xl bg-cyan-600 px-5 text-sm font-extrabold text-white hover:bg-cyan-700 disabled:opacity-60"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isExporting ? "Generating..." : "Generate Real AI Voice"}
        </Button>
      </div>

      {isSpeaking && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
          <p className="text-sm font-bold text-emerald-200">
            AI narration is currently speaking...
          </p>
        </div>
      )}

      {aiVoiceBlob && (
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3">
          <p className="text-sm font-bold text-cyan-200">
            Real AI voice is ready for MP4 export.
          </p>
        </div>
      )}
    </div>
  );
}
