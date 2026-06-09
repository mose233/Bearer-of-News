import React, { RefObject, useRef, useState } from "react";
import {
  Captions,
  Clapperboard,
  ImagePlus,
  Megaphone,
  Music,
  Newspaper,
  Sparkles,
  Upload,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiToolSelection } from "@/components/creator/AiToolLauncher";

import PhotoMusicVideoPanel from "@/components/creator/PhotoMusicVideoPanel";
import DancingPhotoPanel from "@/components/creator/DancingPhotoPanel";
import AIVideoStudioPanel from "@/components/creator/AIVideoStudioPanel";

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
  onGenerateCompleteVideo?: () => void;
  onAddEnhancedPhotoToTimeline?: (file: File, preview: string) => void;
};

const boxClass =
  "rounded-[1.5rem] border border-white/10 bg-[#111827] p-5 text-white shadow-creator";

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30";

const textareaClass =
  "min-h-[150px] w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-base font-semibold text-white outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30";

const enhancementFilters: Record<string, string> = {
  "Natural Glow": "brightness(1.08) contrast(1.08) saturate(1.12)",
  "Beauty Filter": "brightness(1.16) contrast(1.04) saturate(1.2) blur(0.2px)",
  "Studio Portrait Pro": "brightness(1.1) contrast(1.2) saturate(1.08)",
  "HD Sharp Focus": "brightness(1.05) contrast(1.28) saturate(1.15)",
  "Glow Up Look": "brightness(1.16) contrast(1.08) saturate(1.2)",
  "Younger Appearance":
    "brightness(1.18) contrast(1.03) saturate(1.12) blur(0.35px)",
  "Luxury Background": "brightness(1.04) contrast(1.22) saturate(1.18)",
  "Corporate Headshot": "brightness(1.06) contrast(1.18) saturate(1.05)",
  "TikTok Glow": "brightness(1.18) contrast(1.1) saturate(1.25)",
  "Instagram Ready": "brightness(1.12) contrast(1.14) saturate(1.2)",
  "Facebook DP Upgrade": "brightness(1.1) contrast(1.12) saturate(1.16)",
  "Product Ad Look": "brightness(1.08) contrast(1.25) saturate(1.2)",
  "Poster Design Look": "brightness(1.05) contrast(1.3) saturate(1.18)",
};

const pictureStyleOptions = [
  "Natural Glow",
  "Beauty Filter",
  "Studio Portrait Pro",
  "HD Sharp Focus",
  "Glow Up Look",
  "Younger Appearance",
  "Luxury Background",
  "Corporate Headshot",
  "TikTok Glow",
  "Instagram Ready",
  "Facebook DP Upgrade",
  "Product Ad Look",
  "Poster Design Look",
];

const outputFormats = [
  "Facebook Feed",
  "Facebook Reel",
  "WhatsApp Status",
  "Instagram Reel",
  "TikTok",
  "YouTube Shorts",
];

const languages = [
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
];

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
    label: "Africa",
    styles: [
      "Afrobeats",
      "Amapiano",
      "Bongo Flava",
      "Afro Fusion",
      "Afro R&B",
      "Dancehall",
      "Reggae",
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
      "Swahili Gospel Choir",
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

const songDurations = ["30 sec", "60 sec", "120 sec"];

function ToolHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-extrabold">{title}</h3>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
        {description}
      </p>
    </div>
  );
}

function UploadMediaBox({
  title,
  description,
  accept,
  multiple = true,
  onChange,
}: {
  title: string;
  description: string;
  accept: string;
  multiple?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
      <h4 className="text-sm font-extrabold text-white">{title}</h4>
      <p className="mt-1 text-xs leading-5 text-slate-300">{description}</p>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/70 px-5 py-8 text-center transition hover:border-violet-400/50 hover:bg-slate-950/90">
        <Upload className="mb-3 h-7 w-7 text-violet-300" />
        <span className="text-sm font-extrabold text-white">
          Click to Upload
        </span>
        <span className="mt-1 text-xs font-medium text-slate-300">
          {description}
        </span>
        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onChange || (() => {})}
        />
      </label>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: string[];
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold">{label}</span>
      <select
        className={inputClass}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

function PrimaryGenerateButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick || (() => alert("This workflow is ready for mock mode, but the generator is not connected yet."))}
      className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 md:w-auto"
    >
      {label}
    </button>
  );
}

function VideoTemplatePanel({
  tool,
  videoPrompt,
  setVideoPrompt,
  videoCreativeType,
  setVideoCreativeType,
  videoOutputFormat,
  setVideoOutputFormat,
  onMediaUpload,
  onGenerateCompleteVideo,
}: {
  tool: string;
  videoPrompt?: string;
  setVideoPrompt?: (value: string) => void;
  videoCreativeType?: string;
  setVideoCreativeType?: (value: string) => void;
  videoOutputFormat?: string;
  setVideoOutputFormat?: (value: string) => void;
  onMediaUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateCompleteVideo?: () => void;
}) {
  const [localVideoType, setLocalVideoType] = useState("Trending Reel");
  const [localVisualStyle, setLocalVisualStyle] = useState("Modern Social");
  const [localLanguage, setLocalLanguage] = useState("English");
  const [localOutputFormat, setLocalOutputFormat] = useState(
    videoOutputFormat || "Facebook Reel"
  );
  const [localMessage, setLocalMessage] = useState("");
  const [videoDraftStatus, setVideoDraftStatus] = useState("");

  const isSocial = [
    "Facebook Reel Maker",
    "TikTok Video Maker",
    "WhatsApp Status Maker",
    "Instagram Reel Maker",
    "YouTube Shorts Maker",
  ].includes(tool);

  const isBusiness = [
    "Product Ad Generator",
    "Business Promo Video",
    "Restaurant Promo Video",
    "Real Estate Promo Video",
    "Church Announcement Video",
    "Event Promotion Video",
    "Job Vacancy Video",
  ].includes(tool);

  const isNews = [
    "News Slideshow Video",
    "News Summary Video",
    "Educational Explainer Video",
  ].includes(tool);

  const isPersonal = [
    "Birthday Video",
    "Wedding Video",
    "Memorial Tribute Video",
    "Love Story Video",
    "Travel Video",
  ].includes(tool);

  const typeOptions = isSocial
    ? [
        "Trending Reel",
        "Fast Captions",
        "Photo Reel",
        "Story Style",
        "Product Reel",
        "Creator Update",
      ]
    : isBusiness
      ? [
          "Product Launch",
          "Discount Offer",
          "Business Promo",
          "Service Promo",
          "New Arrival",
          "Brand Awareness",
        ]
      : isNews
        ? [
            "Breaking News",
            "News Summary",
            "Public Update",
            "Explainer",
            "Community Update",
            "School Update",
          ]
        : isPersonal
          ? [
              "Birthday Wishes",
              "Wedding Memory",
              "Memorial Tribute",
              "Family Memory",
              "Romantic Story",
              "Travel Memory",
            ]
          : ["Motivational", "Story", "Quote", "Memory", "Announcement"];

  const messageLabel = isBusiness
    ? "6. Write Business / Product Details"
    : isNews
      ? "6. Write Headline / News Story"
      : isPersonal
        ? "6. Write Names / Message"
        : isSocial
          ? "6. Write Reel Topic / Caption"
          : "6. Write Message / Script";

  const messagePlaceholder = isBusiness
    ? "Example: Business: Mose Salon. Services: hair styling, nails, makeup. Location: Nairobi. WhatsApp: 0712 345 678. Offer: 20% discount this week."
    : isNews
      ? "Example: Headline: Heavy rains affect Nairobi roads. Story: Explain what happened, where it happened, and what people should know."
      : isPersonal
        ? "Example: Happy birthday Sarah! May your new year bring joy, success, and blessings. Add names, age, location, or special message."
        : isSocial
          ? "Example: Create a fast Facebook Reel about my new product launch. Make it catchy, short, and suitable for young buyers."
          : "Example: Create a motivational video about never giving up, hard work, and building a better future.";

  const buildDraftPrompt = () => {
    const cleanMessage = localMessage.trim() || videoPrompt?.trim() || "Create a social video.";

    return [
      `Tool: ${tool}`,
      `Video type: ${localVideoType}`,
      `Visual style: ${localVisualStyle}`,
      `Language: ${localLanguage}`,
      `Output format: ${localOutputFormat}`,
      "",
      "User instructions:",
      cleanMessage,
      "",
      "Create a short standard video using uploaded media, captions, music, voice narration, transitions and timeline export.",
    ].join("\n");
  };

  const handleGenerateVideoDraft = () => {
    const draftPrompt = buildDraftPrompt();

    setVideoPrompt?.(draftPrompt);
    setVideoCreativeType?.(localVideoType);
    setVideoOutputFormat?.(localOutputFormat);

    setVideoDraftStatus(
      `${tool} draft prepared. If you uploaded media, XNewsApp will use it in the timeline. If not, upload photos/videos first, then export/download from the main Export section.`
    );

    window.setTimeout(() => {
      onGenerateCompleteVideo?.();
    }, 80);
  };

  return (
    <div className={boxClass}>
      <ToolHeader
        title={tool}
        icon={
          isNews ? (
            <Newspaper className="h-5 w-5 text-violet-300" />
          ) : isBusiness ? (
            <Megaphone className="h-5 w-5 text-violet-300" />
          ) : (
            <Captions className="h-5 w-5 text-violet-300" />
          )
        }
        description="Create an affordable video using photos, AI images, captions, music, voice, transitions and timeline export."
      />

      <div className="mt-5 space-y-5">
        <UploadMediaBox
          title="1. Upload Photos or Videos"
          description="Upload images or short clips for this video. These become the scenes in your timeline."
          accept="image/*,video/*"
          multiple
          onChange={onMediaUpload}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="2. Video Type"
            value={localVideoType}
            options={typeOptions}
            onChange={setLocalVideoType}
          />
          <SelectField
            label="3. Visual Style"
            value={localVisualStyle}
            options={[
              "Modern Social",
              "Cinematic",
              "News Style",
              "Corporate",
              "Colorful",
              "Luxury",
              "Minimal",
              "African Market Style",
              "TikTok Viral",
            ]}
            onChange={setLocalVisualStyle}
          />
          <SelectField
            label="4. Language"
            value={localLanguage}
            options={languages}
            onChange={setLocalLanguage}
          />
          <SelectField
            label="5. Output Format"
            value={localOutputFormat}
            options={outputFormats}
            onChange={(value) => {
              setLocalOutputFormat(value);
              setVideoOutputFormat?.(value);
            }}
          />
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">
            {messageLabel}
          </span>
          <textarea
            value={localMessage}
            onChange={(e) => setLocalMessage(e.target.value)}
            className={textareaClass}
            placeholder={messagePlaceholder}
          />
        </label>

        {videoDraftStatus && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-bold leading-5 text-emerald-100">
            {videoDraftStatus}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <PrimaryGenerateButton
            label="Generate Video Draft"
            onClick={handleGenerateVideoDraft}
          />

          <button
            type="button"
            onClick={() => {
              const draftPrompt = buildDraftPrompt();
              setVideoPrompt?.(draftPrompt);
              setVideoCreativeType?.(localVideoType);
              setVideoOutputFormat?.(localOutputFormat);
              setVideoDraftStatus(
                `${tool} draft saved. Now upload/add media to the timeline, preview it, then use Export / Download Media.`
              );
            }}
            className="h-12 rounded-2xl bg-slate-700 px-5 text-sm font-extrabold text-white transition hover:bg-slate-600"
          >
            Save Draft to Timeline Workflow
          </button>
        </div>
      </div>
    </div>
  );
}

function CinematicPlaceholderPanel({
  tool,
  onMediaUpload,
  onGenerateCompleteVideo,
}: {
  tool: string;
  onMediaUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateCompleteVideo?: () => void;
}) {
  const needsScript = [
    "Talking Avatar",
    "AI News Presenter",
    "AI Spokesperson",
    "AI Teacher",
    "AI Influencer",
    "AI Customer Support Avatar",
    "Lip Sync Video",
  ].includes(tool);

  const needsAudio = [
    "Singing Animation",
    "Lip Sync Video",
    "Music Performance Video",
  ].includes(tool);

  return (
    <div className={boxClass}>
      <ToolHeader
        title={tool}
        icon={<Clapperboard className="h-5 w-5 text-amber-300" />}
        description="Cinematic AI is the premium motion-video workspace. For now this screen prepares a complete mock workflow; later fal.ai will replace the mock generator."
      />

      <div className="mt-5 space-y-5">
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-xs font-bold leading-5 text-amber-100">
          fal.ai key not connected yet. This workflow can collect inputs now and will connect to real AI video generation later.
        </div>

        <UploadMediaBox
          title="1. Upload Source Media"
          description="Upload a photo, image, or short video for this cinematic AI tool."
          accept="image/*,video/*"
          multiple={false}
          onChange={onMediaUpload}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="2. Motion Style"
            options={[
              "Subtle Motion",
              "Cinematic Camera Move",
              "Talking Head",
              "Dance Motion",
              "News Presenter",
              "Performance",
              "Movie Scene",
              "Trailer Style",
            ]}
          />
          <SelectField label="3. Output Format" options={outputFormats} />
          <SelectField
            label="4. Mood"
            options={[
              "Professional",
              "Energetic",
              "Cinematic",
              "Luxury",
              "Emotional",
              "Newsroom",
              "Funny",
              "Dramatic",
            ]}
          />
          <SelectField label="5. Language" options={languages} />
        </div>

        {needsAudio && (
          <Input
            type="file"
            accept="audio/*"
            className="rounded-xl border border-white/10 bg-[#0B1020] p-3 text-sm text-slate-200"
          />
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">
            {needsScript ? "6. Write Script" : "6. Extra Instructions"}
          </span>
          <textarea
            className={textareaClass}
            placeholder={
              needsScript
                ? "Example: Hello everyone, welcome to XNewsApp. Today I want to share this important update..."
                : "Optional: describe movement, background, camera direction, or visual style."
            }
          />
        </label>

        <PrimaryGenerateButton
          label="Generate Cinematic AI Draft"
          onClick={onGenerateCompleteVideo}
        />
      </div>
    </div>
  );
}

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
  onMusicUpload,
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
  onMediaUpload,
  onGenerateCompleteVideo,
  onAddEnhancedPhotoToTimeline,
}: DynamicToolWorkspaceProps) {
  const [picturePreview, setPicturePreview] = useState("");
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureFileName, setPictureFileName] = useState("");
  const [enhancementStyle, setEnhancementStyle] =
    useState("Studio Portrait Pro");
  const [hasPreviewedEnhancement, setHasPreviewedEnhancement] = useState(false);

  const [songLyrics, setSongLyrics] = useState("");
  const [songStyle, setSongStyle] = useState("Gengetone");
  const [songLanguage, setSongLanguage] = useState("Swahili");
  const [songDuration, setSongDuration] = useState("30 sec");
  const [songPreviewReady, setSongPreviewReady] = useState(false);
  const [songStatus, setSongStatus] = useState("");

  const musicVideoAudioInputRef = useRef<HTMLInputElement | null>(null);
  const [musicVideoAudioName, setMusicVideoAudioName] = useState("");
  const [musicVideoAudioSource, setMusicVideoAudioSource] = useState("");
  const [musicVideoAudioAccept, setMusicVideoAudioAccept] = useState("audio/*");
  const [pictureStrength, setPictureStrength] = useState("Medium");
  const [pictureUpscale, setPictureUpscale] = useState("Yes");
  const [portraitRole, setPortraitRole] = useState("Corporate");
  const [portraitBackground, setPortraitBackground] = useState("Studio");
  const [beautyLevel, setBeautyLevel] = useState("Natural");
  const [youngerAge, setYoungerAge] = useState("10 years");
  const [backgroundChoice, setBackgroundChoice] = useState("Office");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productOffer, setProductOffer] = useState("");
  const [productPhone, setProductPhone] = useState("");
  const [postHeadline, setPostHeadline] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventPhone, setEventPhone] = useState("");


  if (!selectedTool) {
    return (
      <div className={boxClass}>
        <ToolHeader
          title="Choose a tool to begin"
          icon={<Sparkles className="h-5 w-5 text-violet-300" />}
          description="Select Picture AI, Video AI, Music AI, or Cinematic AI above to open the right workspace."
        />
      </div>
    );
  }

  const { category, tool } = selectedTool;


  const handleAddEnhancedPhotoToTimeline = () => {
    if (!pictureFile || !picturePreview) {
      alert("Please upload a photo first.");
      return;
    }

    if (!hasPreviewedEnhancement) {
      alert("Please generate the enhanced photo first.");
      return;
    }

    if (!onAddEnhancedPhotoToTimeline) {
      alert("Timeline connection is not ready.");
      return;
    }

    onAddEnhancedPhotoToTimeline(pictureFile, picturePreview);
    alert("Enhanced photo added to timeline.");
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
      `${songStyle} song preview prepared in ${songLanguage} for ${songDuration}.`
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
    link.download = "xnewsapp-ai-song-lyrics.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openMusicVideoAudioPicker = (source: string, accept: string) => {
    setMusicVideoAudioSource(source);
    setMusicVideoAudioAccept(accept);
    window.setTimeout(() => musicVideoAudioInputRef.current?.click(), 0);
  };

  const handleUseSongStudioSong = () => {
    if (!songPreviewReady || !songLyrics.trim()) {
      alert(
        "Please create a song idea in AI Song Studio first. For real audio, upload MP3 or WAV."
      );
      return;
    }

    setMusicVideoAudioSource("AI Song Studio Song");
    setMusicVideoAudioName(`${songStyle} song idea (${songLanguage})`);
    alert("AI Song Studio song idea selected.");
  };

  const handleMusicVideoAudioUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMusicVideoAudioName(file.name);
    setMusicVideoAudioSource((current) => current || "Uploaded Audio");
    onMusicUpload(e);
  };

  if (category === "Picture AI") {
    const filterClass = enhancementFilters[enhancementStyle];

    const isPhotoEnhancer = tool === "Photo Enhancer";
    const isStudioPortrait = tool === "Studio Portrait";
    const isBeautyGlow = tool === "Beauty Glow";
    const isYoungerLook = tool === "Younger Look";
    const isBackgroundChanger = tool === "Background Changer";
    const isProductAdImage = tool === "Product Ad Image";
    const isFacebookPostImage = tool === "Facebook Post Image";
    const isPosterFlyer = tool === "Poster / Flyer";

    const pictureDescription = isPhotoEnhancer
      ? "Improve photo quality, sharpness, lighting and color before adding it to the timeline."
      : isStudioPortrait
        ? "Create a professional portrait look for business, profile, ID, or public-facing content."
        : isBeautyGlow
          ? "Apply a social-media beauty glow with smoother lighting and a clean polished look."
          : isYoungerLook
            ? "Create a youthful mock transformation effect before adding the photo to the timeline."
            : isBackgroundChanger
              ? "Prepare a background-change mock preview for office, studio, beach, Nairobi, or transparent-style content."
              : isProductAdImage
                ? "Turn a product photo into a simple marketing image with product details and offer text."
                : isFacebookPostImage
                  ? "Create a Facebook-ready post image with a headline and short description."
                  : isPosterFlyer
                    ? "Create a poster or flyer mockup with event details, venue, date, and contact."
                    : "Upload a photo, choose a style, preview the result, then add it to the timeline.";

    const generateLabel = isProductAdImage
      ? "Generate Product Ad Image"
      : isFacebookPostImage
        ? "Generate Facebook Post Image"
        : isPosterFlyer
          ? "Generate Poster / Flyer"
          : isBackgroundChanger
            ? "Generate Background Preview"
            : isStudioPortrait
              ? "Generate Studio Portrait"
              : isBeautyGlow
                ? "Generate Beauty Glow"
                : isYoungerLook
                  ? "Generate Younger Look"
                  : "Generate Enhanced Photo";

    return (
      <div className={boxClass}>
        <ToolHeader
          title={tool}
          icon={<ImagePlus className="h-5 w-5 text-pink-300" />}
          description={`${pictureDescription} Export/download later from the main Export section.`}
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/60 px-5 py-8 text-center transition hover:border-pink-400/50 hover:bg-slate-950/80">
            <Upload className="mb-3 h-7 w-7 text-pink-300" />
            <span className="text-sm font-extrabold">Upload Photo</span>
            <span className="mt-1 text-xs font-medium text-slate-300">
              Portrait, product, poster, flyer, social post, or creative image
            </span>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (picturePreview) URL.revokeObjectURL(picturePreview);
                setPictureFile(file);
                setPicturePreview(URL.createObjectURL(file));
                setPictureFileName(file.name);
                setHasPreviewedEnhancement(false);
              }}
            />
          </label>

          <SelectField
            label="Enhancement / Design Style"
            value={enhancementStyle}
            options={pictureStyleOptions}
            onChange={(value) => {
              setEnhancementStyle(value);
              setHasPreviewedEnhancement(false);
            }}
          />
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/50 p-4">
          <h4 className="mb-4 text-sm font-extrabold text-white">
            Tool Settings
          </h4>

          {isPhotoEnhancer && (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Enhancement Strength"
                value={pictureStrength}
                options={["Low", "Medium", "High"]}
                onChange={setPictureStrength}
              />
              <SelectField
                label="HD Upscale"
                value={pictureUpscale}
                options={["Yes", "No"]}
                onChange={setPictureUpscale}
              />
            </div>
          )}

          {isStudioPortrait && (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Portrait Style"
                value={portraitRole}
                options={[
                  "Corporate",
                  "CEO",
                  "Lawyer",
                  "Doctor",
                  "Teacher",
                  "Politician",
                  "Passport",
                  "LinkedIn",
                ]}
                onChange={setPortraitRole}
              />
              <SelectField
                label="Background"
                value={portraitBackground}
                options={["Office", "Studio", "White", "Blue", "Luxury", "Newsroom"]}
                onChange={setPortraitBackground}
              />
            </div>
          )}

          {isBeautyGlow && (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Beauty Level"
                value={beautyLevel}
                options={["Natural", "Medium", "High"]}
                onChange={setBeautyLevel}
              />
              <SelectField
                label="Beauty Focus"
                value={enhancementStyle}
                options={[
                  "Natural Glow",
                  "Beauty Filter",
                  "Glow Up Look",
                  "TikTok Glow",
                  "Instagram Ready",
                ]}
                onChange={(value) => {
                  setEnhancementStyle(value);
                  setHasPreviewedEnhancement(false);
                }}
              />
            </div>
          )}

          {isYoungerLook && (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Age Reduction"
                value={youngerAge}
                options={["5 years", "10 years", "15 years", "20 years"]}
                onChange={setYoungerAge}
              />
              <SelectField
                label="Look Style"
                value={enhancementStyle}
                options={[
                  "Younger Appearance",
                  "Natural Glow",
                  "Glow Up Look",
                  "Instagram Ready",
                ]}
                onChange={(value) => {
                  setEnhancementStyle(value);
                  setHasPreviewedEnhancement(false);
                }}
              />
            </div>
          )}

          {isBackgroundChanger && (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="New Background"
                value={backgroundChoice}
                options={[
                  "Office",
                  "Beach",
                  "Dubai",
                  "Nairobi CBD",
                  "Luxury House",
                  "Nature",
                  "News Studio",
                  "Transparent",
                ]}
                onChange={setBackgroundChoice}
              />
              <SelectField
                label="Blend Style"
                value={enhancementStyle}
                options={[
                  "Luxury Background",
                  "Corporate Headshot",
                  "Natural Glow",
                  "Poster Design Look",
                ]}
                onChange={(value) => {
                  setEnhancementStyle(value);
                  setHasPreviewedEnhancement(false);
                }}
              />
            </div>
          )}

          {isProductAdImage && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">
                  Product Name
                </span>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Example: Samsung A55"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">
                  Price
                </span>
                <Input
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="Example: KSh 45,000"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">
                  Offer Text
                </span>
                <Input
                  value={productOffer}
                  onChange={(e) => setProductOffer(e.target.value)}
                  placeholder="Example: 20% OFF this week"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">
                  Phone / WhatsApp
                </span>
                <Input
                  value={productPhone}
                  onChange={(e) => setProductPhone(e.target.value)}
                  placeholder="Example: 0712 345 678"
                  className={inputClass}
                />
              </label>
            </div>
          )}

          {isFacebookPostImage && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">
                  Headline
                </span>
                <Input
                  value={postHeadline}
                  onChange={(e) => setPostHeadline(e.target.value)}
                  placeholder="Example: New Offer This Weekend"
                  className={inputClass}
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-extrabold">
                  Description
                </span>
                <textarea
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="Example: Visit us today for quality service and affordable prices."
                  className={textareaClass}
                />
              </label>
            </div>
          )}

          {isPosterFlyer && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">
                  Event Name
                </span>
                <Input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Example: Youth Conference"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">
                  Date / Time
                </span>
                <Input
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="Example: 12 July, 2 PM"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">
                  Venue
                </span>
                <Input
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  placeholder="Example: Nairobi CBD"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-extrabold">
                  Phone / Contact
                </span>
                <Input
                  value={eventPhone}
                  onChange={(e) => setEventPhone(e.target.value)}
                  placeholder="Example: 0712 345 678"
                  className={inputClass}
                />
              </label>
            </div>
          )}

          {!isPhotoEnhancer &&
            !isStudioPortrait &&
            !isBeautyGlow &&
            !isYoungerLook &&
            !isBackgroundChanger &&
            !isProductAdImage &&
            !isFacebookPostImage &&
            !isPosterFlyer && (
              <p className="text-sm font-medium leading-6 text-slate-300">
                This Picture AI tool uses the selected enhancement/design style.
              </p>
            )}
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
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={picturePreview}
                    alt="Enhanced preview"
                    className="max-h-[380px] w-full rounded-2xl object-cover"
                    style={{ filter: filterClass }}
                  />

                  {(isProductAdImage ||
                    isFacebookPostImage ||
                    isPosterFlyer) && (
                    <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/70 p-3 text-white backdrop-blur">
                      {isProductAdImage && (
                        <>
                          <p className="text-base font-extrabold">
                            {productName || "Product Name"}
                          </p>
                          <p className="text-sm font-bold text-amber-200">
                            {productPrice || "Price"}
                          </p>
                          <p className="text-xs font-semibold">
                            {productOffer || "Special offer"}
                          </p>
                          <p className="text-xs font-semibold text-cyan-200">
                            {productPhone || "Phone / WhatsApp"}
                          </p>
                        </>
                      )}

                      {isFacebookPostImage && (
                        <>
                          <p className="text-base font-extrabold">
                            {postHeadline || "Facebook Post Headline"}
                          </p>
                          <p className="text-xs font-semibold">
                            {postDescription ||
                              "Short Facebook post description"}
                          </p>
                        </>
                      )}

                      {isPosterFlyer && (
                        <>
                          <p className="text-base font-extrabold">
                            {eventName || "Event Name"}
                          </p>
                          <p className="text-xs font-semibold text-amber-200">
                            {eventDate || "Date / Time"}
                          </p>
                          <p className="text-xs font-semibold">
                            {eventVenue || "Venue"}
                          </p>
                          <p className="text-xs font-semibold text-cyan-200">
                            {eventPhone || "Contact"}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {isBackgroundChanger && (
                    <div className="absolute right-3 top-3 rounded-full bg-pink-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg">
                      {backgroundChoice}
                    </div>
                  )}

                  {isStudioPortrait && (
                    <div className="absolute right-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg">
                      {portraitRole} • {portraitBackground}
                    </div>
                  )}

                  {isBeautyGlow && (
                    <div className="absolute right-3 top-3 rounded-full bg-fuchsia-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg">
                      Beauty: {beautyLevel}
                    </div>
                  )}

                  {isYoungerLook && (
                    <div className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg">
                      Younger: {youngerAge}
                    </div>
                  )}

                  {isPhotoEnhancer && (
                    <div className="absolute right-3 top-3 rounded-full bg-slate-800/90 px-3 py-1 text-xs font-extrabold text-white shadow-lg">
                      {pictureStrength} • HD {pictureUpscale}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-center">
                  <p className="text-sm font-medium leading-6 text-slate-300">
                    Click {generateLabel} to see the {tool} result.
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
            {generateLabel}
          </Button>

          <Button
            type="button"
            disabled={!picturePreview || !hasPreviewedEnhancement}
            onClick={handleAddEnhancedPhotoToTimeline}
            className="h-12 rounded-2xl bg-blue-600 px-5 font-extrabold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            Add to Timeline
          </Button>
        </div>
      </div>
    );
  }
  if (category === "Music AI" && tool === "AI Song Studio") {
    return (
      <div className={boxClass}>
        <ToolHeader
          title="AI Song Studio"
          icon={<Music className="h-5 w-5 text-cyan-300" />}
          description="Write lyrics, choose a style, select language and duration, then prepare a song request for your video."
        />

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

            <SelectField
              label="3. Choose language"
              value={songLanguage}
              options={songLanguages}
              onChange={(value) => {
                setSongLanguage(value);
                setSongPreviewReady(false);
                setSongStatus("");
              }}
            />

            <SelectField
              label="4. Choose duration"
              value={songDuration}
              options={songDurations}
              onChange={(value) => {
                setSongDuration(value);
                setSongPreviewReady(false);
                setSongStatus("");
              }}
            />
          </div>

          <PrimaryGenerateButton label="Generate Song" onClick={handleGenerateSong} />

          {songStatus && (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-bold leading-5 text-emerald-100">
              {songStatus}
            </div>
          )}

          {songPreviewReady && (
            <div className="grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() =>
                  alert("Song idea ready. Upload real audio in AI Music Video Studio when available.")
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
                Download Lyrics
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
          )}
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

  if (category === "Video AI") {
    return (
      <VideoTemplatePanel
        tool={tool}
        videoPrompt={videoPrompt}
        setVideoPrompt={setVideoPrompt}
        videoCreativeType={videoCreativeType}
        setVideoCreativeType={setVideoCreativeType}
        videoOutputFormat={videoOutputFormat}
        setVideoOutputFormat={setVideoOutputFormat}
        onMediaUpload={onMediaUpload}
        onGenerateCompleteVideo={onGenerateCompleteVideo}
      />
    );
  }

  if (category === "Cinematic AI" && tool === "Text to Video") {
    return <AIVideoStudioPanel />;
  }

  if (category === "Cinematic AI" && tool === "Dance Animation") {
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

  if (category === "Cinematic AI" && tool === "AI Music Video Studio") {
    return (
      <div className={boxClass}>
        <ToolHeader
          title="AI Music Video Studio"
          icon={<Music className="h-5 w-5 text-violet-300" />}
          description="Create Facebook-ready AI music videos from your song or audio."
        />

        <div className="mt-5 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <h4 className="text-sm font-extrabold text-white">1. Audio Source</h4>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Use a song from AI Song Studio or upload your own audio.
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleUseSongStudioSong}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                Use AI Song Studio Song
              </button>
              <button
                type="button"
                onClick={() => openMusicVideoAudioPicker("MP3 Upload", "audio/mpeg,.mp3")}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                Upload MP3
              </button>
              <button
                type="button"
                onClick={() => openMusicVideoAudioPicker("WAV Upload", "audio/wav,.wav")}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                Upload WAV
              </button>
              <button
                type="button"
                onClick={() => openMusicVideoAudioPicker("Audio File Upload", "audio/*")}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                Upload Audio File
              </button>
            </div>

            <Input
              ref={musicVideoAudioInputRef}
              type="file"
              accept={musicVideoAudioAccept}
              className="hidden"
              onChange={handleMusicVideoAudioUpload}
            />

            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0B1020] p-3 text-xs font-semibold leading-5 text-slate-300">
              <span className="block font-extrabold text-white">Selected audio</span>
              {musicVideoAudioName ? (
                <span>
                  {musicVideoAudioName} {musicVideoAudioSource ? `• ${musicVideoAudioSource}` : ""}
                </span>
              ) : (
                <span>No audio selected yet.</span>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="2. Video Style"
              options={["Performance", "Live Concert", "Stage Performance", "Dance Crew", "Street Performance", "Club Performance", "Choir Performance"]}
            />
            <SelectField
              label="3. Video Theme"
              options={["TikTok Viral", "Love Story", "Breakup Story", "Birthday Celebration", "Wedding Story", "Friendship Story", "Motivational Journey", "Anime Music Video", "Dance Challenge", "Product Anthem", "Brand Intro", "Creator Intro"]}
            />
            <SelectField
              label="4. Visual Mood"
              options={["Energetic", "Cinematic", "Colorful", "Dark Mood", "Luxury", "Romantic", "Emotional", "Minimal", "Street", "Vintage"]}
            />
            <SelectField label="5. Output Format" options={outputFormats} />
          </div>

          <PrimaryGenerateButton
            label="Generate Music Video Draft"
            onClick={onGenerateCompleteVideo}
          />
        </div>
      </div>
    );
  }

  if (category === "Cinematic AI") {
    return (
      <CinematicPlaceholderPanel
        tool={tool}
        onMediaUpload={onMediaUpload}
        onGenerateCompleteVideo={onGenerateCompleteVideo}
      />
    );
  }

  return (
    <div className={boxClass}>
      <ToolHeader
        title="Tool panel not configured"
        icon={<Sparkles className="h-5 w-5 text-violet-300" />}
        description={`No workspace found for ${category} / ${tool}.`}
      />
    </div>
  );
}
