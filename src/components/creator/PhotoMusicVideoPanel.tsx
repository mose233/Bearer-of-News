import React from "react";
import { ImagePlus, Music } from "lucide-react";

import { Input } from "@/components/ui/input";
import PricingPanel from "./PricingPanel";
import { videoPricing } from "@/lib/pricing";

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

      <div className="mt-5 space-y-5">
        <PricingPanel
  pricing={videoPricing}
  defaultOpen={false}
/>
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

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              1. Video Type
            </span>

            <select
              value={photoMusicStyle}
              onChange={(e) => setPhotoMusicStyle(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-sm font-bold text-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
            >
              {videoTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              2. Output Format
            </span>

            <select
              className="w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-sm font-bold text-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
              defaultValue="Facebook Reel"
            >
              {outputFormats.map((format) => (
                <option key={format}>{format}</option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={onExportPhotoMusicVideo}
          disabled={isExportingPhotoMusic}
          className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 disabled:opacity-60 md:w-auto"
        >
          {isExportingPhotoMusic
            ? "Generating Complete AI Video..."
            : "Generate Complete AI Video"}
        </button>
      </div>
    </div>
  );
}
