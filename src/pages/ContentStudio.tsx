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
  const [videoPrompt, setVideoPrompt] = useState("");
  const [facebookCaption, setFacebookCaption] = useState("");

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [speechRate, setSpeechRate] = useState(1);
  const [voiceVolume, setVoiceVolume] = useState(1);
  const [aiVoiceBlob, setAiVoiceBlob] = useState<Blob | null>(null);

  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [backgroundMusic, setBackgroundMusic] = useState<File | null>(null);
  const [musicPreview, setMusicPreview] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.18);

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));

      if (musicPreview) {
        URL.revokeObjectURL(musicPreview);
      }

      window.speechSynthesis.cancel();
    };
  }, [mediaPreviews, musicPreview]);

  const imagePreviews = useMemo(() => {
    return mediaFiles
      .map((file, index) => ({
        file,
        preview: mediaPreviews[index],
      }))
      .filter((item) => item.file.type.startsWith("image/"));
  }, [mediaFiles, mediaPreviews]);

  useEffect(() => {
    if (!isPlaying) return;
    if (imagePreviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === imagePreviews.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, imagePreviews.length]);

  const generateAIScript = () => {
    const prompt = videoPrompt.trim();

    if (!prompt) {
      alert("Please write a video prompt first.");
      return;
    }

    const cleanPrompt = prompt.replace(/\s+/g, " ");

    const generatedCaption = `🚨 Breaking Update: ${cleanPrompt}

Stay informed with XNewsApp for the latest updates, verified reports, and developing stories.`;

    const generatedVoice = `Breaking news update from XNewsApp.

${cleanPrompt}

We are following this developing story closely. Stay with XNewsApp for timely updates, clear reporting, and trusted news coverage.`;

    setFacebookCaption(generatedCaption);
    setVoiceText(generatedVoice);
    setAiVoiceBlob(null);

    alert("AI script generated successfully.");
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    mediaPreviews.forEach((url) => URL.revokeObjectURL(url));

    const previews = files.map((file) => URL.createObjectURL(file));

    setMediaFiles(files);
    setMediaPreviews(previews);
    setCurrentIndex(0);
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (musicPreview) {
      URL.revokeObjectURL(musicPreview);
    }

    const preview = URL.createObjectURL(file);

    setBackgroundMusic(file);
    setMusicPreview(preview);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.volume = musicVolume;
      audioRef.current.play();
      setIsMusicPlaying(true);
    }
  };

  const nextSlide = () => {
    if (imagePreviews.length === 0) return;

    setCurrentIndex((prev) =>
      prev === imagePreviews.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (imagePreviews.length === 0) return;

    setCurrentIndex((prev) =>
      prev === 0 ? imagePreviews.length - 1 : prev - 1
    );
  };

  const shareToFacebook = () => {
    const shareUrl = encodeURIComponent(window.location.href);

    const quote = encodeURIComponent(
      facebookCaption || "Created with XNewsApp Content Studio"
    );

    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${quote}`;

    window.open(fbUrl, "_blank", "width=700,height=500");
  };

  const initializeFFmpeg = async () => {
    try {
      setIsExporting(true);

      const ffmpeg = await loadFFmpeg();

      console.log("FFmpeg engine ready:", ffmpeg);

      alert("FFmpeg loaded successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to load FFmpeg.");
    } finally {
      setIsExporting(false);
    }
  };

  const generateVideo = () => {
    alert("AI video generation coming in next phases.");
  };

  const startVoiceover = () => {
    if (!voiceText.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(voiceText);

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

    window.speechSynthesis.speak(utterance);
  };

  const stopVoiceover = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const generateRealVoice = async () => {
    try {
      if (!voiceText.trim()) {
        alert("Please type voice text.");
        return;
      }

      setIsExporting(true);

      const audioBlob = await generateVoice(voiceText);

      setAiVoiceBlob(audioBlob);

      saveAs(audioBlob, "xnewsapp-voiceover.mp3");

      alert("AI voice generated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI voice.");
    } finally {
      setIsExporting(false);
    }
  };

  const createSlideshowVideo = async () => {
    const ffmpeg = await loadFFmpeg();

    try {
      await ffmpeg.deleteFile("slideshow.mp4");
    } catch {}

    try {
      await ffmpeg.deleteFile("final-video.mp4");
    } catch {}

    try {
      await ffmpeg.deleteFile("final-mixed-video.mp4");
    } catch {}

    try {
      await ffmpeg.deleteFile("voiceover.mp3");
    } catch {}

    try {
      await ffmpeg.deleteFile("background-music");
    } catch {}

    for (let i = 0; i < imagePreviews.length; i++) {
      const image = imagePreviews[i];

      const response = await fetch(image.preview);
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();

      await ffmpeg.writeFile(`image${i}.png`, new Uint8Array(buffer));
    }

    await ffmpeg.exec([
      "-framerate",
      "1/5",
      "-i",
      "image%d.png",
      "-vf",
      "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "ultrafast",
      "slideshow.mp4",
    ]);

    return ffmpeg;
  };

  const startRecording = async () => {
    try {
      if (imagePreviews.length === 0) {
        alert("Please upload images first.");
        return;
      }

      setIsRecording(true);

      const ffmpeg = await createSlideshowVideo();

      const data = await ffmpeg.readFile("slideshow.mp4");

      const videoBlob = new Blob([data], {
        type: "video/mp4",
      });

      saveAs(videoBlob, "xnewsapp-slideshow.mp4");

      alert("MP4 slideshow exported successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to generate MP4 video.");
    } finally {
      setIsRecording(false);
    }
  };

  const exportNarratedMp4 = async () => {
    try {
      if (imagePreviews.length === 0) {
        alert("Please upload images first.");
        return;
      }

      if (!voiceText.trim() && !aiVoiceBlob) {
        alert("Please type voice text first.");
        return;
      }

      setIsRecording(true);
      setIsExporting(true);

      const ffmpeg = await createSlideshowVideo();

      let voiceBlob = aiVoiceBlob;

      if (!voiceBlob) {
        voiceBlob = await generateVoice(voiceText);
        setAiVoiceBlob(voiceBlob);
      }

      const voiceBuffer = await voiceBlob.arrayBuffer();

      await ffmpeg.writeFile("voiceover.mp3", new Uint8Array(voiceBuffer));

      await ffmpeg.exec([
        "-i",
        "slideshow.mp4",
        "-i",
        "voiceover.mp3",
        "-filter_complex",
        `[1:a]volume=${voiceVolume}[voice]`,
        "-map",
        "0:v",
        "-map",
        "[voice]",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-shortest",
        "final-video.mp4",
      ]);

      const data = await ffmpeg.readFile("final-video.mp4");

      const finalBlob = new Blob([data], {
        type: "video/mp4",
      });

      saveAs(finalBlob, "xnewsapp-narrated-video.mp4");

      alert("Narrated MP4 exported successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to export narrated MP4.");
    } finally {
      setIsRecording(false);
      setIsExporting(false);
    }
  };

  const exportFinalMixedMp4 = async () => {
    try {
      if (imagePreviews.length === 0) {
        alert("Please upload images first.");
        return;
      }

      if (!voiceText.trim() && !aiVoiceBlob) {
        alert("Please type voice text first.");
        return;
      }

      setIsRecording(true);
      setIsExporting(true);

      const ffmpeg = await createSlideshowVideo();

      let voiceBlob = aiVoiceBlob;

      if (!voiceBlob) {
        voiceBlob = await generateVoice(voiceText);
        setAiVoiceBlob(voiceBlob);
      }

      const voiceBuffer = await voiceBlob.arrayBuffer();

      await ffmpeg.writeFile("voiceover.mp3", new Uint8Array(voiceBuffer));

      if (backgroundMusic) {
        const musicBuffer = await backgroundMusic.arrayBuffer();

        await ffmpeg.writeFile(
          "background-music",
          new Uint8Array(musicBuffer)
        );

        await ffmpeg.exec([
          "-i",
          "slideshow.mp4",
          "-i",
          "voiceover.mp3",
          "-stream_loop",
          "-1",
          "-i",
          "background-music",
          "-filter_complex",
          `[1:a]volume=${voiceVolume}[voice];[2:a]volume=${musicVolume}[music];[voice][music]amix=inputs=2:duration=first:dropout_transition=2[aout]`,
          "-map",
          "0:v",
          "-map",
          "[aout]",
          "-c:v",
          "copy",
          "-c:a",
          "aac",
          "-shortest",
          "final-mixed-video.mp4",
        ]);
      } else {
        await ffmpeg.exec([
          "-i",
          "slideshow.mp4",
          "-i",
          "voiceover.mp3",
          "-filter_complex",
          `[1:a]volume=${voiceVolume}[voice]`,
          "-map",
          "0:v",
          "-map",
          "[voice]",
          "-c:v",
          "copy",
          "-c:a",
          "aac",
          "-shortest",
          "final-mixed-video.mp4",
        ]);
      }

      const data = await ffmpeg.readFile("final-mixed-video.mp4");

      const finalBlob = new Blob([data], {
        type: "video/mp4",
      });

      saveAs(finalBlob, "xnewsapp-final-mixed-video.mp4");

      alert("Final mixed MP4 exported successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to export final mixed MP4.");
    } finally {
      setIsRecording(false);
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Content Studio</h1>

        <p className="text-gray-500 mt-2">
          Upload videos or images, create scripts, add AI voiceover, mix
          background music, and share instantly to Facebook.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create AI Video</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video Prompt</label>

              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Example: Breaking news about floods in Nairobi..."
                className="w-full border rounded-lg p-3 min-h-[120px]"
              />

              <Button
                onClick={generateAIScript}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Generate AI Script
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook Caption</label>

              <textarea
                value={facebookCaption}
                onChange={(e) => setFacebookCaption(e.target.value)}
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
                onChange={(e) => {
                  setVoiceText(e.target.value);
                  setAiVoiceBlob(null);
                }}
                placeholder="Type narration text..."
                className="w-full border rounded-lg p-3 min-h-[120px]"
              />

              <div className="space-y-2">
                <label className="text-sm">Speech Speed</label>

                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">
                  AI Voice Volume: {Math.round(voiceVolume * 100)}%
                </label>

                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(Number(e.target.value))}
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
                  disabled={isExporting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isExporting ? "Generating..." : "Generate Real AI Voice"}
                </Button>
              </div>

              {isSpeaking && (
                <p className="text-green-600 text-sm">
                  AI narration speaking...
                </p>
              )}

              {aiVoiceBlob && (
                <p className="text-blue-600 text-sm">
                  Real AI voice is ready for MP4 export.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Background Music</label>

              <Input
                type="file"
                accept="audio/*"
                onChange={handleMusicUpload}
              />

              <div className="space-y-2">
                <label className="text-sm">
                  Background Music Volume: {Math.round(musicVolume * 100)}%
                </label>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={musicVolume}
                  onChange={(e) => {
                    const volume = Number(e.target.value);
                    setMusicVolume(volume);

                    if (audioRef.current) {
                      audioRef.current.volume = volume;
                    }
                  }}
                  className="w-full"
                />
              </div>

              {backgroundMusic && (
                <div className="space-y-3 border rounded-xl p-4">
                  <p className="text-sm font-medium">{backgroundMusic.name}</p>

                  <audio
                    ref={audioRef}
                    src={musicPreview}
                    loop
                    onEnded={() => setIsMusicPlaying(false)}
                  />

                  <Button
                    type="button"
                    onClick={toggleMusic}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isMusicPlaying ? "Pause Music" : "Play Music"}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upload Images or Video
              </label>

              <label className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                <Upload className="w-10 h-10 text-gray-400 mb-3" />

                <span className="font-medium">Click to Upload</span>

                <span className="text-sm text-gray-500 mt-1">
                  Upload multiple images or videos
                </span>

                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={generateVideo}>Generate AI Video</Button>

              <Button
                variant="outline"
                onClick={shareToFacebook}
                className="flex items-center gap-2"
              >
                <Facebook className="w-4 h-4" />
                Share to Facebook
              </Button>

              <Button
                variant="secondary"
                onClick={initializeFFmpeg}
                disabled={isExporting}
              >
                {isExporting ? "Loading..." : "Initialize FFmpeg"}
              </Button>

              <Button
                variant="secondary"
                onClick={startRecording}
                disabled={isRecording}
              >
                {isRecording ? "Rendering..." : "Export Silent MP4"}
              </Button>

              <Button
                onClick={exportNarratedMp4}
                disabled={isRecording || isExporting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isRecording || isExporting
                  ? "Exporting Narrated MP4..."
                  : "Export Narrated MP4"}
              </Button>

              <Button
                onClick={exportFinalMixedMp4}
                disabled={isRecording || isExporting}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isRecording || isExporting
                  ? "Exporting Final MP4..."
                  : "Export Final Mixed MP4"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
          </CardHeader>

          <CardContent>
            {mediaFiles.length === 0 ? (
              <div className="h-[420px] border rounded-xl flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-16 h-16 mb-4" />
                <p>Generated video will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {imagePreviews.length > 0 && (
                  <div
                    ref={previewContainerRef}
                    className="relative overflow-hidden rounded-2xl border bg-black"
                  >
                    <div className="relative w-full h-[420px] overflow-hidden">
                      <img
                        src={imagePreviews[currentIndex]?.preview}
                        alt="preview"
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {facebookCaption && (
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3">
                            <p className="text-white text-lg font-semibold leading-relaxed whitespace-pre-wrap drop-shadow-lg">
                              {facebookCaption}
                            </p>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>

                      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                        {currentIndex + 1} / {imagePreviews.length}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-medium">Uploaded Files</h3>

                  <div className="space-y-2 max-h-[160px] overflow-y-auto">
                    {mediaFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 border rounded-lg p-2"
                      >
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Video className="w-5 h-5 text-purple-500" />
                        )}

                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm truncate">{file.name}</p>

                          <p className="text-xs text-gray-500">
                            {Math.round(file.size / 1024)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentStudio;