import { useMemo } from "react";
import { Download, Loader2, Music, Upload, Wand2 } from "lucide-react";

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
  const config = useMemo(() => {
    const lowerTool = tool.toLowerCase();

    if (lowerTool.includes("birthday")) {
      return {
        title: "Birthday Song Creator",
        description:
          "Create a personalized birthday song draft with lyrics, style, voice and fal.ai-ready audio instructions.",
        mainLabel: "1. Birthday Details",
        placeholder:
          "Example: Birthday person: Sarah. Age: 25. Message: May God bless you with joy, success and long life.",
        button: "Create Birthday Song Draft",
        defaultStyle: "Birthday Song",
      };
    }

    if (lowerTool.includes("wedding")) {
      return {
        title: "Wedding Song Creator",
        description:
          "Create a wedding song draft for couples, invitations, memories and celebration videos.",
        mainLabel: "1. Wedding Details",
        placeholder:
          "Example: Couple: Brian and Faith. Message: A beautiful love story, family blessing and joyful celebration.",
        button: "Create Wedding Song Draft",
        defaultStyle: "Wedding Song",
      };
    }

    if (lowerTool.includes("love")) {
      return {
        title: "Love Song Creator",
        description:
          "Create romantic song lyrics and audio instructions for dedications, reels and status videos.",
        mainLabel: "1. Love Message",
        placeholder:
          "Example: Write a romantic song for my partner about loyalty, distance and true love.",
        button: "Create Love Song Draft",
        defaultStyle: "Love Ballad",
      };
    }

    if (lowerTool.includes("baby")) {
      return {
        title: "Baby Dedication Song Creator",
        description:
          "Create a warm baby dedication song draft for family, church and celebration videos.",
        mainLabel: "1. Baby Dedication Details",
        placeholder:
          "Example: Baby name: Ethan. Message: A blessing to the family, protected by God and loved by everyone.",
        button: "Create Baby Song Draft",
        defaultStyle: "Gospel",
      };
    }

    if (lowerTool.includes("gospel")) {
      return {
        title: "Gospel Song Creator",
        description:
          "Create gospel song lyrics and fal.ai-ready instructions for worship, testimony and praise.",
        mainLabel: "1. Gospel Song Message",
        placeholder:
          "Example: Write a gospel song about God's mercy, hope, healing and victory.",
        button: "Create Gospel Song Draft",
        defaultStyle: "Gospel",
      };
    }

    if (lowerTool.includes("praise") || lowerTool.includes("worship")) {
      return {
        title: "Praise & Worship Song Creator",
        description:
          "Create praise and worship song drafts for church, choirs, services and events.",
        mainLabel: "1. Worship Theme",
        placeholder:
          "Example: Create a worship song about surrender, faith, gratitude and God's presence.",
        button: "Create Worship Song Draft",
        defaultStyle: "Praise & Worship",
      };
    }

    if (lowerTool.includes("bible")) {
      return {
        title: "Bible Verse Song Creator",
        description:
          "Turn a Bible verse or faith message into a song draft for worship or social videos.",
        mainLabel: "1. Bible Verse / Message",
        placeholder:
          "Example: Psalm 23. The Lord is my shepherd. Make it calm, powerful and worshipful.",
        button: "Create Bible Song Draft",
        defaultStyle: "Gospel",
      };
    }

    if (lowerTool.includes("choir")) {
      return {
        title: "Choir Song Creator",
        description:
          "Create choir-style song drafts for church, school, memorials and celebrations.",
        mainLabel: "1. Choir Song Message",
        placeholder:
          "Example: Create a choir song about unity, faith and thanksgiving.",
        button: "Create Choir Song Draft",
        defaultStyle: "Choir",
      };
    }

    if (lowerTool.includes("afrobeats")) {
      return {
        title: "Afrobeats Song Creator",
        description:
          "Create an Afrobeats song draft for reels, celebrations, music videos and social content.",
        mainLabel: "1. Song Topic",
        placeholder:
          "Example: Create a catchy Afrobeats song about success, dancing and Nairobi nightlife.",
        button: "Create Afrobeats Draft",
        defaultStyle: "Afrobeats",
      };
    }

    if (lowerTool.includes("amapiano")) {
      return {
        title: "Amapiano Song Creator",
        description:
          "Create an Amapiano song draft with rhythm, hook, vibe and audio generation instructions.",
        mainLabel: "1. Song Topic",
        placeholder:
          "Example: Create an Amapiano song for a party, dance challenge and good vibes.",
        button: "Create Amapiano Draft",
        defaultStyle: "Amapiano",
      };
    }

    if (lowerTool.includes("bongo")) {
      return {
        title: "Bongo Flava Song Creator",
        description:
          "Create a Bongo Flava song draft for love, life, dance or social videos.",
        mainLabel: "1. Song Topic",
        placeholder:
          "Example: Create a Bongo Flava love song in Swahili about missing someone.",
        button: "Create Bongo Flava Draft",
        defaultStyle: "Bongo Flava",
      };
    }

    if (lowerTool.includes("hip hop")) {
      return {
        title: "Hip Hop Song Creator",
        description:
          "Create hip hop lyrics, hook and production direction for rap, motivation and street stories.",
        mainLabel: "1. Rap Topic",
        placeholder:
          "Example: Create a rap about hustle, education, Nairobi streets and building a better future.",
        button: "Create Hip Hop Draft",
        defaultStyle: "Hip Hop",
      };
    }

    if (lowerTool.includes("dancehall")) {
      return {
        title: "Dancehall Song Creator",
        description:
          "Create dancehall song drafts for parties, reels, clubs and social videos.",
        mainLabel: "1. Dancehall Song Topic",
        placeholder:
          "Example: Create a dancehall chorus about confidence, style and weekend vibes.",
        button: "Create Dancehall Draft",
        defaultStyle: "Dancehall",
      };
    }

    if (lowerTool.includes("business") || lowerTool.includes("jingle")) {
      return {
        title: "Business Jingle Creator",
        description:
          "Create short business jingles for ads, radio, TikTok, products and local brands.",
        mainLabel: "1. Business / Product Details",
        placeholder:
          "Example: Business: Mose Salon. Services: hair, nails, makeup. Location: Nairobi. Make it catchy.",
        button: "Create Jingle Draft",
        defaultStyle: "Business Jingle",
      };
    }

    if (lowerTool.includes("political") || lowerTool.includes("campaign")) {
      return {
        title: "Political Campaign Song Creator",
        description:
          "Create neutral campaign song drafts for public messaging, rallies and civic communication.",
        mainLabel: "1. Campaign Message",
        placeholder:
          "Example: Candidate name, slogan, county/region, peaceful message and key promise.",
        button: "Create Campaign Song Draft",
        defaultStyle: "Campaign Song",
      };
    }

    if (lowerTool.includes("school")) {
      return {
        title: "School Anthem Creator",
        description:
          "Create school anthem drafts using school name, motto, values, pride and choir style.",
        mainLabel: "1. School Details",
        placeholder:
          "Example: School: Hope Academy. Motto: Learn and Serve. Values: discipline, excellence and faith.",
        button: "Create School Anthem Draft",
        defaultStyle: "School Anthem",
      };
    }

    if (lowerTool.includes("lyrics")) {
      return {
        title: "Lyrics Generator",
        description:
          "Generate lyrics for songs, reels, worship, ads and social media.",
        mainLabel: "1. Lyrics Topic / Message",
        placeholder:
          "Example: Write motivational lyrics about working hard and never giving up.",
        button: "Generate Lyrics Draft",
        defaultStyle: "Afrobeats",
      };
    }

    if (lowerTool.includes("beat")) {
      return {
        title: "Beat Generator",
        description:
          "Create beat and production instructions ready for real audio generation later.",
        mainLabel: "1. Beat Description",
        placeholder:
          "Example: Energetic Gengetone beat with heavy drums, club bass and viral TikTok feel.",
        button: "Create Beat Draft",
        defaultStyle: "Gengetone",
      };
    }

    if (lowerTool.includes("background")) {
      return {
        title: "Background Music Generator",
        description:
          "Create background music direction for videos, adverts, news, reels and presentations.",
        mainLabel: "1. Background Music Purpose",
        placeholder:
          "Example: Soft corporate background music for a business promo video.",
        button: "Create Background Music Draft",
        defaultStyle: "Background Music",
      };
    }

    return {
      title: "AI Song Studio",
      description:
        "Create a structured song draft now and generate real audio later through fal.ai.",
      mainLabel: "1. Song Idea / Lyrics",
      placeholder:
        "Example: Create a Swahili Afrobeats song about dreams, success and Nairobi life.",
      button: "Create Song Draft",
      defaultStyle: "Afrobeats",
    };
  }, [tool]);

  const buildMusicPrompt = () => {
    return [
      `Tool: ${tool}`,
      `Music style: ${songStyle || config.defaultStyle}`,
      `Language: ${songLanguage}`,
      `Duration: ${songDuration}`,
      "",
      "User instructions:",
      songLyrics.trim() || config.placeholder,
      "",
      "Create:",
      "- Song title",
      "- Verse 1",
      "- Chorus",
      "- Verse 2",
      "- Bridge or chant",
      "- Audio generation prompt",
      "- Voice style recommendation",
      "",
      "Future fal.ai instruction:",
      "Use this structured draft to generate real MP3/WAV audio when the fal.ai audio model is connected.",
    ].join("\\n");
  };

  const handleCreateDraft = () => {
    if (!songLyrics.trim()) {
      alert("Please write the music details first.");
      return;
    }

    setSongPreviewReady(true);
    setSongStatus(
      `${config.title} prepared in ${songLanguage}, ${songStyle || config.defaultStyle}, ${songDuration}.`
    );
  };

  const handleDownloadDraft = () => {
    if (!songPreviewReady) {
      alert("Please create the music draft first.");
      return;
    }

    const blob = new Blob([buildMusicPrompt()], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "xnewsapp-music-draft.txt";
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
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-xs font-bold leading-5 text-cyan-100">
          Structure ready for fal.ai: drafts work now, real audio generation can be connected later without redesigning this screen.
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
            }}
          />

          <SelectField
            label="4. Voice Style"
            value="Afrobeats Male Voice"
            options={voiceStyles}
            onChange={() => {}}
          />

          <SelectField
            label="5. Duration"
            value={songDuration}
            options={durations}
            onChange={(value) => {
              setSongDuration(value);
              setSongPreviewReady(false);
              setSongStatus("");
            }}
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
          <h4 className="text-sm font-extrabold text-white">
            Optional: Upload Reference Audio
          </h4>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            Upload a voice note, beat, melody or sample for future audio generation.
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

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCreateDraft}
            className="h-12 w-full rounded-2xl bg-cyan-600 px-5 text-sm font-extrabold text-white transition hover:bg-cyan-500 md:w-auto"
          >
            <Wand2 className="mr-2 inline h-4 w-4" />
            {config.button}
          </button>

          <button
            type="button"
            onClick={() =>
              alert("Real audio generation will connect here through fal.ai after payments and API setup.")
            }
            className="h-12 w-full rounded-2xl bg-violet-600 px-5 text-sm font-extrabold text-white transition hover:bg-violet-500 md:w-auto"
          >
            <Loader2 className="mr-2 inline h-4 w-4" />
            Generate Real Audio
          </button>

          <button
            type="button"
            onClick={handleDownloadDraft}
            className="h-12 w-full rounded-2xl bg-slate-700 px-5 text-sm font-extrabold text-white transition hover:bg-slate-600 md:w-auto"
          >
            <Download className="mr-2 inline h-4 w-4" />
            Download Draft
          </button>
        </div>

        {songStatus && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs font-bold leading-5 text-emerald-100">
            {songStatus}
          </div>
        )}

        {songPreviewReady && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-extrabold uppercase tracking-wide text-cyan-200">
              Draft Ready
            </div>
            <p className="mt-1 text-xs font-medium leading-5 text-slate-300">
              This music draft is ready for lyrics, voice direction and future fal.ai audio generation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
