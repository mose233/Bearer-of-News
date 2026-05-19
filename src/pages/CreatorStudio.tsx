import React, { useEffect, useMemo, useRef, useState } from "react";
import { saveAs } from "file-saver";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import PromptPanel from "@/components/creator/PromptPanel";
import AiImagesPanel from "@/components/creator/AiImagesPanel";
import MediaUploader from "@/components/creator/MediaUploader";
import VoicePanel from "@/components/creator/VoicePanel";
import MusicPanel from "@/components/creator/MusicPanel";
import PreviewPanel from "@/components/creator/PreviewPanel";
import ExportPanel from "@/components/creator/ExportPanel";

import { loadFFmpeg } from "@/lib/ffmpeg";
import { generateVoice } from "@/lib/voice";
import { generateSceneImage } from "@/lib/creator/imageGeneration";

import {
  CreatorContentType,
  generateCreatorContent,
} from "@/lib/creator/templates";

import {
  exportFinalMixedMp4,
  exportNarratedMp4,
  exportSilentMp4,
  ImagePreviewItem,
} from "@/lib/creator/videoExport";

export default function CreatorStudio() {
  const [videoPrompt, setVideoPrompt] = useState("");
  const [facebookCaption, setFacebookCaption] = useState("");
  const [contentType, setContentType] =
    useState<CreatorContentType>("general");

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [speechRate, setSpeechRate] = useState(1);
  const [voiceVolume, setVoiceVolume] = useState(1);
  const [aiVoiceBlob, setAiVoiceBlob] = useState<Blob | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [backgroundMusic, setBackgroundMusic] = useState<File | null>(null);
  const [musicPreview, setMusicPreview] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.18);

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [sceneDurations, setSceneDurations] = useState<number[]>([]);

  const [aiImagePrompt, setAiImagePrompt] = useState("");
  const [generatedImageFile, setGeneratedImageFile] = useState<File | null>(
    null
  );
  const [generatedImagePreview, setGeneratedImagePreview] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const imagePreviews: ImagePreviewItem[] = useMemo(() => {
    return mediaFiles
      .map((file, index) => ({
        file,
        preview: mediaPreviews[index],
      }))
      .filter((item) => item.file.type.startsWith("image/"));
  }, [mediaFiles, mediaPreviews]);

  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));

      if (musicPreview) {
        URL.revokeObjectURL(musicPreview);
      }

      if (generatedImagePreview) {
        URL.revokeObjectURL(generatedImagePreview);
      }

      window.speechSynthesis.cancel();
    };
  }, [mediaPreviews, musicPreview, generatedImagePreview]);

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const handleGenerateScript = () => {
    if (!videoPrompt.trim()) {
      alert("Please write a video prompt first.");
      return;
    }

    const generated = generateCreatorContent(contentType, videoPrompt);

    setFacebookCaption(generated.caption);
    setVoiceText(generated.voice);
    setAiVoiceBlob(null);

    if (!aiImagePrompt.trim()) {
      setAiImagePrompt(videoPrompt);
    }

    alert("Script generated successfully.");
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    mediaPreviews.forEach((url) => URL.revokeObjectURL(url));

    const previews = files.map((file) => URL.createObjectURL(file));

    setMediaFiles(files);
    setMediaPreviews(previews);
    setSceneDurations(files.map(() => 5));
    setCurrentIndex(0);
  };

  const handleGenerateImage = async () => {
    try {
      const prompt = aiImagePrompt.trim() || videoPrompt.trim();

      if (!prompt) {
        alert("Please write an AI image prompt first.");
        return;
      }

      setIsGeneratingImage(true);

      const result = await generateSceneImage(prompt, "1024x1024");

      if (generatedImagePreview) {
        URL.revokeObjectURL(generatedImagePreview);
      }

      setGeneratedImageFile(result.file);
      setGeneratedImagePreview(result.previewUrl);

      alert("AI scene image generated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI scene image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAddGeneratedImage = () => {
    if (!generatedImageFile || !generatedImagePreview) {
      alert("Please generate an AI scene image first.");
      return;
    }

    setMediaFiles((prev) => [...prev, generatedImageFile]);
    setMediaPreviews((prev) => [...prev, generatedImagePreview]);
    setSceneDurations((prev) => [...prev, 5]);
    setCurrentIndex(mediaFiles.length);

    setGeneratedImageFile(null);
    setGeneratedImagePreview("");

    alert("AI image added to video timeline.");
  };

  const handleDeleteScene = (index: number) => {
    const fileToDelete = mediaFiles[index];
    const previewToDelete = mediaPreviews[index];

    if (!fileToDelete) return;

    if (previewToDelete) {
      URL.revokeObjectURL(previewToDelete);
    }

    const nextFiles = mediaFiles.filter((_, itemIndex) => itemIndex !== index);
    const nextPreviews = mediaPreviews.filter(
      (_, itemIndex) => itemIndex !== index
    );
    const nextDurations = sceneDurations.filter(
      (_, itemIndex) => itemIndex !== index
    );

    setMediaFiles(nextFiles);
    setMediaPreviews(nextPreviews);
    setSceneDurations(nextDurations);

    setCurrentIndex((prev) => {
      if (nextFiles.length === 0) return 0;
      if (prev >= nextFiles.length) return nextFiles.length - 1;
      return prev;
    });
  };

  const handleDuplicateScene = (index: number) => {
    const fileToCopy = mediaFiles[index];
    const previewToCopy = mediaPreviews[index];

    if (!fileToCopy || !previewToCopy) return;

    setMediaFiles((prev) => [
      ...prev.slice(0, index + 1),
      fileToCopy,
      ...prev.slice(index + 1),
    ]);

    setMediaPreviews((prev) => [
      ...prev.slice(0, index + 1),
      previewToCopy,
      ...prev.slice(index + 1),
    ]);

    setSceneDurations((prev) => [
      ...prev.slice(0, index + 1),
      prev[index] || 5,
      ...prev.slice(index + 1),
    ]);

    setCurrentIndex(index + 1);
  };

  const handleUpdateSceneDuration = (index: number, duration: number) => {
    const safeDuration = Math.min(Math.max(duration || 1, 1), 30);

    setSceneDurations((prev) => {
      const next = [...prev];
      next[index] = safeDuration;
      return next;
    });
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
    setIsMusicPlaying(false);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
      return;
    }

    audioRef.current.volume = musicVolume;

    audioRef.current
      .play()
      .then(() => setIsMusicPlaying(true))
      .catch((error) => {
        console.error(error);
        alert("Failed to play background music.");
      });
  };

  const startVoiceover = () => {
    if (!voiceText.trim()) {
      alert("Please type voice text first.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(voiceText);

    utterance.rate = speechRate;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

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
        alert("Please type voice text first.");
        return;
      }

      setIsExporting(true);

      const audioBlob = await generateVoice(voiceText);

      setAiVoiceBlob(audioBlob);

      saveAs(audioBlob, "creator-studio-voiceover.mp3");

      alert("AI voice generated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI voice.");
    } finally {
      setIsExporting(false);
    }
  };

  const shareToFacebook = () => {
    const shareUrl = encodeURIComponent(window.location.href);

    const quote = encodeURIComponent(
      facebookCaption || "Created with Creator Studio AI"
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

  const handleExportSilentMp4 = async () => {
    try {
      if (imagePreviews.length === 0) {
        alert("Please upload or generate images first.");
        return;
      }

      setIsRecording(true);

      const videoBlob = await exportSilentMp4(imagePreviews);

      saveAs(videoBlob, "creator-studio-silent-video.mp4");

      alert("Silent MP4 exported successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to export silent MP4.");
    } finally {
      setIsRecording(false);
    }
  };

  const handleExportNarratedMp4 = async () => {
    try {
      if (imagePreviews.length === 0) {
        alert("Please upload or generate images first.");
        return;
      }

      if (!aiVoiceBlob) {
        alert("Please generate AI voice first.");
        return;
      }

      setIsRecording(true);
      setIsExporting(true);

      const videoBlob = await exportNarratedMp4({
        imagePreviews,
        voiceBlob: aiVoiceBlob,
        voiceVolume,
      });

      saveAs(videoBlob, "creator-studio-narrated-video.mp4");

      alert("Narrated MP4 exported successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to export narrated MP4.");
    } finally {
      setIsRecording(false);
      setIsExporting(false);
    }
  };

  const handleExportFinalMixedMp4 = async () => {
    try {
      if (imagePreviews.length === 0) {
        alert("Please upload or generate images first.");
        return;
      }

      if (!aiVoiceBlob) {
        alert("Please generate AI voice first.");
        return;
      }

      setIsRecording(true);
      setIsExporting(true);

      const videoBlob = await exportFinalMixedMp4({
        imagePreviews,
        voiceBlob: aiVoiceBlob,
        voiceVolume,
        backgroundMusic,
        musicVolume,
      });

      saveAs(videoBlob, "creator-studio-final-video.mp4");

      alert("Final mixed MP4 exported successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to export final mixed MP4.");
    } finally {
      setIsRecording(false);
      setIsExporting(false);
    }
  };

  const handleGenerateCompleteVideo = async () => {
    try {
      if (!videoPrompt.trim()) {
        alert("Please write a video prompt first.");
        return;
      }

      if (imagePreviews.length === 0) {
        alert("Please upload or generate images first.");
        return;
      }

      setIsRecording(true);
      setIsExporting(true);

      const generated = generateCreatorContent(contentType, videoPrompt);

      setFacebookCaption(generated.caption);
      setVoiceText(generated.voice);

      const voiceBlob = await generateVoice(generated.voice);

      setAiVoiceBlob(voiceBlob);

      const videoBlob = await exportFinalMixedMp4({
        imagePreviews,
        voiceBlob,
        voiceVolume,
        backgroundMusic,
        musicVolume,
      });

      saveAs(videoBlob, "creator-studio-complete-ai-video.mp4");

      alert("Complete AI video generated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to generate complete AI video.");
    } finally {
      setIsRecording(false);
      setIsExporting(false);
    }
  };

  return (
    <main className="creator-shell">
      <div className="mx-auto max-w-7xl px-4 py-4 pb-28 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-5 space-y-3 sm:mb-8">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-creator-muted">
            Creator Studio AI
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-creator-text sm:text-4xl">
              Create social videos from your phone
            </h1>

            <p className="max-w-2xl text-sm leading-6 text-creator-muted sm:text-base">
              Build Facebook-ready videos with prompts, AI scenes, narration,
              music, captions, uploads, and MP4 export.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-6">
          <section className="space-y-4">
            <Card className="creator-card overflow-hidden">
              <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-6">
                <CardTitle className="text-lg font-bold text-creator-text">
                  1. Write your video idea
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5 px-4 py-5 sm:px-6">
                <PromptPanel
                  videoPrompt={videoPrompt}
                  setVideoPrompt={setVideoPrompt}
                  contentType={contentType}
                  setContentType={setContentType}
                  facebookCaption={facebookCaption}
                  setFacebookCaption={setFacebookCaption}
                  voiceText={voiceText}
                  setVoiceText={(value) => {
                    setVoiceText(value);
                    setAiVoiceBlob(null);
                  }}
                  onGenerateScript={handleGenerateScript}
                />
              </CardContent>
            </Card>

            <Card className="creator-card overflow-hidden">
              <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-6">
                <CardTitle className="text-lg font-bold text-creator-text">
                  2. Generate or upload scenes
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5 px-4 py-5 sm:px-6">
                <AiImagesPanel
                  aiImagePrompt={aiImagePrompt}
                  setAiImagePrompt={setAiImagePrompt}
                  isGeneratingImage={isGeneratingImage}
                  generatedImagePreview={generatedImagePreview}
                  onGenerateImage={handleGenerateImage}
                  onAddGeneratedImage={handleAddGeneratedImage}
                />

                <MediaUploader onMediaUpload={handleMediaUpload} />
              </CardContent>
            </Card>

            <Card className="creator-card overflow-hidden lg:hidden">
              <CardHeader className="border-b border-white/10 px-4 py-4">
                <CardTitle className="text-lg font-bold text-creator-text">
                  3. Preview and timeline
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-5">
                <PreviewPanel
                  mediaFiles={mediaFiles}
                  imagePreviews={imagePreviews}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  facebookCaption={facebookCaption}
                  sceneDurations={sceneDurations}
                  onDeleteScene={handleDeleteScene}
                  onDuplicateScene={handleDuplicateScene}
                  onUpdateSceneDuration={handleUpdateSceneDuration}
                />
              </CardContent>
            </Card>

            <Card className="creator-card overflow-hidden">
              <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-6">
                <CardTitle className="text-lg font-bold text-creator-text">
                  4. Voice and music
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 px-4 py-5 sm:px-6">
                <VoicePanel
                  speechRate={speechRate}
                  setSpeechRate={setSpeechRate}
                  voiceVolume={voiceVolume}
                  setVoiceVolume={setVoiceVolume}
                  isSpeaking={isSpeaking}
                  aiVoiceBlob={aiVoiceBlob}
                  isExporting={isExporting}
                  onPlayVoiceover={startVoiceover}
                  onStopVoiceover={stopVoiceover}
                  onGenerateRealVoice={generateRealVoice}
                />

                <MusicPanel
                  backgroundMusic={backgroundMusic}
                  musicPreview={musicPreview}
                  musicVolume={musicVolume}
                  setMusicVolume={setMusicVolume}
                  isMusicPlaying={isMusicPlaying}
                  audioRef={audioRef}
                  onMusicUpload={handleMusicUpload}
                  onToggleMusic={toggleMusic}
                />
              </CardContent>
            </Card>

            <Card className="creator-card overflow-hidden">
              <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-6">
                <CardTitle className="text-lg font-bold text-creator-text">
                  5. Export and share
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-5 sm:px-6">
                <ExportPanel
                  isRecording={isRecording}
                  isExporting={isExporting}
                  onGenerateCompleteVideo={handleGenerateCompleteVideo}
                  onShareToFacebook={shareToFacebook}
                  onInitializeFFmpeg={initializeFFmpeg}
                  onExportSilentMp4={handleExportSilentMp4}
                  onExportNarratedMp4={handleExportNarratedMp4}
                  onExportFinalMixedMp4={handleExportFinalMixedMp4}
                />
              </CardContent>
            </Card>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <Card className="creator-card overflow-hidden">
                <CardHeader className="border-b border-white/10 px-5 py-4">
                  <CardTitle className="text-lg font-bold text-creator-text">
                    Live Preview
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-5 py-5">
                  <PreviewPanel
                    mediaFiles={mediaFiles}
                    imagePreviews={imagePreviews}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    facebookCaption={facebookCaption}
                    sceneDurations={sceneDurations}
                    onDeleteScene={handleDeleteScene}
                    onDuplicateScene={handleDuplicateScene}
                    onUpdateSceneDuration={handleUpdateSceneDuration}
                  />
                </CardContent>
              </Card>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-creator-muted">
                Facebook-safe reminder: review generated videos before posting,
                avoid misleading claims, copyrighted media, impersonation, spam,
                or unsafe content.
              </div>
            </div>
          </aside>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-creator-bg/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={handleGenerateCompleteVideo}
            disabled={isRecording || isExporting}
            className="h-12 w-full rounded-2xl bg-creator-purple text-sm font-bold text-white shadow-creator disabled:opacity-60"
          >
            {isRecording || isExporting
              ? "Generating video..."
              : "Generate Complete AI Video"}
          </button>
        </div>
      </div>
    </main>
  );
}
