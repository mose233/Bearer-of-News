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

const durations = ["15 sec", "30 sec", "60 sec", "120 sec", "Full Song"];

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
}: MusicStudioPanelProps) {
  const [voiceStyle, setVoiceStyle] = useState("Afrobeats Male Voice");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const config = useMemo(() => {
    const lowerTool = tool.toLowerCase();

    if (lowerTool.includes("birthday")) {
      return {
        title: "Birthday Song Creator",
        description:
          "Generate birthday audio with lyrics, voice direction and a downloadable draft.",
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
          "Generate beat direction and future audio instructions for production.",
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
        "Generate audio and an editable song draft for future fal.ai music generation.",
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
      "Lyrics Structure:",
      "Verse 1:",
      "Write the opening story or message here.",
      "",
      "Chorus:",
      "Repeat the strongest hook here.",
      "",
      "Verse 2:",
      "Add emotion, details, names or location here.",
      "",
      "Bridge / Chant:",
      "Add a memorable chant, worship line, slogan or call-and-response.",
      "",
      "fal.ai Audio Prompt:",
      `Generate ${songDuration} ${songStyle || config.defaultStyle} audio in ${songLanguage} using ${voiceStyle}. Keep it polished, social-media ready and suitable for XNewsApp export.`,
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

  const handleGenerateAudio = () => {
    if (!songLyrics.trim()) {
      alert("Please write the music details first.");
      return;
    }

    setIsGeneratingAudio(true);
    setSongStatus("Generating audio preview...");

    window.setTimeout(() => {
      setAudioReady(true);
      setSongPreviewReady(true);
      setIsGeneratingAudio(false);
      setSongStatus(
        `${config.title} audio request prepared. fal.ai will generate the real MP3/WAV when connected.`
      );
    }, 700);
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

  const handleDownloadAudio = () => {
    if (!audioReady) {
      alert("Please generate audio first.");
      return;
    }

    const audioPlaceholder = [
      "XNewsApp Audio Placeholder",
      "",
      "Real MP3/WAV download will be enabled when fal.ai is connected.",
      "",
      generatedDraft,
    ].join("\n");

    const blob = new Blob([audioPlaceholder], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "xnewsapp-audio-placeholder.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#111827] p-5 text-white shadow-creator">
      <div>
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-extrabold">{config.title}</h3>
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          {config.description}
        </p>
      </div>

      <div className="mt-5 space-y-5">
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
          <h4 className="text-sm font-extrabold text-white">
            Optional: Upload Reference Audio
          </h4>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            Upload a voice note, beat, melody or sample for audio generation.
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
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleGenerateAudio}
          disabled={isGeneratingAudio}
          className="h-12 w-full rounded-2xl bg-cyan-600 px-5 text-sm font-extrabold text-white transition hover:bg-cyan-500 disabled:opacity-60 md:w-auto"
        >
          {isGeneratingAudio ? (
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 inline h-4 w-4" />
          )}
          {isGeneratingAudio ? "Generating..." : config.button}
        </button>

        {songStatus && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-bold leading-5 text-emerald-100">
            {songStatus}
          </div>
        )}

        {audioReady && (
          <div className="space-y-4 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-cyan-200">
                Audio Preview
              </div>
              <p className="mt-1 text-xs font-medium leading-5 text-slate-300">
                Real playable MP3/WAV will appear here after fal.ai is connected.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="mb-2 text-xs font-bold text-white">
                {config.title} • {songDuration}
              </div>
              <div className="h-10 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-slate-300">
                Audio player placeholder
              </div>
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
                onClick={() =>
                  alert("Add To Video will attach generated audio to the video timeline after real audio is connected.")
                }
                className="h-11 rounded-2xl bg-violet-600 px-4 text-xs font-extrabold text-white hover:bg-violet-500"
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
