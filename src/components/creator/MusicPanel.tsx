import { Music, Play, Pause, Volume2 } from "lucide-react";
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
    <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-white">
      <div>
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-violet-300" />
          <label className="text-base font-extrabold text-white">
            Background Music
          </label>
        </div>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
          Add soundtrack or background audio to make your video more engaging.
        </p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-slate-900/60 p-4">
        <Input
          type="file"
          accept="audio/*"
          onChange={onMusicUpload}
          className="border-white/20 bg-slate-950/60 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-violet-700"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-white">
          <Volume2 className="h-4 w-4 text-violet-300" />
          Background Music Volume: {Math.round(musicVolume * 100)}%
        </label>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={musicVolume}
          onChange={(e) => setMusicVolume(Number(e.target.value))}
          className="w-full accent-violet-400"
        />
      </div>

      {backgroundMusic && (
        <div className="space-y-4 rounded-3xl border border-violet-400/20 bg-violet-500/10 p-4">
          <div>
            <p className="text-sm font-extrabold text-white">Selected Music</p>

            <p className="mt-1 break-all text-sm font-medium text-slate-300">
              {backgroundMusic.name}
            </p>
          </div>

          <audio
            ref={audioRef}
            src={musicPreview}
            loop
          />

          <Button
            type="button"
            onClick={onToggleMusic}
            className="h-12 rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white hover:bg-violet-700"
          >
            {isMusicPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause Music
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Play Music
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
