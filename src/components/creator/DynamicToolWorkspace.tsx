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

import PhotoMusicVideoPanel from "@/components/creator/PhotoMusicVideoPanel";
import DancingPhotoPanel from "@/components/creator/DancingPhotoPanel";

import { DanceStyle } from "@/lib/ai/videoProviders";
import { MultiScenePlan } from "@/lib/creator/multiSceneGenerator";

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

  videoPrompt?: string;
  setVideoPrompt?: (value: string) => void;
  videoCreativeType?: string;
  setVideoCreativeType?: (value: string) => void;
  videoOutputFormat?: string;
  setVideoOutputFormat?: (value: string) => void;
  onPrepareTextToVideoPrompt?: () => void;

  aiImagePrompt?: string;
  setAiImagePrompt?: (value: string) => void;
  isGeneratingImage?: boolean;
  generatedImagePreview?: string;
  multiScenePlan?: MultiScenePlan[];
  onGenerateImage?: () => void;
  onGenerateMultiScenePlan?: () => void;
  onAddGeneratedImage?: () => void;
  onGenerateSceneFromPlan?: (index: number) => void;
  onGenerateAllScenesFromPlan?: () => void;
  onMediaUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPublishToFacebook?: () => void;
  onDownloadGeneratedImage?: () => void;
  onEditGeneratedImageInCanvas?: () => void;
  onGenerateCompleteVideo?: () => void;
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

const songStyleGroups = [
  {
    label: "Kenya",
    styles: [
      "Gengetone",
      "Kapuka",
      "Genge Classics",
      "Afro Pop Kenya",
      "Kenyan Gospel Praise",
      "Mugithi Acoustic",
      "Gen Z Viral Beat",
      "Street Hype",
      "Club Banger",
      "Love Ballad",
    ],
  },
  {
    label: "Tanzania",
    styles: [
      "Bongo Flava",
      "Bongo Gospel",
      "Taarab Pop",
      "Amapiano Bongo Mix",
      "Swahili Love Song",
      "Street Bongo Vibes",
    ],
  },
  {
    label: "Uganda",
    styles: [
      "Afro Dancehall Uganda",
      "Ugandan Gospel",
      "Luganda Love Vibes",
      "Party Anthem",
    ],
  },
  {
    label: "Wider Africa",
    styles: [
      "Afrobeats",
      "Amapiano",
      "Afro Fusion",
      "Afro R&B",
      "Dancehall",
      "Trap Afro",
      "Reggae",
      "Dancehall Reggae",
      "Gospel Reggae",
    ],
  },
  {
    label: "Faith Market",
    styles: [
      "SDA Worship",
      "Catholic Hymn",
      "AIC Praise",
      "Afro Gospel Choir",
      "Contemporary Worship",
      "Praise & Worship",
      "Traditional Catholic Hymn",
      "Choir Anthem",
      "Revival Worship",
      "Swahili Gospel Choir",
      "Youth Church Praise",
    ],
  },
  {
    label: "South Asia / Philippines",
    styles: [
      "Bollywood Pop",
      "Punjabi Beat",
      "Desi Love Song",
      "Qawwali Fusion",
      "OPM Pop",
      "Pinoy Acoustic Pop",
    ],
  },
  {
    label: "Creator Market",
    styles: [
      "Radio Jingle",
      "TikTok Viral Sound",
      "Promo Beat",
      "Brand Theme Song",
      "Intro Theme",
      "Podcast Intro",
      "YouTube Intro Beat",
    ],
  },
];

const songLanguages = [
  "English",
  "Swahili",
  "Sheng",
  "Luganda",
  "Kikuyu",
  "Luo",
  "Kamba",
  "Dholuo",
  "Kisii",
  "Lingala",
  "French",
  "Arabic",
  "Pidgin",
  "Mixed",
  "Hindi",
  "Urdu",
  "Tagalog",
];

const textToVideoCreativeTypes = [
  "Trending Reel",
  "TikTok Viral",
  "Funny Skit",
  "Relationship Story",
  "Glow Up / Beauty",
  "Celebrity Gossip",
  "Breaking News Style",
  "Social Commentary",
  "Motivational Hustle",
  "Dance Promo",
  "Birthday Shoutout",
  "Faith / Gospel Message",
  "Product Promo",
  "Fashion / Drip Showcase",
  "Food Promo",
  "Business Promo",
  "Event Hype",
  "Travel Vlog Style",
  "Church Announcement",
];

const textToVideoOutputFormats = [
  "Facebook Feed",
  "Facebook Reel",
  "WhatsApp Status",
  "Instagram Reel",
  "TikTok",
  "YouTube Shorts",
];

const songDurations = ["30 sec", "60 sec", "120 sec"];

export default function DynamicToolWorkspace({
  selectedTool,
  speechRate: _speechRate,
  setSpeechRate: _setSpeechRate,
  voiceVolume: _voiceVolume,
  setVoiceVolume: _setVoiceVolume,
  isSpeaking: _isSpeaking,
  aiVoiceBlob: _aiVoiceBlob,
  isExporting: _isExporting,
  onPlayVoiceover: _onPlayVoiceover,
  onStopVoiceover: _onStopVoiceover,
  onGenerateRealVoice: _onGenerateRealVoice,
  backgroundMusic: _backgroundMusic,
  musicPreview: _musicPreview,
  musicVolume: _musicVolume,
  setMusicVolume: _setMusicVolume,
  isMusicPlaying: _isMusicPlaying,
  audioRef: _audioRef,
  onMusicUpload: _onMusicUpload,
  onToggleMusic: _onToggleMusic,
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
  videoPrompt = "",
  setVideoPrompt,
  videoCreativeType = "General",
  setVideoCreativeType,
  videoOutputFormat = "Facebook Reel",
  setVideoOutputFormat,
  onPrepareTextToVideoPrompt,
  aiImagePrompt = "",
  setAiImagePrompt,
  isGeneratingImage = false,
  generatedImagePreview = "",
  multiScenePlan = [],
  onGenerateImage,
  onGenerateMultiScenePlan,
  onAddGeneratedImage,
  onGenerateSceneFromPlan,
  onGenerateAllScenesFromPlan,
  onMediaUpload,
  onPublishToFacebook,
  onDownloadGeneratedImage,
  onEditGeneratedImageInCanvas,
  onGenerateCompleteVideo,
}: DynamicToolWorkspaceProps) {
  const [picturePreview, setPicturePreview] = useState("");
  const [pictureFileName, setPictureFileName] = useState("");
  const [enhancementStyle, setEnhancementStyle] =
    useState("Natural Enhancement");
  const [hasPreviewedEnhancement, setHasPreviewedEnhancement] = useState(false);

  const [songLyrics, setSongLyrics] = useState("");
  const [songStyle, setSongStyle] = useState("Gengetone");
  const [songLanguage, setSongLanguage] = useState("Swahili");
  const [songDuration, setSongDuration] = useState("30 sec");
  const [songPreviewReady, setSongPreviewReady] = useState(false);
  const [songStatus, setSongStatus] = useState("");

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

  const buildSongPrompt = () => {
    return [
      `Style: ${songStyle}`,
      `Language: ${songLanguage}`,
      `Duration: ${songDuration}`,
      `Lyrics: ${songLyrics.trim()}`,
    ].join("\n");
  };

  const handleGenerateSong = () => {
    if (!songLyrics.trim()) {
      alert("Please write lyrics first.");
      return;
    }

    setSongPreviewReady(true);
    setSongStatus(
      "Song request prepared. The real MusicGen backend will connect here next."
    );
  };

  const handleDownloadSongRequest = () => {
    if (!songPreviewReady) {
      alert("Please generate the song request first.");
      return;
    }

    const blob = new Blob([buildSongPrompt()], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "xnewsapp-ai-song-request.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleShareSongToFacebook = () => {
    const quote = encodeURIComponent(
      `I created a ${songStyle} song idea in ${songLanguage} with xnewsapp.com.`
    );
    const shareUrl = encodeURIComponent(window.location.href);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${quote}`;

    window.open(fbUrl, "_blank", "width=700,height=500");
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

  if (category === "Video AI" && tool === "Text to Video Studio") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">Text to Video Studio</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Write your prompt, generate a video scene, preview it, then share to
          Facebook.
        </p>

        <div className="mt-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                1. Video Type
              </span>
              <select
                value={videoCreativeType}
                onChange={(e) => setVideoCreativeType?.(e.target.value)}
                className={inputClass}
              >
                {textToVideoCreativeTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                2. Output format
              </span>
              <select
                value={videoOutputFormat}
                onChange={(e) => setVideoOutputFormat?.(e.target.value)}
                className={inputClass}
              >
                {textToVideoOutputFormats.map((format) => (
                  <option key={format}>{format}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              3. Write prompt
            </span>
            <textarea
              value={videoPrompt}
              onChange={(e) => {
                setVideoPrompt?.(e.target.value);
                setAiImagePrompt?.(
                  [
                    `Video type: ${videoCreativeType}`,
                    `Output format: ${videoOutputFormat}`,
                    e.target.value,
                  ].join("\n")
                );
              }}
              placeholder="Example: Create a breaking news video about Nairobi traffic updates..."
              className="min-h-[150px] w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
            />
          </label>

          <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-4">
            <h4 className="text-sm font-extrabold text-white">
              4. Generate Video Scene
            </h4>

            <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
              <h5 className="text-sm font-extrabold text-white">
                AI Scene Generator
              </h5>

              <textarea
                value={aiImagePrompt}
                onChange={(e) => setAiImagePrompt?.(e.target.value)}
                placeholder="Example: A cinematic scene of a young entrepreneur opening a shop in Nairobi..."
                className="mt-3 min-h-[120px] w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
              />

              <button
                type="button"
                onClick={onGenerateCompleteVideo || (() => {})}
                disabled={isGeneratingImage}
                className="mt-4 h-11 rounded-2xl bg-violet-600 px-5 text-xs font-extrabold text-white transition hover:bg-violet-500 disabled:opacity-60"
              >
                Generate Complete AI Video
              </button>

              {generatedImagePreview && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <img
                    src={generatedImagePreview}
                    alt="Generated video scene preview"
                    className="max-h-[420px] w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (category === "Audio / Music AI" && tool === "AI Song Studio") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-extrabold">AI Song Studio</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Write lyrics, choose a style, select language and duration, then
          generate your song.
        </p>

        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              1. Write lyrics
            </span>
            <textarea
              value={songLyrics}
              onChange={(e) => {
                setSongLyrics(e.target.value);
                setSongPreviewReady(false);
                setSongStatus("");
              }}
              placeholder="Example: Nimeamka leo na ndoto kubwa, Nairobi inaningoja..."
              className="min-h-[180px] w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                2. Choose style
              </span>
              <select
                value={songStyle}
                onChange={(e) => {
                  setSongStyle(e.target.value);
                  setSongPreviewReady(false);
                  setSongStatus("");
                }}
                className={inputClass}
              >
                {songStyleGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.styles.map((style) => (
                      <option key={style}>{style}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                3. Choose language
              </span>
              <select
                value={songLanguage}
                onChange={(e) => {
                  setSongLanguage(e.target.value);
                  setSongPreviewReady(false);
                  setSongStatus("");
                }}
                className={inputClass}
              >
                {songLanguages.map((language) => (
                  <option key={language}>{language}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                4. Choose duration
              </span>
              <select
                value={songDuration}
                onChange={(e) => {
                  setSongDuration(e.target.value);
                  setSongPreviewReady(false);
                  setSongStatus("");
                }}
                className={inputClass}
              >
                {songDurations.map((duration) => (
                  <option key={duration}>{duration}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={handleGenerateSong}
            className="h-12 w-full rounded-2xl bg-cyan-600 px-5 text-sm font-extrabold text-white transition hover:bg-cyan-500 disabled:opacity-60 md:w-auto"
          >
            Generate Song
          </button>

          {songStatus && (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-bold leading-5 text-emerald-100">
              {songStatus}
            </div>
          )}

          {songPreviewReady && (
            <div className="space-y-3 rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-4">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
                <p className="text-sm font-extrabold text-white">
                  Song preview area
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-300">
                  The generated audio player will appear here after MusicGen or
                  another provider is connected.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  type="button"
                  onClick={handleShareSongToFacebook}
                  className="rounded-2xl bg-blue-600 px-4 py-3 text-xs font-extrabold text-white transition hover:bg-blue-500"
                >
                  Share to Facebook
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Generated song audio will be added to video after the music backend is connected."
                    )
                  }
                  className="rounded-2xl bg-violet-600 px-4 py-3 text-xs font-extrabold text-white transition hover:bg-violet-500"
                >
                  Use in Video
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSongRequest}
                  className="rounded-2xl bg-slate-700 px-4 py-3 text-xs font-extrabold text-white transition hover:bg-slate-600"
                >
                  Download Preview
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSongPreviewReady(false);
                    setSongStatus("");
                  }}
                  className="rounded-2xl bg-white/10 px-4 py-3 text-xs font-extrabold text-white transition hover:bg-white/15"
                >
                  Generate Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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

  if (tool === "Dance Animation") {
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

  if (category === "Video AI" && tool === "Photo to Video") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">Photo to Video</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Turn your own photos or videos into Facebook-ready videos.
        </p>

        <div className="mt-5 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="text-sm font-extrabold text-white">
              1. Upload Your Media
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Upload your own photos or videos to create your video.
            </p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/70 px-5 py-8 text-center transition hover:border-violet-400/50 hover:bg-slate-950/90">
              <Upload className="mb-3 h-7 w-7 text-violet-300" />

              <span className="text-sm font-extrabold text-white">
                Click to Upload
              </span>

              <span className="mt-1 text-xs font-medium text-slate-300">
                Upload multiple images or videos to build your Facebook-ready story.
              </span>

              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={onMediaUpload || (() => {})}
              />
            </label>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-extrabold text-white">
              2. Choose Video Style
            </h4>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Slideshow",
                "Cinematic",
                "Birthday",
                "Romantic",
                "Business Promo",
                "Church Tribute",
                "Memorial",
                "Product Showcase",
                "News Style",
              ].map((style) => (
                <button
                  key={style}
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              3. Choose Output Format
            </span>

            <select className={inputClass} defaultValue="Facebook Reel">
              {[
                "Facebook Feed",
                "Facebook Reel",
                "WhatsApp Status",
                "Instagram Reel",
                "TikTok",
                "YouTube Shorts",
              ].map((format) => (
                <option key={format}>{format}</option>
              ))}
            </select>
          </label>

          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="text-sm font-extrabold text-white">
              4. Add Music (Optional)
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Upload music if you want background audio in your video.
            </p>

            <Input
              type="file"
              accept="audio/*"
              className="mt-4 rounded-xl border border-white/10 bg-[#0B1020] p-3 text-sm text-slate-200"
              onChange={_onMusicUpload}
            />
          </div>

          <button
            type="button"
            onClick={onGenerateCompleteVideo || (() => {})}
            className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 md:w-auto"
          >
            Generate Complete AI Video
          </button>
        </div>
      </div>
    );
  }

  if (category === "Video AI" && tool === "Talking Avatars") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">Talking Avatars</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Upload a face photo, write a short script, choose voice and language,
          then generate a Facebook-ready talking avatar video.
        </p>

        <div className="mt-5 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="text-sm font-extrabold text-white">
              1. Upload Avatar Photo
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Upload a clear face photo for the avatar.
            </p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/70 px-5 py-8 text-center transition hover:border-violet-400/50 hover:bg-slate-950/90">
              <Upload className="mb-3 h-7 w-7 text-violet-300" />

              <span className="text-sm font-extrabold text-white">
                Click to Upload
              </span>

              <span className="mt-1 text-xs font-medium text-slate-300">
                Upload one portrait photo with a clear face.
              </span>

              <Input
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                2. Choose Voice
              </span>

              <select className={inputClass} defaultValue="Natural Presenter">
                {[
                  "Natural Presenter",
                  "News Anchor",
                  "Business Voice",
                  "Warm Friendly",
                  "Youth Creator",
                  "Church Announcement",
                ].map((voice) => (
                  <option key={voice}>{voice}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                3. Choose Language
              </span>

              <select className={inputClass} defaultValue="English">
                {[
                  "English",
                  "Swahili",
                  "Sheng",
                  "Luganda",
                  "French",
                  "Arabic",
                  "Pidgin",
                  "Hindi",
                  "Urdu",
                  "Tagalog",
                ].map((language) => (
                  <option key={language}>{language}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                4. Output Format
              </span>

              <select className={inputClass} defaultValue="Facebook Reel">
                {[
                  "Facebook Feed",
                  "Facebook Reel",
                  "WhatsApp Status",
                  "Instagram Reel",
                  "TikTok",
                  "YouTube Shorts",
                ].map((format) => (
                  <option key={format}>{format}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              5. Write Script
            </span>

            <textarea
              placeholder="Example: Hello everyone, welcome to xnewsapp. Today I want to share something important..."
              className="min-h-[150px] w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
            />
          </label>

          <button
            type="button"
            onClick={onGenerateCompleteVideo || (() => {})}
            className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 md:w-auto"
          >
            Generate Complete AI Video
          </button>
        </div>
      </div>
    );
  }

  if (category === "Video AI" && tool === "AI News Presenter") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">AI News Presenter</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Create Facebook-ready AI news presenter videos from your script.
        </p>

        <div className="mt-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                1. News Type
              </span>
              <select className={inputClass} defaultValue="Breaking News">
                {[
                  "Breaking News",
                  "Politics",
                  "Business News",
                  "Sports News",
                  "Entertainment News",
                  "Technology News",
                  "Health News",
                  "World News",
                  "Local Community Update",
                  "Church Announcement",
                  "School Announcement",
                  "Public Notice",
                  "Weather Update",
                  "Traffic Update",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                2. Presenter Style
              </span>
              <select className={inputClass} defaultValue="Professional Anchor">
                {[
                  "Professional Anchor",
                  "Young Creator",
                  "Female Presenter",
                  "Male Presenter",
                  "Business Presenter",
                  "African News Anchor",
                  "International Studio",
                  "Church Announcer",
                  "Government Briefing Style",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                3. Choose Language
              </span>
              <select className={inputClass} defaultValue="English">
                {[
                  "English",
                  "Swahili",
                  "Sheng",
                  "Luganda",
                  "French",
                  "Arabic",
                  "Pidgin",
                  "Hindi",
                  "Urdu",
                  "Tagalog",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                4. Output Format
              </span>
              <select className={inputClass} defaultValue="Facebook Reel">
                {[
                  "Facebook Feed",
                  "Facebook Reel",
                  "WhatsApp Status",
                  "Instagram Reel",
                  "TikTok",
                  "YouTube Shorts",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              5. Write News Script
            </span>
            <textarea
              placeholder="Example: Breaking: Nairobi County announces new traffic diversion after heavy flooding..."
              className="min-h-[150px] w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
            />
          </label>

          <button
            type="button"
            onClick={onGenerateCompleteVideo || (() => {})}
            className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 md:w-auto"
          >
            Generate Complete AI Video
          </button>
        </div>
      </div>
    );
  }

  if (category === "Video AI" && tool === "Product Ad Generator") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">Product Ad Generator</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Create Facebook-ready product advertisement videos for shops,
          businesses, services, and online sellers.
        </p>

        <div className="mt-5 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="text-sm font-extrabold text-white">
              Upload Product Images
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Upload product photos, packaging, menu images, or business images.
            </p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/70 px-5 py-8 text-center transition hover:border-violet-400/50 hover:bg-slate-950/90">
              <Upload className="mb-3 h-7 w-7 text-violet-300" />

              <span className="text-sm font-extrabold text-white">
                Click to Upload
              </span>

              <span className="mt-1 text-xs font-medium text-slate-300">
                Upload one or more product images for your ad.
              </span>

              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={onMediaUpload || (() => {})}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                1. Ad Type
              </span>
              <select className={inputClass} defaultValue="Product Launch">
                {[
                  "Product Launch",
                  "Flash Sale",
                  "Discount Offer",
                  "New Arrival",
                  "E-commerce Product",
                  "Fashion Promo",
                  "Beauty Product",
                  "Electronics Ad",
                  "Food Promotion",
                  "Restaurant Promo",
                  "Real Estate Promo",
                  "Car Sale Ad",
                  "Service Promotion",
                  "Business Promotion",
                  "Brand Awareness",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                2. Ad Style
              </span>
              <select className={inputClass} defaultValue="Modern Social Ad">
                {[
                  "Professional Commercial",
                  "Luxury Brand",
                  "Modern Social Ad",
                  "TikTok Promo",
                  "Facebook Reel Ad",
                  "Corporate Promo",
                  "Minimal Product Showcase",
                  "Bold Sales Promo",
                  "Animated Promo",
                  "African Market Style",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                3. Choose Language
              </span>
              <select className={inputClass} defaultValue="English">
                {[
                  "English",
                  "Swahili",
                  "Sheng",
                  "Luganda",
                  "French",
                  "Arabic",
                  "Pidgin",
                  "Hindi",
                  "Urdu",
                  "Tagalog",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                4. Output Format
              </span>
              <select className={inputClass} defaultValue="Facebook Reel">
                {[
                  "Facebook Feed",
                  "Facebook Reel",
                  "WhatsApp Status",
                  "Instagram Reel",
                  "TikTok",
                  "YouTube Shorts",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              5. Write Product Details
            </span>
            <textarea
              placeholder="Example: Product: Smart LED TV. Offer: 25% discount this weekend. Call to action: Order now via WhatsApp."
              className="min-h-[150px] w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
            />
          </label>

          <button
            type="button"
            onClick={onGenerateCompleteVideo || (() => {})}
            className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 md:w-auto"
          >
            Generate Complete AI Video
          </button>
        </div>
      </div>
    );
  }

  if (category === "Video AI" && tool === "Dance Animation") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">Dance Animation</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Animate a photo into a short Facebook-ready dance video.
        </p>

        <div className="mt-5 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="text-sm font-extrabold text-white">
              Upload Photo
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Upload one clear full-body or portrait photo.
            </p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/70 px-5 py-8 text-center transition hover:border-violet-400/50 hover:bg-slate-950/90">
              <Upload className="mb-3 h-7 w-7 text-violet-300" />

              <span className="text-sm font-extrabold text-white">
                Click to Upload
              </span>

              <span className="mt-1 text-xs font-medium text-slate-300">
                Upload a clear photo for animation.
              </span>

              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onDancingPhotoUpload}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                1. Dance Type
              </span>
              <select className={inputClass} defaultValue="TikTok Viral Dance">
                {[
                  "Afrobeats Dance",
                  "Amapiano Dance",
                  "Gengetone Dance",
                  "TikTok Viral Dance",
                  "Gospel Celebration Dance",
                  "Wedding Dance",
                  "Birthday Dance",
                  "Funny Meme Dance",
                  "Club Dance",
                  "Cultural Dance",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                2. Motion Style
              </span>
              <select className={inputClass} defaultValue="Energetic Dance">
                {[
                  "Subtle Motion",
                  "Energetic Dance",
                  "Fast Viral Moves",
                  "Smooth Body Movement",
                  "Camera Zoom Dance",
                  "Stage Performance",
                  "Street Dance",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                3. Music Style
              </span>
              <select className={inputClass} defaultValue="Afrobeats">
                {[
                  "Afrobeats",
                  "Amapiano",
                  "Gengetone",
                  "Bongo Flava",
                  "Gospel",
                  "Dancehall",
                  "Reggae",
                  "Hip Hop",
                  "Upload My Music",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                4. Output Format
              </span>
              <select className={inputClass} defaultValue="Facebook Reel">
                {[
                  "Facebook Feed",
                  "Facebook Reel",
                  "WhatsApp Status",
                  "Instagram Reel",
                  "TikTok",
                  "YouTube Shorts",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={onGenerateCompleteVideo || (() => {})}
            className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 md:w-auto"
          >
            Generate Complete AI Video
          </button>
        </div>
      </div>
    );
  }

  if (category === "Video AI" && tool === "AI Music Video Studio") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">AI Music Video Studio</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Create Facebook-ready AI music videos from your song or audio.
        </p>

        <div className="mt-5 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="text-sm font-extrabold text-white">
              1. Audio Source
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Use a song from AI Song Studio or upload your own audio.
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Use AI Song Studio Song",
                "Upload MP3",
                "Upload WAV",
                "Upload Audio File",
              ].map((source) => (
                <button
                  key={source}
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  {source}
                </button>
              ))}
            </div>

            <Input
              type="file"
              accept="audio/*"
              className="mt-4 rounded-xl border border-white/10 bg-[#0B1020] p-3 text-sm text-slate-200"
              onChange={_onMusicUpload}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                2. Video Style
              </span>
              <select className={inputClass} defaultValue="Performance">
                {[
                  "Performance",
                  "Live Concert",
                  "Stage Performance",
                  "Dance Crew",
                  "Street Performance",
                  "Club Performance",
                  "Choir Performance",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                3. Video Theme
              </span>
              <select className={inputClass} defaultValue="TikTok Viral">
                {[
                  "Love Story",
                  "Breakup Story",
                  "Birthday Celebration",
                  "Wedding Story",
                  "Friendship Story",
                  "Motivational Journey",
                  "Anime Music Video",
                  "TikTok Viral",
                  "Dance Challenge",
                  "Product Anthem",
                  "Brand Intro",
                  "Creator Intro",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                4. Visual Mood
              </span>
              <select className={inputClass} defaultValue="Energetic">
                {[
                  "Cinematic",
                  "Colorful",
                  "Dark Mood",
                  "Luxury",
                  "Romantic",
                  "Emotional",
                  "Energetic",
                  "Minimal",
                  "Street",
                  "Vintage",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                5. Output Format
              </span>
              <select className={inputClass} defaultValue="Facebook Reel">
                {[
                  "Facebook Feed",
                  "Facebook Reel",
                  "WhatsApp Status",
                  "Instagram Reel",
                  "TikTok",
                  "YouTube Shorts",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={onGenerateCompleteVideo || (() => {})}
            className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 md:w-auto"
          >
            Generate Complete AI Video
          </button>
        </div>
      </div>
    );
  }

  if (category === "Video AI" && tool === "Story Generator") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">Story Generator</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Create Facebook-ready AI storytelling videos from your idea.
        </p>

        <div className="mt-5 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                1. Story Type
              </span>
              <select className={inputClass} defaultValue="Motivational Story">
                {[
                  "Motivational Story",
                  "Love Story",
                  "Breakup Story",
                  "Friendship Story",
                  "Success Journey",
                  "Business Story",
                  "Inspirational Story",
                  "Faith Story",
                  "Bible Story",
                  "Testimony Story",
                  "Funny Story",
                  "Life Lesson Story",
                  "African Folktale",
                  "Children Story",
                  "Drama Story",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                2. Story Style
              </span>
              <select className={inputClass} defaultValue="Cinematic">
                {[
                  "Cinematic",
                  "Animated",
                  "Emotional",
                  "Documentary",
                  "Narrative Reel",
                  "TikTok Story",
                  "African Drama",
                  "Luxury Storytelling",
                  "Minimal Storytelling",
                  "Comic Style",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                3. Story Mood
              </span>
              <select className={inputClass} defaultValue="Inspirational">
                {[
                  "Inspirational",
                  "Emotional",
                  "Romantic",
                  "Sad",
                  "Happy",
                  "Funny",
                  "Suspense",
                  "Dark",
                  "Hopeful",
                  "Energetic",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                4. Output Format
              </span>
              <select className={inputClass} defaultValue="Facebook Reel">
                {[
                  "Facebook Feed",
                  "Facebook Reel",
                  "WhatsApp Status",
                  "Instagram Reel",
                  "TikTok",
                  "YouTube Shorts",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              5. Write Story Idea
            </span>
            <textarea
              placeholder="Example: A young man in Nairobi starts with nothing, works hard, and finally opens his dream business."
              className="min-h-[150px] w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
            />
          </label>

          <button
            type="button"
            onClick={onGenerateCompleteVideo || (() => {})}
            className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 md:w-auto"
          >
            Generate Complete AI Video
          </button>
        </div>
      </div>
    );
  }

  if (category === "Video AI" && tool === "Birthday Video") {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">Birthday Video</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Create Facebook-ready birthday celebration videos.
        </p>

        <div className="mt-5 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="text-sm font-extrabold text-white">
              Upload Birthday Photos
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-300">
              Upload birthday or celebration photos for your video.
            </p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/70 px-5 py-8 text-center transition hover:border-violet-400/50 hover:bg-slate-950/90">
              <Upload className="mb-3 h-7 w-7 text-violet-300" />

              <span className="text-sm font-extrabold text-white">
                Click to Upload
              </span>

              <span className="mt-1 text-xs font-medium text-slate-300">
                Upload one or more birthday photos.
              </span>

              <Input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onMediaUpload || (() => {})}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                1. Celebration Type
              </span>
              <select className={inputClass} defaultValue="Birthday Wishes">
                {[
                  "Birthday Wishes",
                  "Kids Birthday",
                  "Adult Birthday",
                  "Surprise Birthday",
                  "Romantic Birthday",
                  "Family Celebration",
                  "Friend Celebration",
                  "Church Birthday Tribute",
                  "Memorial Birthday Tribute",
                  "Luxury Birthday Party",
                  "Simple Birthday Greeting",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                2. Video Style
              </span>
              <select className={inputClass} defaultValue="Colorful Celebration">
                {[
                  "Slideshow",
                  "Cinematic",
                  "Animated Celebration",
                  "Luxury Celebration",
                  "Emotional Tribute",
                  "Fun Party Style",
                  "TikTok Birthday Style",
                  "Elegant Greeting",
                  "Colorful Celebration",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                3. Music Style
              </span>
              <select className={inputClass} defaultValue="Happy Birthday Song">
                {[
                  "Happy Birthday Song",
                  "Instrumental Celebration",
                  "Romantic Music",
                  "Kids Party Music",
                  "Gospel Celebration",
                  "Choir Tribute",
                  "Emotional Piano",
                  "Afrobeats Party",
                  "Amapiano Party",
                  "Upload My Music",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                4. Output Format
              </span>
              <select className={inputClass} defaultValue="Facebook Reel">
                {[
                  "Facebook Feed",
                  "Facebook Reel",
                  "WhatsApp Status",
                  "Instagram Reel",
                  "TikTok",
                  "YouTube Shorts",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              5. Write Birthday Message
            </span>
            <textarea
              placeholder="Example: Happy birthday Sarah! May your new year bring joy, success, and blessings."
              className="min-h-[150px] w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30"
            />
          </label>

          <button
            type="button"
            onClick={onGenerateCompleteVideo || (() => {})}
            className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 md:w-auto"
          >
            Generate Complete AI Video
          </button>
        </div>
      </div>
    );
  }

  if (
    category === "Video AI" &&
    (tool === "Birthday Video")
  ) {
    return (
      <div className={boxClass}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-extrabold">{tool}</h3>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          This workflow will use fal.ai generation. Its full input panel will be
          connected next.
        </p>
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
        This tool is coming soon.
      </p>
    </div>
  );
}
