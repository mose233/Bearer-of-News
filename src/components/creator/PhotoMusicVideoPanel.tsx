import React from "react";
import { ImagePlus, Music } from "lucide-react";

import { Input } from "@/components/ui/input";

type PhotoMusicVideoPanelProps = {
  photoMusicImagePreview: string;
  photoMusicAudioName: string;
  photoMusicStyle: string;
  isExportingPhotoMusic: boolean;
  setPhotoMusicStyle: (value: string) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAudioUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddPhotoSceneToTimeline: () => void;
  onExportPhotoMusicVideo: () => void;
};

const videoTypes = [
  "Trending Reel",
  "TikTok Viral Edit",
  "Music Slideshow",
  "Lyric Visualizer",
  "Romantic Music Story",
  "Birthday Music Tribute",
  "Wedding Music Story",
  "Memorial Music Tribute",
  "Faith / Gospel Music Tribute",
  "Choir Tribute",
  "Travel Music Memories",
  "Family Music Memories",
  "Glow Up Music Edit",
  "Fashion Music Showcase",
  "Dance Photo Music Edit",
  "Afrobeats Music Video",
  "Amapiano Music Video",
  "Gengetone Music Video",
  "Product Music Promo",
  "Event Highlights Music Video",
  "WhatsApp Music Status",
];

const outputFormats = [
  "Facebook Feed",
  "Facebook Reel",
  "WhatsApp Status",
  "Instagram Reel",
  "TikTok",
  "YouTube Shorts",
];

export default function PhotoMusicVideoPanel({
  photoMusicImagePreview,
  photoMusicAudioName,
  photoMusicStyle,
  isExportingPhotoMusic,
  setPhotoMusicStyle,
  onPhotoUpload,
  onAudioUpload,
  onExportPhotoMusicVideo,
}: PhotoMusicVideoPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 text-white">
      <div className="flex items-center gap-2">
        <Music className="h-5 w-5 text-violet-300" />
        <h3 className="text-lg font-extrabold">Photo Music Video Maker</h3>
      </div>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
        Create Facebook-ready music videos from your photos and audio.
      </p>

      <details className="mt-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
        <summary className="cursor-pointer list-none select-none">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-violet-200">
                🎬 CINEMATIC AI
              </div>

              <div className="mt-1 text-lg font-bold text-white">
                10 Seconds ........ $0.70
              </div>
            </div>

            <span className="text-lg font-extrabold text-violet-200">
              Tap to View Prices ▼
            </span>
          </div>
        </summary>

        <div className="mt-4 space-y-2 text-sm font-semibold text-white">
          <div className="flex justify-between rounded-xl bg-slate-900/40 px-4 py-3">
            <span>10 Seconds</span>
            <span>$0.70</span>
          </div>

          <div className="flex justify-between rounded-xl bg-slate-900/40 px-4 py-3">
            <span>20 Seconds</span>
            <span>$1.20</span>
          </div>

          <div className="flex justify-between rounded-xl bg-slate-900/40 px-4 py-3">
            <span>30 Seconds</span>
            <span>$1.70</span>
          </div>

          <div className="flex justify-between rounded-xl bg-slate-900/40 px-4 py-3">
            <span>40 Seconds</span>
            <span>$2.20</span>
          </div>

          <div className="flex justify-between rounded-xl bg-slate-900/40 px-4 py-3">
            <span>50 Seconds</span>
            <span>$2.70</span>
          </div>

          <div className="flex justify-between rounded-xl bg-slate-900/40 px-4 py-3">
            <span>60 Seconds</span>
            <span>$3.20</span>
          </div>
        </div>
      </details>

      <div className="mt-5 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="text-sm font-extrabold text-white">
              Upload Photos
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Upload the main photo or image for your music video.
            </p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/70 px-5 py-8 text-center transition hover:border-violet-400/50 hover:bg-slate-950/90">
              <ImagePlus className="mb-3 h-7 w-7 text-violet-300" />

              <span className="text-sm font-extrabold text-white">
                Click to Upload Photo
              </span>

              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPhotoUpload}
              />
            </label>

            {photoMusicImagePreview && (
              <img
                src={photoMusicImagePreview}
                alt="Photo music video preview"
                className="mt-4 max-h-[320px] w-full rounded-2xl object-contain"
              />
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="text-sm font-extrabold text-white">
              Upload Music
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Upload MP3, WAV, or another audio file for the video.
            </p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/70 px-5 py-8 text-center transition hover:border-violet-400/50 hover:bg-slate-950/90">
              <Music className="mb-3 h-7 w-7 text-violet-300" />

              <span className="text-sm font-extrabold text-white">
                Click to Upload Music
              </span>

              <span className="mt-1 text-xs font-medium text-slate-300">
                {photoMusicAudioName || "No music selected yet."}
              </span>

              <Input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={onAudioUpload}
              />
            </label>
          </div>
        </div>

        {/* Keep the rest of your existing file unchanged */}
      </div>
    </div>
  );
}
