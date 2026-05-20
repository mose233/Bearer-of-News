import { ImagePlus, Music2, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DanceStyle, danceStyles } from "@/lib/ai/videoProviders";

type DancingPhotoPanelProps = {
  dancingPhotoPreview: string;
  danceStyle: DanceStyle;
  isGeneratingDance: boolean;
  danceResultMessage: string;
  setDanceStyle: (value: DanceStyle) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateDance: () => void;
};

export default function DancingPhotoPanel({
  dancingPhotoPreview,
  danceStyle,
  isGeneratingDance,
  danceResultMessage,
  setDanceStyle,
  onPhotoUpload,
  onGenerateDance,
}: DancingPhotoPanelProps) {
  const [hasConfirmedRights, setHasConfirmedRights] = useState(false);

  const canGenerate =
    !!dancingPhotoPreview && hasConfirmedRights && !isGeneratingDance;

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-white">
      <div>
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-cyan-300" />
          <h3 className="text-base font-extrabold text-white">
            Dancing Photo Maker
          </h3>
        </div>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
          Turn your photo into a fun AI dancing creative.
        </p>
      </div>

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3">
        <div className="flex gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-cyan-200" />

          <p className="text-xs font-medium leading-5 text-cyan-100">
            Protect your content: use photos you own or have permission to use.
          </p>
        </div>
      </div>

      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-900/50 px-5 py-8 text-center transition hover:border-cyan-400/50 hover:bg-slate-900/80">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15">
          <ImagePlus className="h-7 w-7 text-cyan-300" />
        </div>

        <span className="text-sm font-extrabold text-white">
          Upload Photo
        </span>

        <span className="mt-1 text-xs font-medium text-slate-300">
          Portrait or full-body image
        </span>

        <Input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPhotoUpload}
        />
      </label>

      <div className="space-y-2">
        <label className="text-sm font-extrabold text-white">
          Dance Style
        </label>

        <select
          value={danceStyle}
          onChange={(e) => setDanceStyle(e.target.value as DanceStyle)}
          className="w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
        >
          {danceStyles.map((style) => (
            <option
              key={style}
              value={style}
              className="bg-slate-950 text-white"
            >
              {style}
            </option>
          ))}
        </select>
      </div>

      {dancingPhotoPreview && (
        <div className="rounded-3xl border border-white/10 bg-black p-3">
          <div className="relative overflow-hidden rounded-2xl bg-black">
            <img
              src={dancingPhotoPreview}
              alt="Dancing photo preview"
              className="h-[360px] w-full object-cover animate-kenburns"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
              AI Creative Preview
            </div>

            <div className="absolute right-4 top-4 rounded-full bg-cyan-600 px-3 py-1 text-xs font-extrabold text-white">
              Mock Dance
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="rounded-2xl bg-black/45 px-4 py-3 backdrop-blur">
                <p className="text-base font-extrabold text-white">
                  {danceStyle}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  Review before sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <input
          type="checkbox"
          checked={hasConfirmedRights}
          onChange={(e) => setHasConfirmedRights(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-white/20"
        />

        <span className="text-xs font-medium leading-5 text-slate-200">
          I own this photo or have permission to use it.
        </span>
      </label>

      <Button
        type="button"
        onClick={onGenerateDance}
        disabled={!canGenerate}
        className="h-12 rounded-2xl bg-cyan-600 px-5 text-sm font-extrabold text-white hover:bg-cyan-700 disabled:opacity-60"
      >
        {isGeneratingDance ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Generating Dance...
          </>
        ) : (
          <>
            <Music2 className="mr-2 h-4 w-4" />
            Generate Dancing Video
          </>
        )}
      </Button>

      {danceResultMessage && (
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3">
          <p className="text-sm font-bold leading-5 text-cyan-100">
            {danceResultMessage}
          </p>
        </div>
      )}
    </div>
  );
}
