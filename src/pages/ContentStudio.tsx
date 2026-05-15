import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Upload,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { loadFFmpeg } from "@/lib/ffmpeg";
import { saveAs } from "file-saver";
import { generateVoice } from "@/lib/voice";

const ContentStudio = () => {
  // =========================
  // FORM STATE
  // =========================
  const [videoPrompt, setVideoPrompt] =
    useState("");

  const [
    facebookCaption,
    setFacebookCaption,
  ] = useState("");

  // =========================
  // VOICEOVER STATE
  // =========================
  const speechRef =
    useRef<SpeechSynthesisUtterance | null>(
      null
    );

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [voiceText, setVoiceText] =
    useState("");

  const [speechRate, setSpeechRate] =
    useState(1);

  // =========================
  // VIDEO EXPORT STATE
  // =========================
  const previewContainerRef =
    useRef<HTMLDivElement | null>(null);

  const [isRecording, setIsRecording] =
    useState(false);

  const [isExporting, setIsExporting] =
    useState(false);

  // =========================
  // BACKGROUND MUSIC STATE
  // =========================
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const [
    backgroundMusic,
    setBackgroundMusic,
  ] = useState<File | null>(null);

  const [musicPreview, setMusicPreview] =
    useState("");

  const [isMusicPlaying, setIsMusicPlaying] =
    useState(false);

  // =========================
  // MEDIA STATE
  // =========================
  const [mediaFiles, setMediaFiles] =
    useState<File[]>([]);

  const [mediaPreviews, setMediaPreviews] =
    useState<string[]>([]);

  // =========================
  // SLIDESHOW STATE
  // =========================
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [isPlaying, setIsPlaying] =
    useState(true);

  // =========================
  // CLEANUP URLS
  // =========================
  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      if (musicPreview) {
        URL.revokeObjectURL(musicPreview);
      }

      window.speechSynthesis.cancel();
    };
  }, [mediaPreviews, musicPreview]);

  // =========================
  // FILTER IMAGES
  // =========================
  const imagePreviews = useMemo(() => {
    return mediaFiles
      .map((file, index) => ({
        file,
        preview: mediaPreviews[index],
      }))
      .filter((item) =>
        item.file.type.startsWith("image/")
      );
  }, [mediaFiles, mediaPreviews]);

  // =========================
  // AUTO PLAY
  // =========================
  useEffect(() => {
    if (!isPlaying) return;

    if (imagePreviews.length <= 1)
      return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === imagePreviews.length - 1
          ? 0
          : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, imagePreviews.length]);

  // =========================
  // HANDLE UPLOAD
  // =========================
  const handleMediaUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) return;

    mediaPreviews.forEach((url) =>
      URL.revokeObjectURL(url)
    );

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setMediaFiles(files);
    setMediaPreviews(previews);
    setCurrentIndex(0);
  };

  // =========================
  // MUSIC UPLOAD
  // =========================
  const handleMusicUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (musicPreview) {
      URL.revokeObjectURL(musicPreview);
    }

    const preview =
      URL.createObjectURL(file);

    setBackgroundMusic(file);
    setMusicPreview(preview);
  };

  // =========================
  // PLAY MUSIC
  // =========================
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play();
      setIsMusicPlaying(true);
    }
  };

  // =========================
  // SLIDE NAVIGATION
  // =========================
  const nextSlide = () => {
    if (imagePreviews.length === 0)
      return;

    setCurrentIndex((prev) =>
      prev === imagePreviews.length - 1
        ? 0
        : prev + 1
    );
  };

  const prevSlide = () => {
    if (imagePreviews.length === 0)
      return;

    setCurrentIndex((prev) =>
      prev === 0
        ? imagePreviews.length - 1
        : prev - 1
    );
  };

  // =========================
  // FACEBOOK SHARE
  // =========================
  const shareToFacebook = () => {
    const shareUrl = encodeURIComponent(
      window.location.href
    );

    const quote = encodeURIComponent(
      facebookCaption ||
        "Created with XNewsApp Content Studio"
    );

    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${quote}`;

    window.open(
      fbUrl,
      "_blank",
      "width=700,height=500"
    );
  };

  // =========================
  // LOAD FFMPEG ENGINE
  // =========================
  const initializeFFmpeg = async () => {
    try {
      setIsExporting(true);

      const ffmpeg = await loadFFmpeg();

      console.log(
        "FFmpeg engine ready:",
        ffmpeg
      );

      alert(
        "FFmpeg loaded successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load FFmpeg."
      );
    } finally {
      setIsExporting(false);
    }
  };

  // =========================
  // GENERATE PLACEHOLDER
  // =========================
  const generateVideo = () => {
    alert(
      "AI video generation coming in next phases."
    );
  };

  // =========================
  // VIDEO EXPORT
  // =========================
  const startRecording = async () => {
    try {
      if (imagePreviews.length === 0) {
        alert(
          "Please upload images first."
        );
        return;
      }

      setIsRecording(true);

      const ffmpeg =
        await loadFFmpeg();

      try {
        await ffmpeg.deleteFile(
          "slideshow.mp4"
        );
      } catch {}

      for (
        let i = 0;
        i < imagePreviews.length;
        i++
      ) {
        const image =
          imagePreviews[i];

        const response = await fetch(
          image.preview
        );

        const blob =
          await response.blob();

        const buffer =
          await blob.arrayBuffer();

        await ffmpeg.writeFile(
          `image${i}.png`,
          new Uint8Array(buffer)
        );
      }

      await ffmpeg.exec([
        "-framerate",
        "1/5",

        "-i",
        "image%d.png",

        "-vf",
        "scale=1280:720,format=yuv420p",

        "-c:v",
        "libx264",

        "-pix_fmt",
        "yuv420p",

        "-preset",
        "ultrafast",

        "slideshow.mp4",
      ]);

      const data =
        await ffmpeg.readFile(
          "slideshow.mp4"
        );

      const videoBlob = new Blob(
        [data],
        {
          type: "video/mp4",
        }
      );

      saveAs(
        videoBlob,
        "xnewsapp-slideshow.mp4"
      );

      alert(
        "MP4 slideshow exported successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to generate MP4 video."
      );
    } finally {
      setIsRecording(false);
    }
  };

  // =========================
  // AI VOICEOVER
  // =========================
  const startVoiceover = () => {
    if (!voiceText.trim()) return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        voiceText
      );

    utterance.rate = speechRate;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechRef.current = utterance;

    window.speechSynthesis.speak(
      utterance
    );
  };

  // =========================
  // STOP VOICEOVER
  // =========================
  const stopVoiceover = () => {
    window.speechSynthesis.cancel();

    setIsSpeaking(false);
  };

  // =========================
  // REAL AI VOICE GENERATION
  // =========================
  const generateRealVoice = async () => {
    try {
      if (!voiceText.trim()) {
        alert("Please type voice text.");
        return;
      }

      setIsExporting(true);

      const audioBlob =
        await generateVoice(
          voiceText
        );

      saveAs(
        audioBlob,
        "xnewsapp-voiceover.mp3"
      );

      alert(
        "AI voice generated successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to generate AI voice."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          AI Content Studio
        </h1>

        <p className="text-gray-500 mt-2">
          Upload videos or images, create
          media content, and share instantly
          to Facebook.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Create AI Video
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Video Prompt
              </label>

              <textarea
                value={videoPrompt}
                onChange={(e) =>
                  setVideoPrompt(
                    e.target.value
                  )
                }
                placeholder="Example: Breaking news about floods in Nairobi..."
                className="w-full border rounded-lg p-3 min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Facebook Caption
              </label>

              <textarea
                value={facebookCaption}
                onChange={(e) =>
                  setFacebookCaption(
                    e.target.value
                  )
                }
                placeholder="Write a caption for your Facebook post..."
                className="w-full border rounded-lg p-3 min-h-[100px]"
              />
            </div>

            <div className="space-y-3 mt-6">
              <label className="font-semibold text-sm">
                AI Voiceover Script
              </label>

              <textarea
                value={voiceText}
                onChange={(e) =>
                  setVoiceText(
                    e.target.value
                  )
                }
                placeholder="Type narration text..."
                className="w-full border rounded-lg p-3 min-h-[120px]"
              />

              <div className="space-y-2">
                <label className="text-sm">
                  Speech Speed
                </label>

                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) =>
                    setSpeechRate(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={startVoiceover}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ▶ Play Voiceover
                </Button>

                <Button
                  onClick={stopVoiceover}
                  className="bg-red-600 hover:bg-red-700"
                >
                  ■ Stop Voice
                </Button>

                <Button
                  onClick={generateRealVoice}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Generate Real AI Voice
                </Button>
              </div>

              {isSpeaking && (
                <p className="text-green-600 text-sm">
                  AI narration speaking...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentStudio;
