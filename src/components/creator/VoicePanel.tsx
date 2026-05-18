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
    <div className="space-y-3">
      <label className="font-semibold text-sm">Voice Controls</label>

      <div className="space-y-2">
        <label className="text-sm">Speech Speed</label>

        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speechRate}
          onChange={(e) => setSpeechRate(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">
          AI Voice Volume: {Math.round(voiceVolume * 100)}%
        </label>

        <input
          type="range"
          min="0"
          max="2"
          step="0.05"
          value={voiceVolume}
          onChange={(e) => setVoiceVolume(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={onPlayVoiceover}
          className="bg-green-600 hover:bg-green-700"
        >
          ▶ Play Voiceover
        </Button>

        <Button
          onClick={onStopVoiceover}
          className="bg-red-600 hover:bg-red-700"
        >
          ■ Stop Voice
        </Button>

        <Button
          onClick={onGenerateRealVoice}
          disabled={isExporting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isExporting ? "Generating..." : "Generate Real AI Voice"}
        </Button>
      </div>

      {isSpeaking && (
        <p className="text-green-600 text-sm">AI narration speaking...</p>
      )}

      {aiVoiceBlob && (
        <p className="text-blue-600 text-sm">
          Real AI voice is ready for MP4 export.
        </p>
      )}
    </div>
  );
}
