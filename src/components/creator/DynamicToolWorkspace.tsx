import React, { RefObject, useState } from "react";
import {
  Download,
  ImagePlus,
  Music,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiToolSelection } from "@/components/creator/AiToolLauncher";

import VoicePanel from "@/components/creator/VoicePanel";
import MusicPanel from "@/components/creator/MusicPanel";
import PhotoMusicVideoPanel from "@/components/creator/PhotoMusicVideoPanel";
import DancingPhotoPanel from "@/components/creator/DancingPhotoPanel";

import { DanceStyle } from "@/lib/ai/videoProviders";

type DynamicToolWorkspaceProps = {
  selectedTool: AiToolSelection | null;

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

  backgroundMusic: File | null;
  musicPreview: string;
  musicVolume: number;
  setMusicVolume: (value: number) => void;
  isMusicPlaying: boolean;
  audioRef: RefObject<HTMLAudioElement | null>;
  onMusicUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMusic: () => void;

  photoMusicImagePreview: string;
  photoMusicAudioName: string;
  photoMusicStyle: string;
  isExportingPhotoMusic: boolean;
  setPhotoMusicStyle: (value: string) => void;
  onPhotoMusicPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoMusicAudioUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddPhotoMusicSceneToTimeline: () => void;
  onExportPhotoMusicVideo: () => void;

  dancingPhotoPreview: string;
  danceStyle: DanceStyle;
  isGeneratingDance: boolean;
  danceResultMessage: string;
  setDanceStyle: (value: DanceStyle) => void;
  onDancingPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateDance: () => void;
};

const boxClass =
  "rounded-[1.5rem] border border-white/10 bg-[#111827] p-5 text-white shadow-creator";

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30";

const enhancementFilters: Record<string, string> = {
  "Natural Enhancement": "brightness(1.08) contrast(1.08) saturate(1.12)",
  "Beauty Glow": "brightness(1.16) contrast(1.04) saturate(1.2) blur(0.2px)",
  "Premium Studio": "brightness(1.1) contrast(1.2) saturate(1.08)",
  "HD Sharp": "brightness(1.05) contrast(1.28) saturate(1.15)",
  "Younger Look":
    "brightness(1.18) contrast(1.03) saturate(1.12) blur(0.35px)",
  "Background Upgrade": "brightness(1.04) contrast(1.22) saturate(1.18)",
};

export default function DynamicToolWorkspace({
  selectedTool,
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
  backgroundMusic,
  musicPreview,
  musicVolume,
  setMusicVolume,
  isMusicPlaying,
  audioRef,
  onMusicUpload,
  onToggleMusic,
  photoMusicImagePreview,
  photoMusicAudioName,
  photoMusicStyle,
  isExportingPhotoMusic,
  setPhotoMusicStyle,
  onPhotoMusicPhotoUpload,
  onPhotoMusicAudioUpload,
  onAddPhotoMusicSceneToTimeline,
  onExportPhotoMusicVideo,
  dancingPhotoPreview,
  danceStyle,
  isGeneratingDance,
  danceResultMessage,
  setDanceStyle,
  onDancingPhotoUpload,
  onGenerateDance,
}: DynamicToolWorkspaceProps) {
  const [picturePreview, setPicturePreview] = useState("");
  const [pictureFileName, setPictureFileName] = useState("");
  const [enhancementStyle, setEnhancementStyle] =
    useState("Natural Enhancement");
  const [hasPreviewedEnhancement, setHasPreviewedEnhancement] = useState(false);

  const downloadEnhancedImage = async () => {
    if (!picturePreview) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = picturePreview;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.filter = enhancementFilters[enhancementStyle] || "none";
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `xnewsapp-${enhancementStyle
          .toLowerCase()
          .replace(/\s+/g, "-")}.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      }, "image/png");
    };
  };

  if (!selectedTool) {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">Choose a tool to begin</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Select Picture AI, Video AI, or Audio / Music AI above to open the
          right workspace.
        </p>
      </div>
    );
  }

  const { category, tool } = selectedTool;

  if (category === "Picture AI") {
    const filterClass = enhancementFilters[enhancementStyle];

    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <ImagePlus className="h-5 w-5 text-pink-300" />
          <h3 className="text-lg font-extrabold">{tool}</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Upload a photo, choose an enhancement style, and preview a polished
          mock result. Real AI image editing will be connected later.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/60 px-5 py-8 text-center transition hover:border-pink-400/50 hover:bg-slate-950/80">
            <Upload className="mb-3 h-7 w-7 text-pink-300" />
            <span className="text-sm font-extrabold">Upload Photo</span>

            <span className="mt-1 text-xs font-medium text-slate-300">
              Portrait, product, or creative image
            </span>

            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (picturePreview) {
                  URL.revokeObjectURL(picturePreview);
                }

                setPicturePreview(URL.createObjectURL(file));
                setPictureFileName(file.name);
                setHasPreviewedEnhancement(false);
              }}
            />
          </label>

          <div className="space-y-2">
            <label className="text-sm font-extrabold">Enhancement Style</label>

            <select
              value={enhancementStyle}
              onChange={(e) => {
                setEnhancementStyle(e.target.value);
                setHasPreviewedEnhancement(false);
              }}
              className={inputClass}
            >
              <option>Natural Enhancement</option>
              <option>Beauty Glow</option>
              <option>Premium Studio</option>
              <option>HD Sharp</option>
              <option>Younger Look</option>
              <option>Background Upgrade</option>
            </select>

            <p className="text-xs font-medium leading-5 text-slate-400">
              Current mode: {enhancementStyle}
            </p>
          </div>
        </div>

        {picturePreview && (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black p-3">
              <div className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Original
              </div>

              <img
                src={picturePreview}
                alt="Original preview"
                className="max-h-[380px] w-full rounded-2xl object-cover"
              />

              {pictureFileName && (
                <p className="mt-2 truncate text-xs font-medium text-slate-400">
                  {pictureFileName}
                </p>
              )}
            </div>

            <div className="overflow-hidden rounded-3xl border border-pink-400/20 bg-black p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-extrabold uppercase tracking-wide text-pink-200">
                  Enhanced Preview
                </span>

                {hasPreviewedEnhancement && (
                  <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-extrabold text-white">
                    Mock AI
                  </span>
                )}
              </div>

              {hasPreviewedEnhancement ? (
                <img
                  src={picturePreview}
                  alt="Enhanced preview"
                  className="max-h-[380px] w-full rounded-2xl object-cover"
                  style={{ filter: filterClass }}
                />
              ) : (
                <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-center">
                  <p className="text-sm font-medium leading-6 text-slate-300">
                    Click Preview Enhancement to see the {enhancementStyle} mock
                    result.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            type="button"
            disabled={!picturePreview}
            onClick={() => setHasPreviewedEnhancement(true)}
            className="h-12 rounded-2xl bg-pink-600 px-5 font-extrabold text-white hover:bg-pink-700 disabled:opacity-60"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Preview Enhancement
          </Button>

          <Button
            type="button"
            disabled={!picturePreview || !hasPreviewedEnhancement}
            onClick={downloadEnhancedImage}
            className="h-12 rounded-2xl bg-cyan-600 px-5 font-extrabold text-white hover:bg-cyan-700 disabled:opacity-60"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>
        </div>
      </div>
    );
  }

  if (tool === "Photo Music Video") {
    return (
      <PhotoMusicVideoPanel
        photoMusicImagePreview={photoMusicImagePreview}
        photoMusicAudioName={photoMusicAudioName}
        photoMusicStyle={photoMusicStyle}
        isExportingPhotoMusic={isExportingPhotoMusic}
        setPhotoMusicStyle={setPhotoMusicStyle}
        onPhotoUpload={onPhotoMusicPhotoUpload}
        onAudioUpload={onPhotoMusicAudioUpload}
        onAddPhotoSceneToTimeline={onAddPhotoMusicSceneToTimeline}
        onExportPhotoMusicVideo={onExportPhotoMusicVideo}
      />
    );
  }

  if (tool === "Dancing Photo") {
    return (
      <DancingPhotoPanel
        dancingPhotoPreview={dancingPhotoPreview}
        danceStyle={danceStyle}
        isGeneratingDance={isGeneratingDance}
        danceResultMessage={danceResultMessage}
        setDanceStyle={setDanceStyle}
        onPhotoUpload={onDancingPhotoUpload}
        onGenerateDance={onGenerateDance}
      />
    );
  }

  if (
    category === "Audio / Music AI" &&
    (tool === "AI Voiceover" ||
      tool === "Text to Speech" ||
      tool === "Narration Studio" ||
      tool === "Radio Ad Voice")
  ) {
    return (
      <div className={boxClass}>
        <div className="mb-5 flex items-center gap-2">
          <Music className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-extrabold">{tool}</h3>
        </div>

        <VoicePanel
          speechRate={speechRate}
          setSpeechRate={setSpeechRate}
          voiceVolume={voiceVolume}
          setVoiceVolume={setVoiceVolume}
          isSpeaking={isSpeaking}
          aiVoiceBlob={aiVoiceBlob}
          isExporting={isExporting}
          onPlayVoiceover={onPlayVoiceover}
          onStopVoiceover={onStopVoiceover}
          onGenerateRealVoice={onGenerateRealVoice}
        />
      </div>
    );
  }

  if (
    category === "Audio / Music AI" &&
    (tool === "Background Music" ||
      tool === "Jingle Creator" ||
      tool === "Lyric Video")
  ) {
    return (
      <div className={boxClass}>
        <div className="mb-5 flex items-center gap-2">
          <Music className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-extrabold">{tool}</h3>
        </div>

        <MusicPanel
          backgroundMusic={backgroundMusic}
          musicPreview={musicPreview}
          musicVolume={musicVolume}
          setMusicVolume={setMusicVolume}
          isMusicPlaying={isMusicPlaying}
          audioRef={audioRef}
          onMusicUpload={onMusicUpload}
          onToggleMusic={onToggleMusic}
        />
      </div>
    );
  }

  return (
    <div className={boxClass}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-300" />
        <h3 className="text-lg font-extrabold">{tool}</h3>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-300">
        This tool is ready in the launcher. Its full workflow will be connected
        in the next phase.
      </p>
    </div>
  );
}
