import {
  Download,
  ImagePlus,
  Music,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PhotoMusicVideoPanelProps = {
  photoMusicImagePreview: string;
  photoMusicAudioName: string;
  photoMusicStyle: string;
  isExportingPhotoMusic?: boolean;
  setPhotoMusicStyle: (value: string) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAudioUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddPhotoSceneToTimeline: () => void;
  onExportPhotoMusicVideo: () => void;
};

const styles = [
  "Music Video",
  "Romantic Reel",
  "Birthday Video",
  "Gospel / Worship",
  "Dance Effect",
  "Promo Video",
];

export default function PhotoMusicVideoPanel({
  photoMusicImagePreview,
  photoMusicAudioName,
  photoMusicStyle,
  isExportingPhotoMusic = false,
  setPhotoMusicStyle,
  onPhotoUpload,
  onAudioUpload,
  onAddPhotoSceneToTimeline,
  onExportPhotoMusicVideo,
}: PhotoMusicVideoPanelProps) {
  const [hasConfirmedRights, setHasConfirmedRights] = useState(false);

  const readyToExport =
    !!photoMusicImagePreview &&
    !!photoMusicAudioName &&
    hasConfirmedRights;

  const readyToAddScene =
    !!photoMusicImagePreview &&
    hasConfirmedRights;

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-white">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-pink-300" />
          <h3 className="text-base font-extrabold text-white">
            Photo Music Video Maker
          </h3>
        </div>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
          Upload your own photo and audio, then export a mobile-ready MP4 music
          video.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3">
        <div className="flex gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-amber-200" />

          <p className="text-xs font-medium leading-5 text-amber-100">
            Only upload media you own or have permission to use. Do not use
            copyrighted music, images of other people without permission, or
            media that could mislead, impersonate, or violate platform rules.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-900/50 px-5 py-8 text-center transition hover:border-pink-400/50 hover:bg-slate-900/80">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/15">
            <ImagePlus className="h-7 w-7 text-pink-300" />
          </div>

          <span className="text-sm font-extrabold text-white">
            Upload Photo
          </span>

          <span className="mt-1 text-xs font-medium text-slate-300">
            Use your own image or licensed image
          </span>

          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPhotoUpload}
          />
        </label>

        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-900/50 px-5 py-8 text-center transition hover:border-violet-400/50 hover:bg-slate-900/80">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15">
            <Music className="h-7 w-7 text-violet-300" />
          </div>

          <span className="text-sm font-extrabold text-white">
            Upload Audio
          </span>

          <span className="mt-1 text-xs font-medium text-slate-300">
            Music, audio, or licensed soundtrack
          </span>

          <Input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={onAudioUpload}
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-extrabold text-white">
          Music Video Style
        </label>

        <select
          value={photoMusicStyle}
          onChange={(e) => setPhotoMusicStyle(e.target.value)}
          className="w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30"
        >
          {styles.map((style) => (
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

      {(photoMusicImagePreview || photoMusicAudioName) && (
        <div className="rounded-3xl border border-white/10 bg-black p-3">
          {photoMusicImagePreview && (
            <div className="relative overflow-hidden rounded-2xl bg-black">
              <img
                src={photoMusicImagePreview}
                alt="Photo music video preview"
                className="h-[360px] w-full object-cover animate-kenburns"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                AI Generated Creative Preview
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-pink-600 px-3 py-1 text-xs font-extrabold text-white">
                MP4 Ready
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="rounded-2xl bg-black/45 px-4 py-3 backdrop-blur">
                  <p className="text-base font-extrabold text-white">
                    {photoMusicStyle}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {photoMusicAudioName ||
                      "Add audio to complete your music video"}
                  </p>
                </div>
              </div>
            </div>
          )}
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
          I confirm I own this media or have permission to use it. I will not
          upload copyrighted or unauthorized content. I understand generated
          content must be reviewed before sharing.
        </span>
      </label>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={onAddPhotoSceneToTimeline}
          disabled={!readyToAddScene}
          className="h-12 rounded-2xl bg-pink-600 px-5 text-sm font-extrabold text-white hover:bg-pink-700 disabled:opacity-60"
        >
          <Play className="mr-2 h-4 w-4" />
          Add Scene
        </Button>

        <Button
          type="button"
          onClick={onExportPhotoMusicVideo}
          disabled={!readyToExport || isExportingPhotoMusic}
          className="h-12 rounded-2xl bg-cyan-600 px-5 text-sm font-extrabold text-white hover:bg-cyan-700 disabled:opacity-60"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExportingPhotoMusic
            ? "Exporting MP4..."
            : "Export Music Video MP4"}
        </Button>
      </div>

      {!hasConfirmedRights &&
        (photoMusicImagePreview || photoMusicAudioName) && (
          <p className="text-xs font-medium leading-5 text-amber-100">
            Please confirm ownership or permission before continuing.
          </p>
        )}
    </div>
  );
}
