import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MusicPanelProps = {
  backgroundMusic: File | null;
  musicPreview: string;
  musicVolume: number;
  setMusicVolume: (value: number) => void;
  isMusicPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  onMusicUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMusic: () => void;
};

export default function MusicPanel({
  backgroundMusic,
  musicPreview,
  musicVolume,
  setMusicVolume,
  isMusicPlaying,
  audioRef,
  onMusicUpload,
  onToggleMusic,
}: MusicPanelProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Background Music</label>

      <Input type="file" accept="audio/*" onChange={onMusicUpload} />

      <div className="space-y-2">
        <label className="text-sm">
          Background Music Volume: {Math.round(musicVolume * 100)}%
        </label>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={musicVolume}
          onChange={(e) => setMusicVolume(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {backgroundMusic && (
        <div className="space-y-3 border rounded-xl p-4">
          <p className="text-sm font-medium">{backgroundMusic.name}</p>

          <audio
            ref={audioRef}
            src={musicPreview}
            loop
          />

          <Button
            type="button"
            onClick={onToggleMusic}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isMusicPlaying ? "Pause Music" : "Play Music"}
          </Button>
        </div>
      )}
    </div>
  );
}
