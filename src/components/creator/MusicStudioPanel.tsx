import { useMemo, useState } from "react";
import { Download, Loader2, Music, Plus, Upload, Wand2 } from "lucide-react";

type MusicStudioPanelProps = {
  tool: string;
  songLyrics: string;
  setSongLyrics: (value: string) => void;
  songStyle: string;
  setSongStyle: (value: string) => void;
  songLanguage: string;
  setSongLanguage: (value: string) => void;
  songDuration: string;
  setSongDuration: (value: string) => void;
  songPreviewReady: boolean;
  setSongPreviewReady: (value: boolean) => void;
  songStatus: string;
  setSongStatus: (value: string) => void;
  onMusicUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requestGeneration?: (
    amount: string,
    generate: () => void
  ) => void;

  // Desktop timeline connection for generated Music AI.
  onAddToVideo?: (
    audioUrl: string,
    durationSeconds: number,
    tool: string
  ) => Promise<void> | void;
};

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30";

const textareaClass =
  "min-h-[150px] w-full rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30";

const languages = [
  "English",
  "Swahili",
  "Sheng",
  "Luganda",
  "Yoruba",
  "Hausa",
  "Zulu",
  "French",
  "Arabic",
  "Pidgin",
  "Mixed",
];

const voiceStyles = [
  "Afrobeats Male Voice",
  "Afrobeats Female Voice",
  "Gospel Female Voice",
  "Gospel Male Voice",
  "Kenyan Radio Host",
  "Nigerian Narrator",
  "South African Presenter",
  "News Presenter",
  "Motivational Speaker",
  "Luxury Commercial Voice",
  "Business Presenter",
  "Rap Voice",
  "Story Teller",
  "Choir Voice",
];

const musicStyles = [
  "Afrobeats",
  "Amapiano",
  "Bongo Flava",
  "Gengetone",
  "Gospel",
  "Praise & Worship",
  "Choir",
  "Hip Hop",
  "Dancehall",
  "Reggae",
  "Love Ballad",
  "Wedding Song",
  "Birthday Song",
  "School Anthem",
  "Business Jingle",
  "Campaign Song",
  "Background Music",
];

const durations = [
  "10 sec",
  "20 sec",
  "30 sec",
  "40 sec",
  "50 sec",
  "60 sec",
  "2 min",
  "3 min",
  "4 min",
  "Full Song (5 min max)",
];

const musicPricing: Record<string, string> = {
  "10 sec": "$0.05",
  "20 sec": "$0.10",
  "30 sec": "$0.15",
  "40 sec": "$0.20",
  "50 sec": "$0.25",
  "60 sec": "$0.30",
  "2 min": "$0.60",
  "3 min": "$0.90",
  "4 min": "$1.20",
  "Full Song (5 min max)": "$1.50",
};

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-white">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

function getDurationSeconds(duration: string): number {
  if (duration === "Full Song (5 min max)") {
    return 300;
  }

  const match = duration.match(/^(\d+)\s*(sec|min)$/i);

  if (!match) {
    return 60;
  }

  const value = Number(match[1]);

  if (!Number.isFinite(value)) {
    return 60;
  }

  return match[2].toLowerCase() === "min" ? value * 60 : value;
}

function buildMusicPrompt({
  tool,
  style,
  language,
  voiceStyle,
  duration,
  userInstructions,
}: {
  tool: string;
  style: string;
  language: string;
  voiceStyle: string;
  duration: number;
  userInstructions: string;
}): string {
  return [
    `Create a polished ${style} song for ${tool}.`,
    `Language: ${language}.`,
    `Vocal direction: ${voiceStyle}.`,
    `Target duration: approximately ${duration} seconds.`,
    "Make the production professional, musical, coherent and suitable for social-media video use.",
    "Use clear vocals, strong musical arrangement, appropriate rhythm and a memorable structure.",
    `User creative direction: ${userInstructions}`,
  ].join(" ");
}

function buildMusicLyrics(
  userInstructions: string,
  style: string,
  language: string
): string {
  return [
    "[Verse 1]",
    userInstructions,
    "",
    "[Chorus]",
    `Create a memorable ${style} hook that captures the main message.`,
    "",
    "[Verse 2]",
    `Develop the story further in ${language} while keeping the lyrics natural and singable.`,
    "",
    "[Bridge]",
    "Add an emotional or energetic bridge that builds toward the final chorus.",
    "",
    "[Chorus]",
    "Repeat the strongest hook and finish with a memorable musical ending.",
  ].join("\n");
}

export default function MusicStudioPanel({
  tool,
  songLyrics,
  setSongLyrics,
  songStyle,
  setSongStyle,
  songLanguage,
  setSongLanguage,
  songDuration,
  setSongDuration,
  songPreviewReady,
  setSongPreviewReady,
  songStatus,
  setSongStatus,
  onMusicUpload,
  requestGeneration,
  onAddToVideo,
}: MusicStudioPanelProps) {
  const [voiceStyle, setVoiceStyle] = useState("Afrobeats Male Voice");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<
    number | null
  >(null);

  const config = useMemo(() => {
    const lowerTool = tool.toLowerCase();

    if (lowerTool.includes("birthday")) {
      return {
        title: "Birthday Song Creator",
        description:
          "Generate birthday audio with lyrics, voice direction and a downloadable song.",
        mainLabel: "1. Birthday Details",
        placeholder:
          "Example: Birthday person: Sarah. Age: 25. Message: May God bless you with joy, success and long life.",
        button: "Generate Birthday Audio",
        defaultStyle: "Birthday Song",
      };
    }

    if (lowerTool.includes("wedding")) {
      return {
        title: "Wedding Song Creator",
        description:
          "Generate wedding audio for couples, invitations, memories and celebration videos.",
        mainLabel: "1. Wedding Details",
        placeholder:
          "Example: Couple: Brian and Faith. Message: A beautiful love story, family blessing and joyful celebration.",
        button: "Generate Wedding Audio",
        defaultStyle: "Wedding Song",
      };
    }

    if (lowerTool.includes("love")) {
      return {
        title: "Love Song Creator",
        description:
          "Generate romantic audio for dedications, reels and status videos.",
        mainLabel: "1. Love Message",
        placeholder:
          "Example: Write a romantic song for my partner about loyalty, distance and true love.",
        button: "Generate Love Audio",
        defaultStyle: "Love Ballad",
      };
    }

    if (lowerTool.includes("baby")) {
      return {
        title: "Baby Dedication Song Creator",
        description:
          "Generate warm baby dedication audio for family, church and celebration videos.",
        mainLabel: "1. Baby Dedication Details",
        placeholder:
          "Example: Baby name: Ethan. Message: A blessing to the family, protected by God and loved by everyone.",
        button: "Generate Baby Dedication Audio",
        defaultStyle: "Gospel",
      };
    }

    if (lowerTool.includes("gospel")) {
      return {
        title: "Gospel Song Creator",
        description:
          "Generate gospel audio for worship, testimony and praise.",
        mainLabel: "1. Gospel Song Message",
        placeholder:
          "Example: Write a gospel song about God's mercy, hope, healing and victory.",
        button: "Generate Gospel Audio",
        defaultStyle: "Gospel",
      };
    }

    if (lowerTool.includes("praise") || lowerTool.includes("worship")) {
      return {
        title: "Praise & Worship Song Creator",
        description:
          "Generate praise and worship audio for church, choirs, services and events.",
        mainLabel: "1. Worship Theme",
        placeholder:
          "Example: Create a worship song about surrender, faith, gratitude and God's presence.",
        button: "Generate Worship Audio",
        defaultStyle: "Praise & Worship",
      };
    }

    if (lowerTool.includes("bible")) {
      return {
        title: "Bible Verse Song Creator",
        description:
          "Turn a Bible verse or faith message into audio for worship or social videos.",
        mainLabel: "1. Bible Verse / Message",
        placeholder:
          "Example: Psalm 23. The Lord is my shepherd. Make it calm, powerful and worshipful.",
        button: "Generate Bible Audio",
        defaultStyle: "Gospel",
      };
    }

    if (lowerTool.includes("choir")) {
      return {
        title: "Choir Song Creator",
        description:
          "Generate choir-style audio for church, school, memorials and celebrations.",
        mainLabel: "1. Choir Song Message",
        placeholder:
          "Example: Create a choir song about unity, faith and thanksgiving.",
        button: "Generate Choir Audio",
        defaultStyle: "Choir",
      };
    }

    if (lowerTool.includes("afrobeats")) {
      return {
        title: "Afrobeats Song Creator",
        description:
          "Generate Afrobeats audio for reels, celebrations, music videos and social content.",
        mainLabel: "1. Song Topic",
        placeholder:
          "Example: Create a catchy Afrobeats song about success, dancing and Nairobi nightlife.",
        button: "Generate Afrobeats Audio",
        defaultStyle: "Afrobeats",
      };
    }

    if (lowerTool.includes("amapiano")) {
      return {
        title: "Amapiano Song Creator",
        description:
          "Generate Amapiano audio with rhythm, hook and dance-ready energy.",
        mainLabel: "1. Song Topic",
        placeholder:
          "Example: Create an Amapiano song for a party, dance challenge and good vibes.",
        button: "Generate Amapiano Audio",
        defaultStyle: "Amapiano",
      };
    }

    if (lowerTool.includes("bongo")) {
      return {
        title: "Bongo Flava Song Creator",
        description:
          "Generate Bongo Flava audio for love, life, dance or social videos.",
        mainLabel: "1. Song Topic",
        placeholder:
          "Example: Create a Bongo Flava love song in Swahili about missing someone.",
        button: "Generate Bongo Flava Audio",
        defaultStyle: "Bongo Flava",
      };
    }

    if (lowerTool.includes("hip hop")) {
      return {
        title: "Hip Hop Song Creator",
        description:
          "Generate hip hop audio for rap, motivation and street stories.",
        mainLabel: "1. Rap Topic",
        placeholder:
          "Example: Create a rap about hustle, education, Nairobi streets and building a better future.",
        button: "Generate Hip Hop Audio",
        defaultStyle: "Hip Hop",
      };
    }

    if (lowerTool.includes("dancehall")) {
      return {
        title: "Dancehall Song Creator",
        description:
          "Generate dancehall audio for parties, reels, clubs and social videos.",
        mainLabel: "1. Dancehall Song Topic",
        placeholder:
          "Example: Create a dancehall chorus about confidence, style and weekend vibes.",
        button: "Generate Dancehall Audio",
        defaultStyle: "Dancehall",
      };
    }

    if (lowerTool.includes("business") || lowerTool.includes("jingle")) {
      return {
        title: "Business Jingle Creator",
        description:
          "Generate short jingle audio for ads, radio, TikTok, products and local brands.",
        mainLabel: "1. Business / Product Details",
        placeholder:
          "Example: Business: Mose Salon. Services: hair, nails, makeup. Location: Nairobi. Make it catchy.",
        button: "Generate Jingle Audio",
        defaultStyle: "Business Jingle",
      };
    }

    if (lowerTool.includes("political") || lowerTool.includes("campaign")) {
      return {
        title: "Political Campaign Song Creator",
        description:
          "Generate neutral campaign audio for public messaging, rallies and civic communication.",
        mainLabel: "1. Campaign Message",
        placeholder:
          "Example: Candidate name, slogan, county/region, peaceful message and key promise.",
        button: "Generate Campaign Audio",
        defaultStyle: "Campaign Song",
      };
    }

    if (lowerTool.includes("school")) {
      return {
        title: "School Anthem Creator",
        description:
          "Generate school anthem audio using school name, motto, values and choir style.",
        mainLabel: "1. School Details",
        placeholder:
          "Example: School: Hope Academy. Motto: Learn and Serve. Values: discipline, excellence and faith.",
        button: "Generate School Anthem Audio",
        defaultStyle: "School Anthem",
      };
    }

    if (lowerTool.includes("lyrics")) {
      return {
        title: "Lyrics Generator",
        description:
          "Generate lyrics and a structured draft for songs, reels, worship, ads and social media.",
        mainLabel: "1. Lyrics Topic / Message",
        placeholder:
          "Example: Write motivational lyrics about working hard and never giving up.",
        button: "Generate Lyrics",
        defaultStyle: "Afrobeats",
      };
    }

    if (lowerTool.includes("beat")) {
      return {
        title: "Beat Generator",
        description:
          "Generate beat-focused audio direction for production.",
        mainLabel: "1. Beat Description",
        placeholder:
          "Example: Energetic Gengetone beat with heavy drums, club bass and viral TikTok feel.",
        button: "Generate Beat Audio",
        defaultStyle: "Gengetone",
      };
    }

    if (lowerTool.includes("background")) {
      return {
        title: "Background Music Generator",
        description:
          "Generate background audio for videos, adverts, news, reels and presentations.",
        mainLabel: "1. Background Music Purpose",
        placeholder:
          "Example: Soft corporate background music for a business promo video.",
        button: "Generate Background Audio",
        defaultStyle: "Background Music",
      };
    }

    return {
      title: "AI Song Studio",
      description:
        "Generate real AI music with lyrics and a downloadable audio file.",
      mainLabel: "1. Song Idea / Lyrics",
      placeholder:
        "Example: Create a Swahili Afrobeats song about dreams, success and Nairobi life.",
      button: "Generate Audio",
      defaultStyle: "Afrobeats",
    };
  }, [tool]);

  const generatedDraft = useMemo(() => {
    return [
      `Tool: ${tool}`,
      `Music style: ${songStyle || config.defaultStyle}`,
      `Language: ${songLanguage}`,
      `Voice style: ${voiceStyle}`,
      `Duration: ${songDuration}`,
      "",
      "Song Title:",
      `${config.title.replace(" Creator", "")} Draft`,
      "",
      "User instructions:",
      songLyrics.trim() || config.placeholder,
      "",
      "Generated by:",
      "xnewsapp.com Music AI",
      "Provider: fal.ai",
      "Model: MiniMax Music 3",
    ].join("\n");
  }, [
    config.defaultStyle,
    config.placeholder,
    config.title,
    songDuration,
    songLanguage,
    songLyrics,
    songStyle,
    tool,
    voiceStyle,
  ]);

  const handleGenerateAudio = async () => {
    if (!songLyrics.trim()) {
      alert("Please write the music details first.");
      return;
    }

    setIsGeneratingAudio(true);
    setAudioReady(false);
    setSongPreviewReady(false);
    setAudioUrl("");
    setAudioDurationSeconds(null);
    setSongStatus("Sending your music request to fal.ai...");

    try {
      const durationSeconds = getDurationSeconds(songDuration);
      const style = songStyle || config.defaultStyle;

      const prompt = buildMusicPrompt({
        tool,
        style,
        language: songLanguage,
        voiceStyle,
        duration: durationSeconds,
        userInstructions: songLyrics.trim(),
      });

      const lyrics = buildMusicLyrics(
        songLyrics.trim(),
        style,
        songLanguage
      );

      const { generateFalMusic } = await import(
        "@/lib/fal/falMusicService"
      );

      const result = await generateFalMusic({
        prompt,
        lyrics,
        durationSeconds,
      });

      if (result.status === "failed" || !result.audioUrl) {
        throw new Error(
          result.error || "fal.ai did not return generated audio."
        );
      }

      setAudioUrl(result.audioUrl);
      setAudioDurationSeconds(
        result.durationSeconds ?? durationSeconds
      );
      setAudioReady(true);
      setSongPreviewReady(true);

      setSongStatus(
        `${config.title} real AI audio generated by fal.ai and ready to play.`
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Music generation failed.";

      console.error("Music AI generation error:", error);

      setAudioReady(false);
      setSongPreviewReady(false);
      setAudioUrl("");
      setSongStatus(`Music generation failed: ${message}`);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleDownloadDraft = () => {
    if (!songPreviewReady) {
      alert("Please generate audio first.");
      return;
    }

    const blob = new Blob([generatedDraft], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "xnewsapp-song-draft.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleDownloadAudio = async () => {
    if (!audioUrl) {
      alert("Please generate audio first.");
      return;
    }

    try {
      setSongStatus("Preparing your generated audio download...");

      const response = await fetch(audioUrl);

      if (!response.ok) {
        throw new Error(
          `Could not download the generated audio (${response.status}).`
        );
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const extension = blob.type.includes("wav")
        ? "wav"
        : blob.type.includes("mpeg") || blob.type.includes("mp3")
          ? "mp3"
          : "wav";

      link.href = url;
      link.download = `xnewsapp-${tool
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}-ai-music.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setSongStatus("Generated AI music downloaded successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Audio download failed.";

      console.error("Music download error:", error);
      setSongStatus(`Audio download failed: ${message}`);
    }
  };

  const handleAddToVideo = async () => {
    if (!audioUrl) {
      alert("Please generate audio first.");
      return;
    }

    const durationSeconds =
      audioDurationSeconds ?? getDurationSeconds(songDuration);

    try {
      if (!onAddToVideo) {
        alert(
          "Desktop video timeline connection is not ready."
        );
        return;
      }

      setSongStatus(
        "Adding generated AI music to your video soundtrack..."
      );

      await onAddToVideo(
        audioUrl,
        durationSeconds,
        tool
      );

      setSongStatus(
        `AI music added to the video soundtrack (${Math.round(
          durationSeconds
        )} seconds).`
      );
    } catch (error) {
      console.error(
        "Add generated music to video failed:",
        error
      );

      setSongStatus(
        error instanceof Error
          ? `Could not add music to video: ${error.message}`
          : "Could not add generated music to video."
      );
    }
  };

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#111827] p-5 text-white shadow-creator">
      <div>
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-extrabold">
            {config.title}
          </h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          {config.description}
        </p>
      </div>

      <details className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
        <summary className="cursor-pointer list-none select-none">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-cyan-200">
                🎵 MUSIC AI
              </div>

              <div className="mt-1 text-sm font-bold text-white">
                {songDuration} ........{" "}
                {musicPricing[songDuration] ?? "$0.05"}
              </div>
            </div>

            <span className="text-lg font-extrabold text-cyan-200">
              Tap to View Prices ▼
            </span>
          </div>
        </summary>

        <div className="mt-4 space-y-2">
          {Object.entries(musicPricing).map(
            ([duration, price]) => (
              <button
                key={duration}
                type="button"
                onClick={(e) => {
                  setSongDuration(duration);
                  setSongPreviewReady(false);
                  setSongStatus("");
                  setAudioReady(false);
                  setAudioUrl("");
                  setAudioDurationSeconds(null);

                  const details = e.currentTarget.closest(
                    "details"
                  ) as HTMLDetailsElement | null;

                  if (details) {
                    details.open = false;
                  }
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition ${
                  songDuration === duration
                    ? "bg-cyan-500 text-black"
                    : "bg-slate-900/40 text-white hover:bg-cyan-500/20"
                }`}
              >
                <span>{duration}</span>
                <span>{price}</span>
              </button>
            )
          )}
        </div>
      </details>

      <div className="mt-5 space-y-5">
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
          <h4 className="text-sm font-extrabold text-white">
            Optional: Upload Reference Audio
          </h4>

          <p className="mt-1 text-xs leading-5 text-slate-300">
            Upload a voice note, beat, melody or sample for future
            reference audio workflows.
          </p>

          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-950/70 px-5 py-7 text-center transition hover:border-cyan-400/50 hover:bg-slate-950/90">
            <Upload className="mb-3 h-7 w-7 text-cyan-300" />

            <span className="text-sm font-extrabold text-white">
              Upload Audio
            </span>

            <span className="mt-1 text-xs font-medium text-slate-300">
              MP3, WAV, M4A or voice note
            </span>

            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={onMusicUpload}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold text-white">
            {config.mainLabel}
          </span>

          <textarea
            value={songLyrics}
            onChange={(e) => {
              setSongLyrics(e.target.value);
              setSongPreviewReady(false);
              setSongStatus("");
              setAudioReady(false);
              setAudioUrl("");
              setAudioDurationSeconds(null);
            }}
            placeholder={config.placeholder}
            className={textareaClass}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="2. Music Style"
            value={songStyle || config.defaultStyle}
            options={musicStyles}
            onChange={(value) => {
              setSongStyle(value);
              setSongPreviewReady(false);
              setSongStatus("");
              setAudioReady(false);
              setAudioUrl("");
              setAudioDurationSeconds(null);
            }}
          />

          <SelectField
            label="3. Language"
            value={songLanguage}
            options={languages}
            onChange={(value) => {
              setSongLanguage(value);
              setSongPreviewReady(false);
              setSongStatus("");
              setAudioReady(false);
              setAudioUrl("");
              setAudioDurationSeconds(null);
            }}
          />

          <SelectField
            label="4. Voice Style"
            value={voiceStyle}
            options={voiceStyles}
            onChange={(value) => {
              setVoiceStyle(value);
              setSongPreviewReady(false);
              setSongStatus("");
              setAudioReady(false);
              setAudioUrl("");
              setAudioDurationSeconds(null);
            }}
          />

          <SelectField
            label="5. Duration"
            value={songDuration}
            options={durations}
            onChange={(value) => {
              setSongDuration(value);
              setSongPreviewReady(false);
              setSongStatus("");
              setAudioReady(false);
              setAudioUrl("");
              setAudioDurationSeconds(null);
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (requestGeneration) {
              requestGeneration(
                musicPricing[songDuration] ?? "$0.05",
                handleGenerateAudio
              );
            } else {
              handleGenerateAudio();
            }
          }}
          disabled={isGeneratingAudio}
          className="h-12 w-full rounded-2xl bg-cyan-600 px-5 text-sm font-extrabold text-white transition hover:bg-cyan-500 disabled:opacity-60 md:w-auto"
        >
          {isGeneratingAudio ? (
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 inline h-4 w-4" />
          )}

          {isGeneratingAudio
            ? "Generating..."
            : config.button}
        </button>

        {songStatus && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-bold leading-5 text-emerald-100">
            {songStatus}
          </div>
        )}

        {audioReady && audioUrl && (
          <div className="space-y-4 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-cyan-200">
                Audio Preview
              </div>

              <p className="mt-1 text-xs font-medium leading-5 text-slate-300">
                Real AI audio generated by fal.ai.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="mb-3 text-xs font-bold text-white">
                {config.title} • {songDuration}
              </div>

              <audio
                controls
                preload="metadata"
                src={audioUrl}
                className="w-full"
              />

              {audioDurationSeconds !== null && (
                <div className="mt-2 text-[11px] font-semibold text-slate-400">
                  Generated duration:{" "}
                  {Math.round(audioDurationSeconds)} seconds
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadAudio}
                className="h-11 rounded-2xl bg-cyan-600 px-4 text-xs font-extrabold text-white hover:bg-cyan-500"
              >
                <Download className="mr-2 inline h-4 w-4" />
                Download Audio
              </button>

              <button
                type="button"
                onClick={handleDownloadDraft}
                className="h-11 rounded-2xl bg-slate-700 px-4 text-xs font-extrabold text-white hover:bg-slate-600"
              >
                <Download className="mr-2 inline h-4 w-4" />
                Download Draft
              </button>

              <button
                type="button"
                onClick={handleAddToVideo}
                disabled={!audioUrl}
                className="h-11 rounded-2xl bg-violet-600 px-4 text-xs font-extrabold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="mr-2 inline h-4 w-4" />
                Add To Video
              </button>
            </div>
          </div>
        )}

        {songPreviewReady && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-extrabold uppercase tracking-wide text-cyan-200">
              Generated Song Draft
            </div>

            <pre className="mt-2 max-h-[260px] overflow-auto whitespace-pre-wrap rounded-2xl bg-black/30 p-3 text-[11px] font-medium leading-5 text-slate-200">
              {generatedDraft}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
