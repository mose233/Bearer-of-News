import React, { useMemo, useState } from "react";

import TextFontStudio from "@/components/creator/TextFontStudio.tsx";
import { getFontByName } from "@/lib/creator/fontLibrary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Wand2,
  Film,
  Sparkles,
  Crown,
  ImagePlus,
  Captions,
  Music,
  Download,
  Loader2,
  Share2,
} from "lucide-react";

const providers = [
  {
    id: "xnews-fast",
    name: "XNews Fast",
    label: "Affordable",
    description:
      "Best for Kenya-first short social videos, memes, photo animation and fast creator content.",
    price: "Low cost",
    idealFor: "Mass users, M-Pesa micro-payments",
  },
  {
    id: "luma-style",
    name: "Luma-style Quick Video",
    label: "Viral",
    description:
      "Fast prompt-to-video or image-to-video generation for cinematic and viral short clips.",
    price: "Medium",
    idealFor: "Dancing clips, transformations, AI trends",
  },
  {
    id: "ltx-style",
    name: "LTX-style Storyboard",
    label: "Workflow",
    description:
      "Storyboard-first scene planning with character, shot and caption control.",
    price: "Medium / Pro",
    idealFor: "Ads, explainers, news stories, brand videos",
  },
  {
    id: "veo-style",
    name: "Veo-style Premium",
    label: "Premium",
    description:
      "High-quality cinematic generation for premium users and professional creators.",
    price: "High",
    idealFor: "Premium cinematic videos",
  },
];

const styles = [
  "Realistic",
  "Cinematic",
  "Gen Z Viral",
  "News Report",
  "Comedy",
  "Music Visual",
  "Ad / Promo",
  "Documentary",
];

const languages = [
  "English",
  "Swahili",
  "Sheng",
  "Kisii",
  "Lingala",
  "Hindi",
  "Urdu",
  "Bengali",
  "Tamil",
  "Filipino",
];

const ratios = [
  "9:16 TikTok/Reels",
  "1:1 Facebook/Instagram",
  "16:9 YouTube",
  "4:5 Social Feed",
];

const durations = ["10 sec", "15 sec", "30 sec", "45 sec", "60 sec"];

function makeScenes(prompt: string, language: string, style: string) {
  const base =
    prompt || "A young Kenyan creator promoting a new fashion brand in Nairobi";

  return [
    {
      title: "Hook Scene",
      prompt: `${base}. Opening shot. ${style} style. Strong attention-grabbing first 3 seconds.`,
      caption:
        language === "Swahili"
          ? "Hii ndiyo trend mpya!"
          : "This is the new trend!",
    },
    {
      title: "Main Story",
      prompt: `${base}. Main action scene with clear movement, expressive character and social-media energy.`,
      caption:
        language === "Swahili"
          ? "Unda video zako kwa AI haraka."
          : "Create your videos fast with AI.",
    },
    {
      title: "Call To Action",
      prompt: `${base}. Final scene with product, creator or message clearly visible.`,
      caption:
        language === "Swahili"
          ? "Jaribu sasa na ushare Facebook."
          : "Try it now and share to Facebook.",
    },
  ];
}

export default function AIVideoStudioPanel() {
  const [provider, setProvider] = useState("xnews-fast");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Gen Z Viral");
  const [language, setLanguage] = useState("Swahili");
  const [ratio, setRatio] = useState("9:16 TikTok/Reels");
  const [duration, setDuration] = useState("30 sec");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selectedCreatorFont, setSelectedCreatorFont] = useState("Bebas Neue");

  const selectedFont = useMemo(
    () => getFontByName(selectedCreatorFont),
    [selectedCreatorFont],
  );

  const selectedFontStyle = useMemo(
    () => ({ fontFamily: selectedFont.cssFamily }),
    [selectedFont.cssFamily],
  );

  const selectedProvider = useMemo(
    () => providers.find((item) => item.id === provider),
    [provider],
  );

  const scenes = useMemo(
    () => makeScenes(prompt, language, style),
    [prompt, language, style],
  );

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerated(false);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 1200);
  };

  return (
    <div className="space-y-4 text-white">
      <div className="rounded-[1.25rem] border border-white/10 bg-[#111827] px-4 py-4 shadow-creator">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1
              className="text-2xl font-extrabold tracking-tight text-white"
              style={selectedFontStyle}
            >
              XNewsApp AI Video Studio
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Create social videos using prompts, storyboard scenes, captions,
              music, and Facebook-ready exports.
            </p>
          </div>

          <Badge className="w-fit bg-emerald-500 text-black hover:bg-emerald-500">
            Mock AI Mode
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="rounded-[1.25rem] border border-white/10 bg-[#111827] text-white shadow-creator">
          <CardHeader className="border-b border-white/10 px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-base font-extrabold">
              <Wand2 className="h-5 w-5" />
              Create Video
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 px-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Write your idea
              </label>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: A Kenyan Gen Z dancer in Nairobi promoting a fashion brand..."
                className="min-h-[120px] rounded-xl border-white/10 bg-[#0B1020] text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Style
                </label>

                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="border-white/10 bg-[#0B1020] text-white">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {styles.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Language
                </label>

                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="border-white/10 bg-[#0B1020] text-white">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {languages.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Duration
                </label>

                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="border-white/10 bg-[#0B1020] text-white">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {durations.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Aspect ratio
                </label>

                <Select value={ratio} onValueChange={setRatio}>
                  <SelectTrigger className="border-white/10 bg-[#0B1020] text-white">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {ratios.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

<div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
  <div className="text-xs font-extrabold uppercase tracking-wide text-emerald-300">
    🎬 Cinematic AI Pricing
  </div>

  <div className="mt-2 grid gap-2">
    <button
      type="button"
      onClick={() => setDuration("10 sec")}
      className="flex justify-between rounded-xl px-3 py-2 text-xs font-bold hover:bg-white/10"
    >
      <span>10 Seconds</span>
      <span>$0.72</span>
    </button>

    <button
      type="button"
      onClick={() => setDuration("20 sec")}
      className="flex justify-between rounded-xl px-3 py-2 text-xs font-bold hover:bg-white/10"
    >
      <span>20 Seconds</span>
      <span>$1.22</span>
    </button>

    <button
      type="button"
      onClick={() => setDuration("30 sec")}
      className="flex justify-between rounded-xl px-3 py-2 text-xs font-bold hover:bg-white/10"
    >
      <span>30 Seconds</span>
      <span>$1.72</span>
    </button>

    <button
      type="button"
      onClick={() => setDuration("40 sec")}
      className="flex justify-between rounded-xl px-3 py-2 text-xs font-bold hover:bg-white/10"
    >
      <span>40 Seconds</span>
      <span>$2.22</span>
    </button>

    <button
      type="button"
      onClick={() => setDuration("50 sec")}
      className="flex justify-between rounded-xl px-3 py-2 text-xs font-bold hover:bg-white/10"
    >
      <span>50 Seconds</span>
      <span>$2.72</span>
    </button>

    <button
      type="button"
      onClick={() => setDuration("60 sec")}
      className="flex justify-between rounded-xl px-3 py-2 text-xs font-bold hover:bg-white/10"
    >
      <span>60 Seconds</span>
      <span>$3.22</span>
    </button>
  </div>
</div>

<TextFontStudio
  tool="AI Music Video Studio"
  selectedFont={selectedCreatorFont}
  onFontChange={setSelectedCreatorFont}
/>

<div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                AI engine
              </label>

              <div className="grid gap-2">
                {providers.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProvider(item.id)}
                    className={`rounded-2xl border p-3 text-left transition ${
                      provider === item.id
                        ? "border-emerald-400 bg-emerald-400/10"
                        : "border-white/10 bg-[#0B1020] hover:bg-[#12192b]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="text-sm font-semibold"
                        style={selectedFontStyle}
                      >
                        {item.name}
                      </span>

                      <Badge variant="secondary">{item.label}</Badge>
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.idealFor}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="h-11 w-full rounded-2xl bg-emerald-500 font-bold text-black hover:bg-emerald-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Video Draft
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-[1.25rem] border border-white/10 bg-[#111827] text-white shadow-creator">
            <CardHeader className="border-b border-white/10 px-4 py-3">
              <CardTitle className="flex items-center gap-2 text-base font-extrabold">
                <Film className="h-5 w-5" />
                Selected Video Engine
              </CardTitle>
            </CardHeader>

            <CardContent className="px-4 py-4">
              <div className="rounded-2xl border border-white/10 bg-[#0B1020] p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2
                      className="flex items-center gap-2 text-lg font-bold"
                      style={selectedFontStyle}
                    >
                      {selectedProvider?.name}

                      {provider === "veo-style" && (
                        <Crown className="h-5 w-5 text-yellow-400" />
                      )}
                    </h2>

                    <p className="mt-2 text-sm text-slate-300">
                      {selectedProvider?.description}
                    </p>
                  </div>

                  <Badge className="w-fit bg-[#111827] hover:bg-[#111827]">
                    {selectedProvider?.price}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="storyboard" className="w-full">
            <TabsList className="rounded-2xl border border-white/10 bg-[#111827] p-1">
              <TabsTrigger value="storyboard">Storyboard</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="storyboard" className="mt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {scenes.map((scene, index) => (
                  <Card
                    key={scene.title}
                    className="rounded-2xl border border-white/10 bg-[#111827] text-white"
                  >
                    <CardHeader className="px-4 py-3">
                      <CardTitle
                        className="text-sm font-bold"
                        style={selectedFontStyle}
                      >
                        Scene {index + 1}: {scene.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 py-4">
                      <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c2435] to-[#090c14]">
                        <ImagePlus className="h-10 w-10 text-slate-500" />
                      </div>

                      <p className="text-xs leading-5 text-slate-400">
                        {scene.prompt}
                      </p>

                      <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-[#0B1020] p-3">
                        <Captions className="mt-0.5 h-4 w-4 text-emerald-400" />

                        <p
                          className="text-xs leading-5 text-slate-200"
                          style={selectedFontStyle}
                        >
                          {scene.caption}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <Card className="rounded-2xl border border-white/10 bg-[#111827] text-white">
                <CardContent className="p-4">
                  <div className="flex aspect-[9/16] flex-col items-center justify-center rounded-2xl border border-white/10 bg-black p-6 text-center md:aspect-video">
                    {generated ? (
                      <>
                        <Sparkles className="mb-4 h-12 w-12 text-emerald-400" />

                        <h3
                          className="text-2xl font-bold"
                          style={selectedFontStyle}
                        >
                          Video Draft Ready
                        </h3>

                        <p className="mt-2 max-w-md text-sm text-slate-400">
                          This is the mock preview area. Later it will show real
                          MP4 generation from fal.ai, Runware, Luma, Veo or your
                          selected backend.
                        </p>
                      </>
                    ) : (
                      <>
                        <Film className="mb-4 h-12 w-12 text-slate-600" />

                        <h3
                          className="text-2xl font-bold"
                          style={selectedFontStyle}
                        >
                          No preview yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                          Click generate to create a safe mock video draft.
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="mt-4">
              <Card className="rounded-2xl border border-white/10 bg-[#111827] text-white">
                <CardContent className="space-y-4 p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-[#0B1020] p-4">
                      <Music className="mb-2 h-5 w-5 text-emerald-400" />

                      <h3 className="font-semibold" style={selectedFontStyle}>
                        Music
                      </h3>

                      <p className="text-sm text-slate-400">
                        Add music library later.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0B1020] p-4">
                      <Captions className="mb-2 h-5 w-5 text-emerald-400" />

                      <h3 className="font-semibold" style={selectedFontStyle}>
                        Captions
                      </h3>

                      <p className="text-sm text-slate-400">
                        Auto captions ready for backend.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0B1020] p-4">
                      <Share2 className="mb-2 h-5 w-5 text-emerald-400" />

                      <h3 className="font-semibold" style={selectedFontStyle}>
                        Facebook
                      </h3>

                      <p className="text-sm text-slate-400">
                        Connect Meta publishing later.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="rounded-2xl bg-slate-100 font-bold text-black hover:bg-white"
                      style={selectedFontStyle}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export MP4
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
