import React, { RefObject, useState } from "react";
import { ImagePlus, Music, Share2, Sparkles, Upload, Wand2 } from "lucide-react";

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

  facebookCaption: string;
  setFacebookCaption: (value: string) => void;
  onShareToFacebook: () => void;

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

export default function DynamicToolWorkspace({
  selectedTool,
  facebookCaption,
  setFacebookCaption,
  onShareToFacebook,
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

  if (!selectedTool) {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">Choose a tool to begin</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Select Picture AI, Video AI, Audio / Music AI, or Social / Publishing
          above to open the right workspace.
        </p>
      </div>
    );
  }

  const { category, tool } = selectedTool;

  if (category === "Picture AI") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <ImagePlus className="h-5 w-5 text-pink-300" />
          <h3 className="text-lg font-extrabold">{tool}</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Upload a photo and choose how you want Bearer of News to enhance it.
          Real AI image editing will be connected later.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/60 px-5 py-8 text-center hover:border-pink-400/50">
            <Upload className="mb-3 h-7 w-7 text-pink-300" />
            <span className="text-sm font-extrabold">Upload Photo</span>

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
              }}
            />
          </label>

          <div className="space-y-2">
            <label className="text-sm font-extrabold">Enhancement Style</label>

            <select className={inputClass}>
              <option>Natural Enhancement</option>
              <option>Beauty Glow</option>
              <option>Premium Studio</option>
              <option>HD Sharp</option>
              <option>Younger Look</option>
              <option>Background Upgrade</option>
            </select>
          </div>
        </div>

        {picturePreview && (
          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-black p-3">
            <img
              src={picturePreview}
              alt="Selected preview"
              className="max-h-[380px] w-full rounded-2xl object-cover"
            />
          </div>
        )}

        <Button className="mt-5 h-12 rounded-2xl bg-pink-600 px-5 font-extrabold text-white hover:bg-pink-700">
          <Wand2 className="mr-2 h-4 w-4" />
          Preview Enhancement
        </Button>
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

  if (category === "Social / Publishing") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-emerald-300" />
          <h3 className="text-lg font-extrabold">{tool}</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Prepare captions, post ideas, hashtags, and Facebook-ready publishing
          content.
        </p>

        <div className="mt-5 space-y-3">
          <textarea
            value={facebookCaption}
            onChange={(e) => setFacebookCaption(e.target.value)}
            placeholder="Write or edit your Facebook caption..."
            className={`${inputClass} min-h-[130px] resize-y`}
          />

          <select className={inputClass}>
            <option>Professional</option>
            <option>Funny</option>
            <option>Emotional</option>
            <option>Business</option>
            <option>Breaking News</option>
            <option>Motivational</option>
          </select>
        </div>

        <Button
          type="button"
          onClick={onShareToFacebook}
          className="mt-5 h-12 rounded-2xl bg-emerald-600 px-5 font-extrabold text-white hover:bg-emerald-700"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share to Facebook
        </Button>
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
