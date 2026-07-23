import React, { RefObject, useRef, useState } from "react";
import {
  Captions,
  ChevronDown,
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
import TextFontStudio from "@/components/creator/TextFontStudio.tsx";
import MusicStudioPanel from "@/components/creator/MusicStudioPanel";

import { DanceStyle } from "@/lib/ai/videoProviders";
import { MultiScenePlan } from "@/lib/creator/multiSceneGenerator";
import { getFontByName } from "@/lib/creator/fontLibrary";

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
  onAddEnhancedPhotoToTimeline?: (
    file: File,
    preview: string,
    durationSeconds?: number
  ) => void;
  onVideoDurationChange?: (durationSeconds: number) => void;

  onRequestPayment?: (
    amount: string,
    onSuccess: () => void
  ) => void;
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

const africanVoiceStyles = [
  "Warm Female Voice",
  "Warm Male Voice",
  "Kenyan Radio Host",
  "Nigerian Narrator",
  "South African Presenter",
  "News Presenter",
  "Motivational Speaker",
  "Luxury Commercial Voice",
  "Business Presenter",
  "Gospel Female Voice",
  "Gospel Male Voice",
  "Afrobeats Male Voice",
  "Afrobeats Female Voice",
  "Story Teller",
];

const greetingOccasions = [
  "Birthday",
  "Wedding",
  "Anniversary",
  "Graduation",
  "Promotion",
  "Mother's Day",
  "Father's Day",
  "Eid",
  "Christmas",
  "New Year",
];

const greetingMusicStyles = [
  "Happy Celebration",
  "Warm Emotional",
  "Inspirational",
  "Afrobeats Soft",
  "Gospel Celebration",
  "Luxury Piano",
];

const tributeMusicStyles = [
  "Soft Piano",
  "Gospel Tribute",
  "Instrumental",
  "Choir",
  "Soft Strings",
  "Peaceful Worship",
];

const premiumVideoTools = [
  // Premium Video AI
  "AI Greeting Video Studio",
  "Business Promo Video",
  "Product Ad Generator",
  "Real Estate Video",
  "Event Promotion Video",
  "Obituary / Tribute Studio",
  "News Summary Video",
  "Educational Explainer Video",
  "Story Generator",

  // Cinematic AI
  "Talking Avatar",
  "Singing Animation",
  "Dance Animation",
  "Lip Sync Video",
  "AI Music Video Studio",
  "Photo to Video",
  "Image to Video",
  "AI News Presenter",
  "AI Spokesperson",
  "Virtual Influencer",
  "Story-to-Video Generator",
  "Short Film Generator",
  "Movie Scene Generator",
  "Trailer Generator",
  "Text to Video",
  "Wedding Cinematic Film",
  "Travel Cinematic Film",
  "Real Estate Cinematic Tour",
  "Product Commercial Generator",
  "Church Sermon Cinematic",
  "Motivational Cinematic Video",
  "Documentary Generator",
];

const ordinaryVideoPrices = [
  ["10 Seconds", "$0.70"],
  ["20 Seconds", "$1.20"],
  ["30 Seconds", "$1.70"],
  ["40 Seconds", "$2.20"],
  ["50 Seconds", "$2.70"],
  ["60 Seconds", "$3.20"],
];

const premiumVideoPrices = [
  ["10 Seconds", "$0.72"],
  ["20 Seconds", "$1.22"],
  ["30 Seconds", "$1.72"],
  ["40 Seconds", "$2.22"],
  ["50 Seconds", "$2.72"],
  ["60 Seconds", "$3.22"],
];

function getVideoPricingLabel(tool: string) {
  return premiumVideoTools.includes(tool)
    ? "🎬 Premium Video AI"
    : "🎬 Ordinary Video AI";
}

function getVideoPricingList(tool: string) {
  return premiumVideoTools.includes(tool)
    ? premiumVideoPrices
    : ordinaryVideoPrices;
}

function getDurationSecondsFromLabel(duration: string) {
  const value = Number.parseInt(duration, 10);
  return Number.isFinite(value) ? value : 10;
}

function VideoPricingCard({
  tool,
  selectedDuration,
  onDurationChange,
}: {
  tool: string;
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const prices = getVideoPricingList(tool);
  const selectedPrice =
    prices.find(([duration]) => duration === selectedDuration)?.[1] ||
    prices[0][1];

  return (
    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-emerald-300">
            {getVideoPricingLabel(tool)}
          </div>

          <div className="mt-2 text-xs font-bold text-emerald-50">
            {selectedDuration} ........ {selectedPrice}
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-emerald-200 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 space-y-1 border-t border-emerald-400/20 pt-3">
          {prices.map(([duration, price]) => (
            <button
              key={duration}
              type="button"
              onClick={() => {
                onDurationChange(duration);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs font-bold transition ${
                selectedDuration === duration
                  ? "bg-emerald-400/20 text-white"
                  : "text-emerald-50 hover:bg-white/10"
              }`}
            >
              <span>{duration}</span>
              <span>{price}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
          Upload Media
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
  selectedCreatorFont,
  setSelectedCreatorFont,
  onMediaUpload: _onMediaUpload,
  onGenerateCompleteVideo,
  onAddEnhancedPhotoToTimeline,
  onVideoDurationChange,
}: {
  tool: string;
  videoPrompt?: string;
  setVideoPrompt?: (value: string) => void;
  videoCreativeType?: string;
  setVideoCreativeType?: (value: string) => void;
  videoOutputFormat?: string;
  setVideoOutputFormat?: (value: string) => void;
  selectedCreatorFont: string;
  setSelectedCreatorFont: (value: string) => void;
  onMediaUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateCompleteVideo?: () => void;
  onAddEnhancedPhotoToTimeline?: (file: File, preview: string, durationSeconds?: number) => void;
  onVideoDurationChange?: (durationSeconds: number) => void;
}) {
  const [localVideoType, setLocalVideoType] = useState("Trending Reel");
  const [localVisualStyle, setLocalVisualStyle] = useState("Modern Social");
  const [localLanguage, setLocalLanguage] = useState("English");
  const [localOutputFormat, setLocalOutputFormat] = useState(
    videoOutputFormat || "Facebook Reel"
  );
  const [localMessage, setLocalMessage] = useState("");
  const [videoDraftStatus, setVideoDraftStatus] = useState("");
  const [selectedVideoDuration, setSelectedVideoDuration] = useState("10 Seconds");
  const [stagedVideoFiles, setStagedVideoFiles] = useState<File[]>([]);
  const [stagedVideoFileNames, setStagedVideoFileNames] = useState<string[]>([]);

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
      `Video duration: ${selectedVideoDuration}`,
      `Selected font: ${selectedCreatorFont}`,
      "",
      "User instructions:",
      cleanMessage,
      "",
      "Create a short standard video using uploaded media, captions, music, voice narration, transitions and timeline export.",
    ].join("\n");
  };

  const handleStageVideoMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setStagedVideoFiles(files);
    setStagedVideoFileNames(files.map((file) => file.name));
    setVideoDraftStatus(
      `${files.length} file${files.length === 1 ? "" : "s"} uploaded. Click Generate Video to add them to the preview and timeline.`
    );
  };

  const addStagedVideoMediaToTimeline = () => {
    if (stagedVideoFiles.length === 0) {
      return true;
    }

    if (!onAddEnhancedPhotoToTimeline) {
      alert("Timeline connection is not ready.");
      return false;
    }

    stagedVideoFiles.forEach((file) => {
      const preview = URL.createObjectURL(file);
      onAddEnhancedPhotoToTimeline(file, preview);
    });

    return true;
  };

  const handleGenerateVideoDraft = () => {
    const draftPrompt = buildDraftPrompt();
    const addedMedia = addStagedVideoMediaToTimeline();

    if (!addedMedia) return;

    setVideoPrompt?.(draftPrompt);
    setVideoCreativeType?.(localVideoType);
    setVideoOutputFormat?.(localOutputFormat);

    setVideoDraftStatus(
      `${tool} ${selectedVideoDuration} video prepared. ${stagedVideoFiles.length > 0 ? "Uploaded media has been added to the preview and timeline. " : ""}Preview it, then export/download from the main Export section.`
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
        description="Create videos with photos, captions, music, voice and export."
      />

      <div className="mt-5 space-y-5">
        <VideoPricingCard
          tool={tool}
          selectedDuration={selectedVideoDuration}
          onDurationChange={(duration) => {
            setSelectedVideoDuration(duration);
            onVideoDurationChange?.(getDurationSecondsFromLabel(duration));
          }}
        />

        <UploadMediaBox
          title="1. Upload Photos or Videos"
          description="Photos or videos for your project."
          accept="image/*,video/*"
          multiple
          onChange={handleStageVideoMedia}
        />

        {stagedVideoFileNames.length > 0 && (
          <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 text-xs font-bold leading-5 text-blue-100">
            Uploaded and ready: {stagedVideoFileNames.join(", ")}. Click Generate Video to show it in preview.
          </div>
        )}

        <TextFontStudio
          tool={tool}
          selectedFont={selectedCreatorFont}
          onFontChange={setSelectedCreatorFont}
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
            label="Generate Video"
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
                `${tool} settings saved. Upload media, then click Generate Video to add it to preview and timeline.`
              );
            }}
            className="h-12 rounded-2xl bg-slate-700 px-5 text-sm font-extrabold text-white transition hover:bg-slate-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function LifeEventVideoPanel({
  tool,
  videoPrompt,
  setVideoPrompt,
  setVideoCreativeType,
  videoOutputFormat,
  setVideoOutputFormat,
  selectedCreatorFont,
  setSelectedCreatorFont,
  onMediaUpload: _onMediaUpload,
  onGenerateCompleteVideo,
  onAddEnhancedPhotoToTimeline,
  onVideoDurationChange,
}: {
  tool: string;
  videoPrompt?: string;
  setVideoPrompt?: (value: string) => void;
  setVideoCreativeType?: (value: string) => void;
  videoOutputFormat?: string;
  setVideoOutputFormat?: (value: string) => void;
  selectedCreatorFont: string;
  setSelectedCreatorFont: (value: string) => void;
  onMediaUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateCompleteVideo?: () => void;
  onAddEnhancedPhotoToTimeline?: (file: File, preview: string, durationSeconds?: number) => void;
  onVideoDurationChange?: (durationSeconds: number) => void;
}) {
  const isTribute = tool === "Obituary / Tribute Studio";
  const [occasion, setOccasion] = useState("Birthday");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [passingDate, setPassingDate] = useState("");
  const [tributeMessage, setTributeMessage] = useState("");
  const [language, setLanguage] = useState("English");
  const [voiceStyle, setVoiceStyle] = useState(
    isTribute ? "Gospel Female Voice" : "Warm Female Voice"
  );
  const [musicStyle, setMusicStyle] = useState(
    isTribute ? "Soft Piano" : "Happy Celebration"
  );
  const [outputFormat, setOutputFormat] = useState(
    videoOutputFormat || "Facebook Reel"
  );
  const [draftStatus, setDraftStatus] = useState("");
  const [selectedVideoDuration, setSelectedVideoDuration] = useState("10 Seconds");
  const [stagedLifeEventFiles, setStagedLifeEventFiles] = useState<File[]>([]);
  const [stagedLifeEventFileNames, setStagedLifeEventFileNames] = useState<string[]>([]);

  const buildLifeEventPrompt = () => {
    if (isTribute) {
      return [
        "Tool: Obituary / Tribute Studio",
        `Full name: ${fullName.trim() || "Not provided"}`,
        `Birth date: ${birthDate.trim() || "Not provided"}`,
        `Date of passing: ${passingDate.trim() || "Not provided"}`,
        `Language: ${language}`,
        `Voice style: ${voiceStyle}`,
        `Music style: ${musicStyle}`,
        `Output format: ${outputFormat}`,
      `Video duration: ${selectedVideoDuration}`,
        `Video duration: ${selectedVideoDuration}`,
        `Selected font: ${selectedCreatorFont}`,
        "",
        "Tribute message:",
        tributeMessage.trim() ||
          videoPrompt?.trim() ||
          "Create a respectful memorial tribute video with photos, soft music, captions and voice narration.",
        "",
        "Create a respectful memorial slideshow video using uploaded photos, calm transitions, tribute captions, soft music and voice narration. Avoid sensational effects. Keep it dignified and comforting.",
      ].join("\n");
    }

    return [
      "Tool: AI Greeting Video Studio",
      `Occasion: ${occasion}`,
      `Recipient name: ${recipientName.trim() || "Not provided"}`,
      `Sender name: ${senderName.trim() || "Not provided"}`,
      `Language: ${language}`,
      `Voice style: ${voiceStyle}`,
      `Music style: ${musicStyle}`,
      `Output format: ${outputFormat}`,
      `Selected font: ${selectedCreatorFont}`,
      "",
      "Personal message:",
      personalMessage.trim() ||
        videoPrompt?.trim() ||
        "Create a warm personalized greeting video with photos, captions, music and voice narration.",
      "",
      "Create a personalized greeting video using uploaded photos, warm captions, background music, voice narration, clean transitions and a social-media-ready ending.",
    ].join("\n");
  };

  const handleStageLifeEventMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setStagedLifeEventFiles(files);
    setStagedLifeEventFileNames(files.map((file) => file.name));
    setDraftStatus(
      `${files.length} file${files.length === 1 ? "" : "s"} uploaded. Click ${
        isTribute ? "Generate Tribute Video" : "Generate Greeting Video"
      } to add them to preview and timeline.`
    );
  };

  const addStagedLifeEventMediaToTimeline = () => {
    if (stagedLifeEventFiles.length === 0) {
      return true;
    }

    if (!onAddEnhancedPhotoToTimeline) {
      alert("Timeline connection is not ready.");
      return false;
    }

    stagedLifeEventFiles.forEach((file) => {
      const preview = URL.createObjectURL(file);
      onAddEnhancedPhotoToTimeline(file, preview);
    });

    return true;
  };

  const handlePrepareDraft = (shouldGenerate = false) => {
    const draftPrompt = buildLifeEventPrompt();

    if (shouldGenerate) {
      const addedMedia = addStagedLifeEventMediaToTimeline();

      if (!addedMedia) return;
    }

    setVideoPrompt?.(draftPrompt);
    setVideoCreativeType?.(isTribute ? "Memorial Tribute" : occasion);
    setVideoOutputFormat?.(outputFormat);

    setDraftStatus(
      isTribute
        ? `Tribute ${selectedVideoDuration} video prepared. ${stagedLifeEventFiles.length > 0 && shouldGenerate ? "Uploaded media has been added to the preview and timeline. " : ""}Preview the timeline, then export/download the MP4.`
        : `Greeting ${selectedVideoDuration} video prepared. ${stagedLifeEventFiles.length > 0 && shouldGenerate ? "Uploaded media has been added to the preview and timeline. " : ""}Preview the timeline, then export/download the MP4.`
    );

    if (shouldGenerate) {
      window.setTimeout(() => {
        onGenerateCompleteVideo?.();
      }, 80);
    }
  };

  return (
    <div className={boxClass}>
      <ToolHeader
        title={tool}
        icon={
          isTribute ? (
            <Captions className="h-5 w-5 text-violet-300" />
          ) : (
            <Megaphone className="h-5 w-5 text-violet-300" />
          )
        }
        description={
          isTribute
            ? "Create memorial tribute videos with photos, captions, music, voice and export."
            : "Create personalized greeting videos with photos, captions, music, voice and export."
        }
      />

      <div className="mt-5 space-y-5">
        <VideoPricingCard
          tool={tool}
          selectedDuration={selectedVideoDuration}
          onDurationChange={(duration) => {
            setSelectedVideoDuration(duration);
            onVideoDurationChange?.(getDurationSecondsFromLabel(duration));
          }}
        />

        <UploadMediaBox
  title={isTribute ? "Upload Tribute Photos" : "Upload Photos or Videos"}
  description={
    isTribute
      ? "Tap to choose photos."
      : "Tap to choose photos or videos."
  }
  accept="image/*,video/*"
  multiple
  onChange={handleStageLifeEventMedia}
/>

<div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
  <h4 className="mb-3 text-sm font-bold text-white">
    Uploaded Media
  </h4>

  {stagedLifeEventFileNames.length > 0 ? (
    <>
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-center text-sm text-slate-200">
        📷 {stagedLifeEventFileNames.length} file(s) selected
      </div>

      <div className="mt-3 flex items-center justify-center rounded-xl bg-emerald-500/10 py-2 text-sm font-semibold text-emerald-300">
        ✓ Media ready
      </div>
    </>
  ) : (
    <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-slate-400">
      No media selected
    </div>
  )}
</div>
        {isTribute ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-extrabold">
                2. Full Name
              </span>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Example: Sarah Wanjiku Mwangi"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                3. Birth Date
              </span>
              <Input
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="Example: 12 May 1954"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                4. Date of Passing
              </span>
              <Input
                value={passingDate}
                onChange={(e) => setPassingDate(e.target.value)}
                placeholder="Example: 20 June 2026"
                className={inputClass}
              />
            </label>

            <SelectField
              label="5. Language"
              value={language}
              options={languages}
              onChange={setLanguage}
            />

            <SelectField
              label="6. Voice Style"
              value={voiceStyle}
              options={africanVoiceStyles}
              onChange={setVoiceStyle}
            />

            <SelectField
              label="7. Music Style"
              value={musicStyle}
              options={tributeMusicStyles}
              onChange={setMusicStyle}
            />

            <SelectField
              label="8. Output Format"
              value={outputFormat}
              options={outputFormats}
              onChange={(value) => {
                setOutputFormat(value);
                setVideoOutputFormat?.(value);
              }}
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="2. Occasion"
              value={occasion}
              options={greetingOccasions}
              onChange={setOccasion}
            />

            <SelectField
              label="3. Output Format"
              value={outputFormat}
              options={outputFormats}
              onChange={(value) => {
                setOutputFormat(value);
                setVideoOutputFormat?.(value);
              }}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                4. Recipient Name
              </span>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Example: Sarah"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                5. Sender Name
              </span>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Example: From John"
                className={inputClass}
              />
            </label>

            <SelectField
              label="6. Language"
              value={language}
              options={languages}
              onChange={setLanguage}
            />

            <SelectField
              label="7. Voice Style"
              value={voiceStyle}
              options={africanVoiceStyles}
              onChange={setVoiceStyle}
            />

            <SelectField
              label="8. Music Style"
              value={musicStyle}
              options={greetingMusicStyles}
              onChange={setMusicStyle}
            />
          </div>
        )}

        <SelectField
          label="9. Font Style"
          value={selectedCreatorFont}
          options={[
            "Bebas Neue",
            "Oswald",
            "Playfair Display",
            "Cinzel",
            "Orbitron",
            "Bruno Ace",
            "Metamorphous",
            "New Rocker",
          ]}
          onChange={setSelectedCreatorFont}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">
            {isTribute ? "10. Tribute Message" : "10. Personal Message"}
          </span>
          <textarea
            value={isTribute ? tributeMessage : personalMessage}
            onChange={(e) =>
              isTribute
                ? setTributeMessage(e.target.value)
                : setPersonalMessage(e.target.value)
            }
            className={textareaClass}
            placeholder={
              isTribute
                ? "Example: We celebrate a life well lived. Your love, wisdom and kindness will remain in our hearts forever."
                : "Example: Happy birthday Sarah! May your new year bring joy, blessings and success."
            }
          />
        </label>

        {draftStatus && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-bold leading-5 text-emerald-100">
            {draftStatus}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <PrimaryGenerateButton
            label={isTribute ? "Generate Tribute Video" : "Generate Greeting Video"}
            onClick={() => handlePrepareDraft(true)}
          />

          <button
            type="button"
            onClick={() => handlePrepareDraft(false)}
            className="h-12 rounded-2xl bg-slate-700 px-5 text-sm font-extrabold text-white transition hover:bg-slate-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function CinematicPlaceholderPanel({
  tool,
  selectedCreatorFont,
  setSelectedCreatorFont,
  onMediaUpload: _onMediaUpload,
  setVideoPrompt,
  setVideoCreativeType,
  setVideoOutputFormat,
  onAddEnhancedPhotoToTimeline,
  onVideoDurationChange,
}: {
  tool: string;
  selectedCreatorFont: string;
  setSelectedCreatorFont: (font: string) => void;
  onMediaUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setVideoPrompt?: (value: string) => void;
  setVideoCreativeType?: (value: string) => void;
  setVideoOutputFormat?: (value: string) => void;
  onAddEnhancedPhotoToTimeline?: (file: File, preview: string, durationSeconds?: number) => void;
  onVideoDurationChange?: (durationSeconds: number) => void;
}) {
  const [cinematicMotionStyle, setCinematicMotionStyle] = useState(
    tool === "Photo to Video"
      ? "Cinematic Camera Move"
      : tool === "Talking Avatar"
        ? "Talking Head"
        : tool === "AI News Presenter"
          ? "News Presenter"
          : "Subtle Motion"
  );
  const [cinematicMood, setCinematicMood] = useState(
    tool === "AI News Presenter" ? "Newsroom" : "Cinematic"
  );
  const [cinematicLanguage, setCinematicLanguage] = useState("English");
  const [cinematicOutputFormat, setCinematicOutputFormat] =
    useState("Facebook Reel");
  const [cinematicAspectRatio, setCinematicAspectRatio] = useState("9:16 Reel");
  const [cinematicTextPreset, setCinematicTextPreset] = useState("Hollywood");
  const [cinematicScript, setCinematicScript] = useState("");
  const [cinematicStatus, setCinematicStatus] = useState("");
  const [stagedCinematicFile, setStagedCinematicFile] = useState<File | null>(null);
  const [stagedCinematicFileName, setStagedCinematicFileName] = useState("");
  const [selectedCinematicDuration, setSelectedCinematicDuration] =
    useState("10 Seconds");

  const creatorFontCss = getFontByName(selectedCreatorFont).cssFamily;

  const cinematicPresetFontMap: Record<string, string> = {
    Hollywood: "Bebas Neue",
    "Netflix Style": "Bebas Neue",
    "News Documentary": "Oswald",
    "Faith Film": "Metamorphous",
    Luxury: "Playfair Display",
    "Epic Fantasy": "Cinzel",
    Afrobeats: "New Rocker",
    "AI Futuristic": "Bruno Ace",
    Corporate: "Oswald",
  };

  const handleCinematicTextPresetChange = (value: string) => {
    setCinematicTextPreset(value);
    const recommendedFont = cinematicPresetFontMap[value];
    if (recommendedFont) {
      setSelectedCreatorFont(recommendedFont);
    }
  };

  const isPhotoToVideo = tool === "Photo to Video";
  const isTalkingAvatar = tool === "Talking Avatar";
  const isNewsPresenter = tool === "AI News Presenter";
  const isDanceLike = ["Dance Animation", "Singing Animation"].includes(tool);

  const uploadTitle = isPhotoToVideo
    ? "1. Upload Photo to Animate"
    : isTalkingAvatar
      ? "1. Upload Avatar / Presenter Photo"
      : isNewsPresenter
        ? "1. Upload Presenter or News Image"
        : "1. Upload Source Media";

  const uploadDescription = isPhotoToVideo
    ? "Upload one photo. Mock mode will prepare a motion-video draft from it."
    : isTalkingAvatar
      ? "Upload a face or avatar image for the talking video draft."
      : isNewsPresenter
        ? "Upload presenter image, news image, or newsroom visual."
        : "Upload a photo, image, or short video for this cinematic AI tool.";

  const instructionLabel = isTalkingAvatar
    ? "6. Avatar Script"
    : isNewsPresenter
      ? "6. News Script"
      : isPhotoToVideo
        ? "6. Motion Instructions"
        : "6. Extra Instructions";

  const instructionPlaceholder = isTalkingAvatar
    ? "Example: Hello everyone, welcome to XNewsApp. Today I want to introduce our new product..."
    : isNewsPresenter
      ? "Example: Good evening. Here are today's top stories from Nairobi..."
      : isPhotoToVideo
        ? "Example: Slowly zoom in, add cinematic camera movement, make the background feel alive."
        : "Optional: describe movement, background, camera direction, or visual style.";

  const buildCinematicPrompt = () => {
    return [
      `Tool: ${tool}`,
      `Motion style: ${cinematicMotionStyle}`,
      `Mood: ${cinematicMood}`,
      `Language: ${cinematicLanguage}`,
      `Output format: ${cinematicOutputFormat}`,
      `Video duration: ${selectedCinematicDuration}`,
      `Aspect ratio: ${cinematicAspectRatio}`,
      `Cinematic text preset: ${cinematicTextPreset}`,
      `Selected font: ${selectedCreatorFont}`,
      "",
      "User instructions:",
      cinematicScript.trim() || instructionPlaceholder,
      "",
      "Create a timeline-ready cinematic preview now. Later fal.ai will replace this with real AI video generation.",
    ].join("\n");
  };

  const handleStageCinematicMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setStagedCinematicFile(file);
    setStagedCinematicFileName(file.name);
    setCinematicStatus(
      `${file.name} uploaded and ready. Click Generate ${tool} to add it to preview and timeline.`
    );
  };

  const addStagedCinematicMediaToTimeline = () => {
    if (!stagedCinematicFile) {
      return true;
    }

    if (!onAddEnhancedPhotoToTimeline) {
      alert("Timeline connection is not ready.");
      return false;
    }

    const preview = URL.createObjectURL(stagedCinematicFile);
    onAddEnhancedPhotoToTimeline(
      stagedCinematicFile,
      preview,
      getDurationSecondsFromLabel(selectedCinematicDuration)
    );
    return true;
  };

  const handleGenerateCinematicDraft = () => {
    const addedMedia = addStagedCinematicMediaToTimeline();

    if (!addedMedia) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const context = canvas.getContext("2d");

    if (!context) {
      alert("Could not create cinematic draft.");
      return;
    }

    const gradient = context.createLinearGradient(0, 0, 1080, 1920);

    if (cinematicMood === "Newsroom") {
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(1, "#2563eb");
    } else if (cinematicMood === "Luxury") {
      gradient.addColorStop(0, "#111827");
      gradient.addColorStop(1, "#f59e0b");
    } else if (cinematicMood === "Emotional") {
      gradient.addColorStop(0, "#312e81");
      gradient.addColorStop(1, "#ec4899");
    } else if (cinematicMood === "Energetic") {
      gradient.addColorStop(0, "#7c2d12");
      gradient.addColorStop(1, "#22c55e");
    } else {
      gradient.addColorStop(0, "#020617");
      gradient.addColorStop(1, "#7c3aed");
    }

    context.fillStyle = gradient;
    context.fillRect(0, 0, 1080, 1920);

    context.fillStyle = "rgba(255,255,255,0.10)";
    context.beginPath();
    context.arc(920, 260, 260, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(255,255,255,0.06)";
    context.beginPath();
    context.arc(120, 1550, 360, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(0,0,0,0.42)";
    context.fillRect(80, 300, 920, 1040);

    context.textAlign = "center";
    context.fillStyle = "#ffffff";
    context.font = `900 72px ${creatorFontCss}`;
    context.fillText(tool.toUpperCase(), 540, 450);

    context.font = `800 46px ${creatorFontCss}`;
    context.fillStyle = "#fde68a";
    context.fillText(cinematicMotionStyle, 540, 560);

    context.font = `700 36px ${creatorFontCss}`;
    context.fillStyle = "#cffafe";
    context.fillText(cinematicMood, 540, 650);

    context.fillStyle = "rgba(255,255,255,0.88)";
    context.font = `700 30px ${creatorFontCss}`;
    context.fillText(cinematicOutputFormat, 540, 750);

    context.fillStyle = "rgba(255,255,255,0.78)";
    context.font = `700 28px ${creatorFontCss}`;
    context.fillText(`${cinematicAspectRatio} • ${cinematicTextPreset}`, 540, 820);

    context.strokeStyle = "rgba(255,255,255,0.75)";
    context.lineWidth = 7;
    context.beginPath();
    context.moveTo(250, 980);
    context.bezierCurveTo(390, 850, 660, 1110, 830, 950);
    context.stroke();

    context.fillStyle = "#ffffff";
    context.font = `800 34px ${creatorFontCss}`;
    context.fillText("CINEMATIC VIDEO", 540, 1160);

    context.fillStyle = "rgba(255,255,255,0.8)";
    context.font = `700 26px ${creatorFontCss}`;
    context.fillText("fal.ai will power real motion later", 540, 1230);

    context.fillStyle = "rgba(255,255,255,0.88)";
    context.font = `700 28px ${creatorFontCss}`;
    context.fillText("xnewsapp.com", 540, 1770);

    canvas.toBlob((blob) => {
      if (!blob) {
        alert("Could not generate cinematic draft image.");
        return;
      }

      if (cinematicPreview) {
        URL.revokeObjectURL(cinematicPreview);
      }

      const file = new File([blob], `xnewsapp-${tool.toLowerCase().replace(/\s+/g, "-")}-mock-draft.png`, {
        type: "image/png",
      });
      const preview = URL.createObjectURL(blob);

      setVideoPrompt?.(buildCinematicPrompt());
      setVideoCreativeType?.(cinematicMotionStyle);
      setVideoOutputFormat?.(cinematicOutputFormat);

      if (onAddEnhancedPhotoToTimeline) {
        onAddEnhancedPhotoToTimeline(
          file,
          preview,
          getDurationSecondsFromLabel(selectedCinematicDuration)
        );
      }

      setCinematicStatus(
        `${tool} ${selectedCinematicDuration} generated. Uploaded media and preview cover have been added to the timeline. Preview it, then use Export / Download Media.`
      );
    }, "image/png");
  };

  return (
    <div className={boxClass}>
      <ToolHeader
  title={tool}
  icon={<Clapperboard className="h-5 w-5 text-amber-300" />}
/>

      <div className="mt-5 space-y-5">
        <VideoPricingCard
          tool={tool}
          selectedDuration={selectedCinematicDuration}
          onDurationChange={(duration) => {
            setSelectedCinematicDuration(duration);
            onVideoDurationChange?.(getDurationSecondsFromLabel(duration));
          }}
        />

        <UploadMediaBox
          title={uploadTitle}
          description={uploadDescription}
          accept="image/*,video/*"
          multiple={false}
          onChange={handleStageCinematicMedia}
        />

        {stagedCinematicFileName && (
          <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 text-xs font-bold leading-5 text-blue-100">
            Uploaded and ready: {stagedCinematicFileName}. Click Generate {tool} to show it in preview.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="2. Motion Style"
            value={cinematicMotionStyle}
            options={
              isTalkingAvatar
                ? ["Talking Head", "Presenter Close-Up", "Podcast Avatar", "Business Spokesperson", "Teacher Style"]
                : isNewsPresenter
                  ? ["News Presenter", "Breaking News", "Studio Report", "Field Report", "Public Update"]
                  : isPhotoToVideo
                    ? ["Subtle Motion", "Cinematic Camera Move", "Slow Zoom", "Parallax Motion", "Trailer Style"]
                    : isDanceLike
                      ? ["Dance Motion", "Afrobeats Dance", "Amapiano Dance", "TikTok Dance", "Performance"]
                      : ["Subtle Motion", "Cinematic Camera Move", "Talking Head", "Dance Motion", "Movie Scene", "Trailer Style"]
            }
            onChange={setCinematicMotionStyle}
          />

          <SelectField
            label="3. Output Format"
            value={cinematicOutputFormat}
            options={outputFormats}
            onChange={setCinematicOutputFormat}
          />

          <SelectField
            label="4. Aspect Ratio"
            value={cinematicAspectRatio}
            options={[
              "9:16 Reel",
              "16:9 YouTube",
              "1:1 Square",
              "4:5 Social Feed",
              "21:9 CinemaScope",
            ]}
            onChange={setCinematicAspectRatio}
          />

          <SelectField
            label="5. Text Preset"
            value={cinematicTextPreset}
            options={[
              "Hollywood",
              "Netflix Style",
              "News Documentary",
              "Faith Film",
              "Luxury",
              "Epic Fantasy",
              "Afrobeats",
              "AI Futuristic",
              "Corporate",
            ]}
            onChange={handleCinematicTextPresetChange}
          />

          <SelectField
            label="6. Mood"
            value={cinematicMood}
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
            onChange={setCinematicMood}
          />

          <SelectField
            label="7. Language"
            value={cinematicLanguage}
            options={languages}
            onChange={setCinematicLanguage}
          />
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">
            {instructionLabel}
          </span>
          <textarea
            value={cinematicScript}
            onChange={(e) => setCinematicScript(e.target.value)}
            className={textareaClass}
            placeholder={instructionPlaceholder}
          />
        </label>

        <SelectField
          label="8. Font Style"
          value={selectedCreatorFont}
          options={[
            "Bebas Neue",
            "Oswald",
            "Playfair Display",
            "Cinzel",
            "Orbitron",
            "Bruno Ace",
            "Metamorphous",
            "New Rocker",
          ]}
          onChange={setSelectedCreatorFont}
        />

        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3">
          <div className="text-xs font-extrabold uppercase tracking-wide text-amber-200">
            Cinematic title preview
          </div>
          <div
            className="mt-2 text-3xl font-extrabold text-white"
            style={{ fontFamily: creatorFontCss }}
          >
            {tool.toUpperCase()}
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-300">
            {cinematicTextPreset} • {cinematicAspectRatio} • {selectedCreatorFont}
          </p>
        </div>

        {cinematicStatus && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-bold leading-5 text-emerald-100">
            {cinematicStatus}
          </div>
        )}



        <div className="flex flex-wrap gap-3">
          <PrimaryGenerateButton
            label={`Generate ${tool}`}
            onClick={handleGenerateCinematicDraft}
          />

          <button
            type="button"
            onClick={() => {
              setVideoPrompt?.(buildCinematicPrompt());
              setVideoCreativeType?.(cinematicMotionStyle);
              setVideoOutputFormat?.(cinematicOutputFormat);
              setCinematicStatus(
                `${tool} ${selectedCinematicDuration} video settings saved with ${cinematicTextPreset} text style. Click Generate to add uploaded media to preview/timeline, then export from the main Export section.`
              );
            }}
            className="h-12 rounded-2xl bg-slate-700 px-5 text-sm font-extrabold text-white hover:bg-slate-600"
          >
            Save Settings
          </button>
        </div>
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
  onVideoDurationChange,
  onRequestPayment,
}: DynamicToolWorkspaceProps) {
  const [selectedCreatorFont, setSelectedCreatorFont] = useState("Bebas Neue");
  const creatorFontCss = getFontByName(selectedCreatorFont).cssFamily;
  const [picturePreview, setPicturePreview] = useState("");
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureFileName, setPictureFileName] = useState("");
  const [enhancementStyle, setEnhancementStyle] =
    useState("Studio Portrait Pro");
  const [hasPreviewedEnhancement, setHasPreviewedEnhancement] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [quoteCategory, setQuoteCategory] = useState("Motivational");
  const [quoteBackground, setQuoteBackground] = useState("Sunrise");
  const [quoteFont, setQuoteFont] = useState("Metamorphous");
  const [quoteOutputFormat, setQuoteOutputFormat] = useState("Facebook Post");
  const [quotePreview, setQuotePreview] = useState("");
  const [quoteFile, setQuoteFile] = useState<File | null>(null);
  const [quoteStatus, setQuoteStatus] = useState("");


  const [songLyrics, setSongLyrics] = useState("");
  const [songStyle, setSongStyle] = useState("Gengetone");
  const [songLanguage, setSongLanguage] = useState("Swahili");
  const [songDuration, setSongDuration] = useState("10 sec");
  const [songPreviewReady, setSongPreviewReady] = useState(false);
  const [songStatus, setSongStatus] = useState("");

  const musicVideoAudioInputRef = useRef<HTMLInputElement | null>(null);
  const [musicVideoAudioName, setMusicVideoAudioName] = useState("");
  const [musicVideoAudioSource, setMusicVideoAudioSource] = useState("");
  const [musicVideoAudioAccept, setMusicVideoAudioAccept] = useState("audio/*");
  const [musicVideoStyle, setMusicVideoStyle] = useState("Performance");
  const [musicVideoTheme, setMusicVideoTheme] = useState("TikTok Viral");
  const [musicVideoMood, setMusicVideoMood] = useState("Energetic");
  const [musicVideoOutputFormat, setMusicVideoOutputFormat] = useState("Facebook Reel");
  const [musicVideoVisualPrompt, setMusicVideoVisualPrompt] = useState("");
  const [musicVideoDraftPreview, setMusicVideoDraftPreview] = useState("");
  const [musicVideoDraftStatus, setMusicVideoDraftStatus] = useState("");
  const [pictureStrength, setPictureStrength] = useState("Medium");
  const [pictureUpscale, setPictureUpscale] = useState("Yes");
  const [portraitRole, setPortraitRole] = useState("Corporate");
  const [portraitBackground, setPortraitBackground] = useState("Studio");
  const [beautyLevel, setBeautyLevel] = useState("Natural");
  const [youngerAge, setYoungerAge] = useState("10 years");
  const [backgroundChoice, setBackgroundChoice] = useState("Office");
  const [hairStyleChoice, setHairStyleChoice] = useState("Braids");
  const [outfitChoice, setOutfitChoice] = useState("Business Suit");
  const [sceneChoice, setSceneChoice] = useState("Luxury Car");
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
  const requestGeneration = (
  amount: string,
  generate: () => void
) => {
  if (!onRequestPayment) {
    generate();
    return;
  }

  onRequestPayment(amount, generate);
};

  if (!selectedTool) {
        return null;
  }
  const { category, tool } = selectedTool;

  const premiumPictureTools = [
    "Poster / Flyer",
    "Event Poster",
    "Business Banner",
    "Product Ad Image",
    "Thumbnail Creator",
    "Text to Image",
    "AI Art Generator",
  ];

  const getCurrentPicturePrice = () =>
    premiumPictureTools.includes(tool) ? "$0.10" : "$0.07";

  const confirmPictureGeneration = () =>
    window.confirm(
      `✨ Ready to Generate\n\nCreate your image for ${getCurrentPicturePrice()}`
    );



  const wrapCanvasText = (
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ) => {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = context.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
        return;
      }

      currentLine = testLine;
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const getQuoteBackground = () => {
    if (quoteBackground === "Nature") return ["#064e3b", "#22c55e"];
    if (quoteBackground === "City") return ["#111827", "#0ea5e9"];
    if (quoteBackground === "Luxury Gold") return ["#171717", "#f59e0b"];
    if (quoteBackground === "Dark Minimal") return ["#020617", "#334155"];
    if (quoteBackground === "Abstract") return ["#581c87", "#ec4899"];
    if (quoteBackground === "Faith Light") return ["#1e3a8a", "#f8fafc"];
    return ["#7c2d12", "#f97316"];
  };

  const generateQuoteImageFile = async () => {
    if (!confirmPictureGeneration()) {
      return;
    }


    const cleanQuote = quoteText.trim();

    if (!cleanQuote) {
      alert("Please write a quote first.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;

    const context = canvas.getContext("2d");

    if (!context) {
      alert("Could not create quote image.");
      return;
    }

    const [startColor, endColor] = getQuoteBackground();
    const gradient = context.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);

    context.fillStyle = gradient;
    context.fillRect(0, 0, 1080, 1080);

    context.fillStyle = "rgba(255,255,255,0.08)";
    context.beginPath();
    context.arc(920, 120, 260, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(255,255,255,0.06)";
    context.beginPath();
    context.arc(120, 970, 330, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(0,0,0,0.28)";
    context.beginPath();
    context.roundRect?.(90, 140, 900, 800, 42);
    if (!context.roundRect) {
      context.rect(90, 140, 900, 800);
    }
    context.fill();

    const quoteFontCss = getFontByName(quoteFont).cssFamily;

    context.textAlign = "center";
    context.fillStyle = "#ffffff";
    context.font = `700 58px ${quoteFontCss}`;

    const lines = wrapCanvasText(context, cleanQuote, 760);
    const lineHeight = 76;
    const quoteHeight = lines.length * lineHeight;
    let startY = 500 - quoteHeight / 2;

    context.font = `700 132px ${quoteFontCss}`;
    context.fillStyle = "rgba(255,255,255,0.28)";
    context.fillText("“", 540, startY - 38);

    context.font = `700 58px ${quoteFontCss}`;
    context.fillStyle = "#ffffff";

    lines.forEach((line) => {
      context.fillText(line, 540, startY);
      startY += lineHeight;
    });

    if (quoteAuthor.trim()) {
      context.font = `600 32px ${quoteFontCss}`;
      context.fillStyle = "rgba(255,255,255,0.82)";
      context.fillText(`— ${quoteAuthor.trim()}`, 540, startY + 36);
    }

    context.font = `800 28px ${quoteFontCss}`;
    context.fillStyle = "rgba(255,255,255,0.75)";
    context.fillText(quoteCategory.toUpperCase(), 540, 850);

    context.font = `700 24px ${quoteFontCss}`;
    context.fillStyle = "rgba(255,255,255,0.55)";
    context.fillText("Created with XNewsApp", 540, 910);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/png", 0.95);
    });

    if (!blob) {
      alert("Could not generate quote image.");
      return;
    }

    if (quotePreview) {
      URL.revokeObjectURL(quotePreview);
    }

    const file = new File([blob], "xnewsapp-quote-image.png", {
      type: "image/png",
    });

    const preview = URL.createObjectURL(blob);

    setQuoteFile(file);
    setQuotePreview(preview);
    setQuoteStatus(
      `${quoteOutputFormat} quote image created. Preview it, then add it to the timeline.`
    );
  };

  const handleAddQuoteImageToTimeline = () => {
    if (!quoteFile || !quotePreview) {
      alert("Please generate the quote image first.");
      return;
    }

    if (!onAddEnhancedPhotoToTimeline) {
      alert("Timeline connection is not ready.");
      return;
    }

    onAddEnhancedPhotoToTimeline(quoteFile, quotePreview);
    alert("Quote image added to timeline.");
  };

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
    setMusicVideoDraftStatus("Audio selected. Now choose the style/theme and generate a music video draft.");
    onMusicUpload(e);
  };

  const buildMusicVideoPrompt = () => {
    return [
      "Tool: AI Music Video Studio",
      `Audio source: ${musicVideoAudioSource || "No audio selected"}`,
      `Audio name: ${musicVideoAudioName || "None"}`,
      `Video style: ${musicVideoStyle}`,
      `Video theme: ${musicVideoTheme}`,
      `Visual mood: ${musicVideoMood}`,
      `Output format: ${musicVideoOutputFormat}`,
      "",
      "Visual instructions:",
      musicVideoVisualPrompt.trim() ||
        "Create a modern social music video using animated visuals, captions, beat-synced scene changes, and social-ready framing.",
    ].join("\n");
  };

  const handleGenerateMusicVideoDraft = () => {
    if (!musicVideoAudioName && !musicVideoAudioSource) {
      alert("Please choose AI Song Studio Song or upload MP3/WAV/audio first.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const context = canvas.getContext("2d");

    if (!context) {
      alert("Could not create music video draft.");
      return;
    }

    const gradient = context.createLinearGradient(0, 0, 1080, 1920);

    if (musicVideoMood === "Romantic") {
      gradient.addColorStop(0, "#831843");
      gradient.addColorStop(1, "#f472b6");
    } else if (musicVideoMood === "Luxury") {
      gradient.addColorStop(0, "#171717");
      gradient.addColorStop(1, "#f59e0b");
    } else if (musicVideoMood === "Dark Mood") {
      gradient.addColorStop(0, "#020617");
      gradient.addColorStop(1, "#334155");
    } else if (musicVideoMood === "Street") {
      gradient.addColorStop(0, "#111827");
      gradient.addColorStop(1, "#22c55e");
    } else {
      gradient.addColorStop(0, "#4c1d95");
      gradient.addColorStop(1, "#06b6d4");
    }

    context.fillStyle = gradient;
    context.fillRect(0, 0, 1080, 1920);

    context.fillStyle = "rgba(255,255,255,0.10)";
    for (let i = 0; i < 11; i += 1) {
      context.beginPath();
      context.arc(120 + i * 105, 360 + (i % 3) * 170, 50 + (i % 4) * 16, 0, Math.PI * 2);
      context.fill();
    }

    context.fillStyle = "rgba(0,0,0,0.45)";
    context.fillRect(80, 290, 920, 980);

    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.font = `900 72px ${creatorFontCss}`;
    context.fillText("AI MUSIC VIDEO", 540, 430);

    context.font = `800 54px ${creatorFontCss}`;
    context.fillText(musicVideoTheme.toUpperCase(), 540, 535);

    context.font = `700 38px ${creatorFontCss}`;
    context.fillStyle = "#cffafe";
    context.fillText(musicVideoStyle, 540, 630);

    context.fillStyle = "#fde68a";
    context.font = `700 34px ${creatorFontCss}`;
    context.fillText(musicVideoMood, 540, 700);

    context.fillStyle = "#ffffff";
    context.font = `700 34px ${creatorFontCss}`;
    context.fillText(musicVideoAudioName || musicVideoAudioSource || "Selected Audio", 540, 805);

    context.strokeStyle = "rgba(255,255,255,0.8)";
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(270, 980);
    for (let i = 0; i < 16; i += 1) {
      const x = 270 + i * 36;
      const y = 980 - ((i % 5) + 1) * 35;
      context.lineTo(x, y);
    }
    context.stroke();

    context.fillStyle = "#ffffff";
    context.font = `800 30px ${creatorFontCss}`;
    context.fillText(musicVideoOutputFormat, 540, 1160);

    context.fillStyle = "rgba(255,255,255,0.88)";
    context.font = `700 28px ${creatorFontCss}`;
    context.fillText("xnewsapp.com", 540, 1770);

    canvas.toBlob((blob) => {
      if (!blob) {
        alert("Could not generate music video draft image.");
        return;
      }

      if (musicVideoDraftPreview) {
        URL.revokeObjectURL(musicVideoDraftPreview);
      }

      const file = new File([blob], "xnewsapp-ai-music-video-draft.png", {
        type: "image/png",
      });
      const preview = URL.createObjectURL(blob);

      setMusicVideoDraftPreview(preview);
      setVideoPrompt?.(buildMusicVideoPrompt());
      setVideoCreativeType?.(musicVideoStyle);
      setVideoOutputFormat?.(musicVideoOutputFormat);

      if (onAddEnhancedPhotoToTimeline) {
        onAddEnhancedPhotoToTimeline(file, preview);
      }

      setMusicVideoDraftStatus(
        "Music video draft created and added to the timeline. Preview it, then use Export / Download Media."
      );
    }, "image/png");
  };

  if (category === "Picture AI" && tool === "Quote Image Creator") {
    return (
      <div className={boxClass}>
        <ToolHeader
          title="Quote Image Creator"
          icon={<ImagePlus className="h-5 w-5 text-pink-300" />}
          description="Create Facebook, Instagram, WhatsApp, or poster-ready quote graphics without uploading a photo first."
        />

        <div className="mt-5 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              1. Write Quote
            </span>
            <textarea
              value={quoteText}
              onChange={(e) => {
                setQuoteText(e.target.value);
                setQuoteStatus("");
              }}
              placeholder="Example: Success comes from consistency, not luck."
              className={textareaClass}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                2. Author / Source
              </span>
              <Input
                value={quoteAuthor}
                onChange={(e) => setQuoteAuthor(e.target.value)}
                placeholder="Example: XNewsApp"
                className={inputClass}
              />
            </label>

            <SelectField
              label="3. Quote Style"
              value={quoteCategory}
              options={[
                "Motivational",
                "Business",
                "Faith",
                "Love",
                "Birthday",
                "News",
                "Education",
                "Leadership",
              ]}
              onChange={setQuoteCategory}
            />

            <SelectField
              label="4. Background Style"
              value={quoteBackground}
              options={[
                "Sunrise",
                "Nature",
                "City",
                "Luxury Gold",
                "Dark Minimal",
                "Abstract",
                "Faith Light",
              ]}
              onChange={setQuoteBackground}
            />

            <SelectField
              label="5. Font Style"
              value={quoteFont}
              options={[
                "Metamorphous",
                "Playfair Display",
                "Bebas Neue",
                "Bruno Ace",
                "Orbitron",
                "Oswald",
                "Cinzel",
                "Iceberg",
                "New Rocker",
              ]}
              onChange={setQuoteFont}
            />

            <SelectField
              label="6. Output Format"
              value={quoteOutputFormat}
              options={[
                "Facebook Post",
                "Instagram Square",
                "WhatsApp Status",
                "Poster",
                "Story",
              ]}
              onChange={setQuoteOutputFormat}
            />
          </div>

          <TextFontStudio
            tool={tool}
            selectedFont={selectedCreatorFont}
            onFontChange={(font) => {
              setSelectedCreatorFont(font);
              setQuoteFont(font);
            }}
          />

          {quoteStatus && (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-bold leading-5 text-emerald-100">
              {quoteStatus}
            </div>
          )}

          {quotePreview && (
            <div className="overflow-hidden rounded-3xl border border-pink-400/20 bg-black p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-extrabold uppercase tracking-wide text-pink-200">
                  Quote Image Preview
                </span>
                <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-extrabold text-white">
                  PNG
                </span>
              </div>

              <img
                src={quotePreview}
                alt="Quote image preview"
                className="mx-auto max-h-[520px] w-full rounded-2xl object-contain"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={generateQuoteImageFile}
              className="h-12 rounded-2xl bg-pink-600 px-5 font-extrabold text-white hover:bg-pink-700"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Quote Image
            </Button>

            <Button
              type="button"
              disabled={!quotePreview || !quoteFile}
              onClick={handleAddQuoteImageToTimeline}
              className="h-12 rounded-2xl bg-blue-600 px-5 font-extrabold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              Add to Timeline
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (category === "Picture AI") {
    const filterClass = enhancementFilters[enhancementStyle];
    const selectedFontStyle = { fontFamily: creatorFontCss };

    const isPhotoEnhancer = tool === "Photo Enhancer";
    const isStudioPortrait = tool === "Studio Portrait";
    const isBeautyGlow = tool === "Beauty Glow";
    const isYoungerLook = tool === "Younger Look";
    const isBackgroundChanger = tool === "Background Changer";
    const isHairstyleChanger = tool === "Hairstyle Changer";
    const isOutfitChanger = tool === "Outfit Changer";
    const isSceneChanger = tool === "Scene Changer";
    const isProductAdImage = tool === "Product Ad Image";
    const isFacebookPostImage = tool === "Facebook Post Image";
    const isPosterFlyer = tool === "Poster / Flyer";
    const showFontStudio = [
      "Product Ad Image",
      "Facebook Post Image",
      "Poster / Flyer",
      "Hairstyle Changer",
      "Outfit Changer",
      "Scene Changer",
    ].includes(tool);

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
              : isHairstyleChanger
                ? "Try a new hairstyle look from an uploaded photo."
                : isOutfitChanger
                  ? "Change outfits for sports fans, careers, weddings, fashion and creative looks."
                  : isSceneChanger
                    ? "Place a person into travel, luxury, work, sports or action scenes."
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
            : isHairstyleChanger
              ? "Generate Hairstyle Preview"
              : isOutfitChanger
                ? "Generate Outfit Preview"
                : isSceneChanger
                  ? "Generate Scene Preview"
                  : isStudioPortrait
              ? "Generate Studio Portrait"
              : isBeautyGlow
                ? "Generate Beauty Glow"
                : isYoungerLook
                  ? "Generate Younger Look"
                  : "Generate Enhanced Photo";

    return (
      <div className={boxClass}>
        <>
          <ToolHeader
            title={tool}
            icon={<ImagePlus className="h-5 w-5 text-pink-300" />}
            description={`${pictureDescription} Export/download later from the main Export section.`}
          />

          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
            <div className="text-xs font-extrabold uppercase tracking-wide text-emerald-300">
              {[
                "Poster / Flyer",
                "Event Poster",
                "Business Banner",
                "Product Ad Image",
                "Thumbnail Creator",
                "Text to Image",
                "AI Art Generator",
              ].includes(tool)
                ? "🎨 Premium Picture AI"
                : "🖼️ Basic Picture AI"}
            </div>

            <p className="mt-1 text-sm font-extrabold text-white">
              💰 Price: {[
                "Poster / Flyer",
                "Event Poster",
                "Business Banner",
                "Product Ad Image",
                "Thumbnail Creator",
                "Text to Image",
                "AI Art Generator",
              ].includes(tool)
                ? "$0.10"
                : "$0.07"} per image
            </p>

           
          </div>
        </>

        <div className="mt-5 space-y-4">

  {/* Upload Photo */}
  <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-slate-950/60 px-5 py-5 text-center transition hover:border-pink-400/50 hover:bg-slate-950/80">
    <div>
      <Upload className="mx-auto mb-2 h-6 w-6 text-pink-300" />
      <span className="block text-sm font-extrabold">
        Upload Photo
      </span>
      <span className="mt-1 block text-xs font-medium text-slate-300">
        Portrait, product, poster, flyer, social post, or creative image
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

          setPictureFile(file);
          setPicturePreview(URL.createObjectURL(file));
          setPictureFileName(file.name);
          setHasPreviewedEnhancement(false);
        }}
      />
    </div>
  </label>

  {/* Uploaded Photo Preview */}
  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
    <h4 className="mb-3 text-sm font-bold text-white">
      Uploaded Photo
    </h4>

    {picturePreview ? (
      <>
        <img
          src={picturePreview}
          alt="Uploaded"
          className="h-56 w-full rounded-xl bg-black object-contain"
        />

        <div className="mt-3 flex items-center justify-center rounded-xl bg-emerald-500/10 py-2 text-sm font-semibold text-emerald-300">
          ✓ Photo ready
        </div>
      </>
    ) : (
      <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-slate-400">
        No photo selected
      </div>
    )}
  </div>

  {/* Enhancement Style */}
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

          {isHairstyleChanger && (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Hairstyle"
                value={hairStyleChoice}
                options={[
                  "Braids",
                  "Dreadlocks",
                  "Afro",
                  "Short Hair",
                  "Long Hair",
                  "Curly Hair",
                  "Wig Style",
                  "Bald Look",
                  "Beard Style",
                  "Clean Shave",
                ]}
                onChange={setHairStyleChoice}
              />

              <SelectField
                label="Look Style"
                value={enhancementStyle}
                options={[
                  "Natural Glow",
                  "Studio Portrait Pro",
                  "HD Sharp Focus",
                  "Instagram Ready",
                ]}
                onChange={(value) => {
                  setEnhancementStyle(value);
                  setHasPreviewedEnhancement(false);
                }}
              />
            </div>
          )}

          {isOutfitChanger && (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Outfit Style"
                value={outfitChoice}
                options={[
                  "Business Suit",
                  "Wedding Dress",
                  "Military-Inspired Outfit",
                  "Graduation Gown",
                  "African Traditional Wear",
                  "Sports Fan Outfit",
                  "Football Fan Jersey",
                  "European Club-Inspired Jersey",
                  "Kenyan Club-Inspired Jersey",
                  "Nigerian Club-Inspired Jersey",
                  "South African Club-Inspired Jersey",
                  "Tanzanian Club-Inspired Jersey",
                  "Ugandan Club-Inspired Jersey",
                  "Career Uniform",
                  "Doctor Coat",
                  "Nurse Uniform",
                  "Pilot Uniform",
                  "Lawyer Suit",
                  "Teacher Outfit",
                  "Engineer Safety Wear",
                  "Chef Uniform",
                  "News Anchor Outfit",
                  "Luxury Fashion",
                  "School Uniform Style",
                  "80s Pop Star Stage Outfit",
                ]}
                onChange={setOutfitChoice}
              />

              <SelectField
                label="Design Style"
                value={enhancementStyle}
                options={[
                  "Poster Design Look",
                  "Luxury Background",
                  "Corporate Headshot",
                  "Instagram Ready",
                ]}
                onChange={(value) => {
                  setEnhancementStyle(value);
                  setHasPreviewedEnhancement(false);
                }}
              />
            </div>
          )}

          {isSceneChanger && (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Scene"
                value={sceneChoice}
                options={[
                  "Luxury Lifestyle Photo",
                  "Private Jet",
                  "Luxury Villa",
                  "Penthouse",
                  "Sports Car",
                  "Yacht",
                  "Five-Star Hotel",
                  "VIP Event",
                  "Red Carpet",
                  "Travel Scene Photo",
                  "Paris",
                  "London",
                  "Dubai",
                  "New York",
                  "Nairobi",
                  "Cape Town",
                  "Lagos",
                  "Kampala",
                  "Dar es Salaam",
                  "Safari",
                  "Beach Resort",
                  "Mountain",
                  "Desert",
                  "Cruise Ship",
                  "Luxury Car",
                  "Modern House",
                  "Office",
                  "Classroom",
                  "Hospital",
                  "Airport",
                  "Aircraft",
                  "Train",
                  "Ship",
                  "Bus",
                  "Football Stadium",
                  "Wrestling Arena",
                  "Forest",
                  "Beach",
                  "Running",
                  "Swimming",
                  "Walking",
                  "Climbing",
                  "Carrying a Bag",
                  "Carrying a Child",
                  "Sitting",
                  "Singing on Stage",
                  "Watching Movie",
                  "Watching Football",
                  "Watching Basketball",
                ]}
                onChange={setSceneChoice}
              />

              <SelectField
                label="Scene Mood"
                value={enhancementStyle}
                options={[
                  "Poster Design Look",
                  "Natural Glow",
                  "Luxury Background",
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
            !isHairstyleChanger &&
            !isOutfitChanger &&
            !isSceneChanger &&
            !isProductAdImage &&
            !isFacebookPostImage &&
            !isPosterFlyer && (
              <p className="text-sm font-medium leading-6 text-slate-300">
                This Picture AI tool uses the selected enhancement/design style.
              </p>
            )}
        </div>

        {showFontStudio && (
          <TextFontStudio
            tool={tool}
            selectedFont={selectedCreatorFont}
            onFontChange={setSelectedCreatorFont}
          />
        )}

        {false && picturePreview && (
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
                    <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/70 p-3 text-white backdrop-blur" style={selectedFontStyle}>
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
            disabled={false}
            onClick={() => {
  setHasPreviewedEnhancement(true);
  onGenerateImage?.();
}}
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
  if (category === "Music AI") {
    return (
      <MusicStudioPanel
        tool={tool}
        songLyrics={songLyrics}
        setSongLyrics={setSongLyrics}
        songStyle={songStyle}
        setSongStyle={setSongStyle}
        songLanguage={songLanguage}
        setSongLanguage={setSongLanguage}
        songDuration={songDuration}
        setSongDuration={setSongDuration}
        songPreviewReady={songPreviewReady}
        setSongPreviewReady={setSongPreviewReady}
        songStatus={songStatus}
        setSongStatus={setSongStatus}
        onMusicUpload={onMusicUpload}
      />
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

  if (
    category === "Video AI" &&
    ["AI Greeting Video Studio", "Obituary / Tribute Studio"].includes(tool)
  ) {
    return (
      <LifeEventVideoPanel
        tool={tool}
        videoPrompt={videoPrompt}
        setVideoPrompt={setVideoPrompt}
        setVideoCreativeType={setVideoCreativeType}
        videoOutputFormat={videoOutputFormat}
        setVideoOutputFormat={setVideoOutputFormat}
        selectedCreatorFont={selectedCreatorFont}
        setSelectedCreatorFont={setSelectedCreatorFont}
        onMediaUpload={onMediaUpload}
        onGenerateCompleteVideo={onGenerateCompleteVideo}
        onAddEnhancedPhotoToTimeline={onAddEnhancedPhotoToTimeline}
        onVideoDurationChange={onVideoDurationChange}
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
        selectedCreatorFont={selectedCreatorFont}
        setSelectedCreatorFont={setSelectedCreatorFont}
        onMediaUpload={onMediaUpload}
        onGenerateCompleteVideo={onGenerateCompleteVideo}
        onAddEnhancedPhotoToTimeline={onAddEnhancedPhotoToTimeline}
        onVideoDurationChange={onVideoDurationChange}
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
        description="Create music videos using your song, uploaded audio, visuals, captions, and social-ready formats."
      />

      <div className="mt-5 space-y-5">

        {/* AUDIO SOURCE */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
          <h4 className="text-sm font-extrabold text-white">
            1. Audio Source
          </h4>

          <p className="mt-1 text-xs leading-5 text-slate-300">
            Use a song from AI Song Studio or upload your own audio.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleUseSongStudioSong}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"
            >
              Use AI Song Studio Song
            </button>

            <button
              type="button"
              onClick={() =>
                openMusicVideoAudioPicker(
                  "MP3 Upload",
                  "audio/mpeg,.mp3"
                )
              }
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"
            >
              Upload MP3
            </button>

            <button
              type="button"
              onClick={() =>
                openMusicVideoAudioPicker(
                  "WAV Upload",
                  "audio/wav,.wav"
                )
              }
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"
            >
              Upload WAV
            </button>

            <button
              type="button"
              onClick={() =>
                openMusicVideoAudioPicker(
                  "Audio Upload",
                  "audio/*"
                )
              }
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"
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

          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0B1020] p-3 text-xs font-semibold text-slate-300">
            <span className="block font-extrabold text-white">
              Selected Audio
            </span>

            {musicVideoAudioName ? (
              <>
                {musicVideoAudioName}
                {musicVideoAudioSource
                  ? ` • ${musicVideoAudioSource}`
                  : ""}
              </>
            ) : (
              <>No audio selected.</>
            )}
          </div>
        </div>

        {/* STYLE OPTIONS */}
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="2. Music Video Type"
            value={musicVideoStyle}
            options={[
              "Performance",
              "Lyrics Video",
              "Dance Video",
              "Story Video",
              "Concert Video",
              "Anime Video",
              "Visualizer",
            ]}
            onChange={setMusicVideoStyle}
          />

          <SelectField
            label="3. Theme"
            value={musicVideoTheme}
            options={[
              "Love",
              "Gospel",
              "Motivation",
              "Birthday",
              "Wedding",
              "Business",
              "TikTok Viral",
              "Street Life",
              "Success Story",
            ]}
            onChange={setMusicVideoTheme}
          />

          <SelectField
            label="4. Visual Mood"
            value={musicVideoMood}
            options={[
              "Energetic",
              "Cinematic",
              "Luxury",
              "Romantic",
              "Dark Mood",
              "Colorful",
              "Street",
              "Minimal",
            ]}
            onChange={setMusicVideoMood}
          />

          <SelectField
            label="5. Output Format"
            value={musicVideoOutputFormat}
            options={[
              "Facebook Reel",
              "TikTok",
              "Instagram Reel",
              "WhatsApp Status",
              "YouTube Shorts",
            ]}
            onChange={setMusicVideoOutputFormat}
          />
        </div>

        {/* VISUALS */}
        <UploadMediaBox
          title="6. Upload Images (Optional)"
          description="Upload photos that will appear in the music video."
          accept="image/*"
          multiple
          onChange={onMediaUpload}
        />

        {/* STORYBOARD */}
        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">
            7. Lyrics / Visual Storyboard
          </span>

          <textarea
            value={musicVideoVisualPrompt}
            onChange={(e) =>
              setMusicVideoVisualPrompt(e.target.value)
            }
            className={textareaClass}
            placeholder="Example: Nairobi nightlife, dancers, colorful lights, beat synced transitions, luxury cars, fast captions."
          />
        </label>

        <TextFontStudio
          tool="AI Music Video Studio"
          selectedFont={selectedCreatorFont}
          onFontChange={setSelectedCreatorFont}
        />

        {musicVideoDraftStatus && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-100">
            {musicVideoDraftStatus}
          </div>
        )}

        {musicVideoDraftPreview && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black p-3">
            <div className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-400">
              Draft Preview
            </div>

            <img
              src={musicVideoDraftPreview}
              alt="Music Video Draft"
              className="max-h-[420px] w-full rounded-2xl object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <PrimaryGenerateButton
            label="Generate Music Video Draft"
            onClick={handleGenerateMusicVideoDraft}
          />

          <button
            type="button"
            onClick={() => {
              setVideoPrompt?.(buildMusicVideoPrompt());
              setVideoCreativeType?.(musicVideoStyle);
              setVideoOutputFormat?.(musicVideoOutputFormat);

              setMusicVideoDraftStatus(
                "Music video video settings saved. Add media, preview the draft, then use Export / Download Media."
              );
            }}
            className="h-12 rounded-2xl bg-slate-700 px-5 text-sm font-extrabold text-white hover:bg-slate-600"
          >
            Save Music Video Workflow
          </button>
        </div>
      </div>
    </div>
  );
}

  if (category === "Cinematic AI") {
    return (
      <CinematicPlaceholderPanel
        tool={tool}
        selectedCreatorFont={selectedCreatorFont}
        setSelectedCreatorFont={setSelectedCreatorFont}
        onMediaUpload={onMediaUpload}
        setVideoPrompt={setVideoPrompt}
        setVideoCreativeType={setVideoCreativeType}
        setVideoOutputFormat={setVideoOutputFormat}
        onAddEnhancedPhotoToTimeline={onAddEnhancedPhotoToTimeline}
        onVideoDurationChange={onVideoDurationChange}
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
