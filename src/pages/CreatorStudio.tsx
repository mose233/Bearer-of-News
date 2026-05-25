import React, { useEffect, useMemo, useRef, useState } from "react";
import { saveAs } from "file-saver";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import PromptPanel from "@/components/creator/PromptPanel";
import AiImagesPanel from "@/components/creator/AiImagesPanel";
import AiToolLauncher, {
  AiToolSelection,
} from "@/components/creator/AiToolLauncher";
import DynamicToolWorkspace from "@/components/creator/DynamicToolWorkspace";
import MediaUploader from "@/components/creator/MediaUploader";
import PreviewPanel from "@/components/creator/PreviewPanel";
import ExportPanel from "@/components/creator/ExportPanel";
import SmartCanvasPanel from "@/components/creator/SmartCanvasPanel";

import { loadFFmpeg } from "@/lib/ffmpeg";
import { generateVoice, tryGenerateVoice } from "@/lib/voice";
import { generateSceneImage } from "@/lib/creator/imageGeneration";
import { generateDancingVideo, DanceStyle } from "@/lib/ai/videoProviders";

import {
  generateMultiScenePlan,
  MultiScenePlan,
} from "@/lib/creator/multiSceneGenerator";

import {
  CreatorContentType,
  generateCreatorContent,
} from "@/lib/creator/templates";

import {
  exportFinalMixedMp4,
  exportNarratedMp4,
  exportPhotoMusicVideoMp4,
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
  const [exportStatus, setExportStatus] = useState("");

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
  const [multiScenePlan, setMultiScenePlan] = useState<MultiScenePlan[]>([]);

  const [photoMusicImageFile, setPhotoMusicImageFile] =
    useState<File | null>(null);
  const [photoMusicImagePreview, setPhotoMusicImagePreview] = useState("");
  const [photoMusicAudioFile, setPhotoMusicAudioFile] =
    useState<File | null>(null);
  const [photoMusicAudioName, setPhotoMusicAudioName] = useState("");
  const [photoMusicStyle, setPhotoMusicStyle] = useState("Music Video");
  const [isExportingPhotoMusic, setIsExportingPhotoMusic] = useState(false);

  const [dancingPhotoFile, setDancingPhotoFile] = useState<File | null>(null);
  const [dancingPhotoPreview, setDancingPhotoPreview] = useState("");
  const [danceStyle, setDanceStyle] = useState<DanceStyle>("Afrobeats");
  const [isGeneratingDance, setIsGeneratingDance] = useState(false);
  const [danceResultMessage, setDanceResultMessage] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [selectedTool, setSelectedTool] =
    useState<AiToolSelection | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasText, setCanvasText] = useState("xnewsapp.com");
  const [canvasImageFile, setCanvasImageFile] = useState<File | null>(null);
  const [canvasImagePreview, setCanvasImagePreview] = useState("");

  const selectedToolName = selectedTool?.tool;
  const showDefaultSceneBuilder =
    !selectedToolName ||
    selectedToolName === "Text to Video" ||
    selectedToolName === "AI News Video" ||
    selectedToolName === "Business Promo" ||
    selectedToolName === "WhatsApp Status" ||
    selectedToolName === "Birthday Video" ||
    selectedToolName === "Romantic Reel" ||
    selectedToolName === "Motivational Video";

  const imagePreviews: ImagePreviewItem[] = useMemo(() => {
    return mediaFiles
      .map((file, index) => ({
        file,
        preview: mediaPreviews[index],
      }))
      .filter((item) => item.file.type.startsWith("image/"));
  }, [mediaFiles, mediaPreviews]);

  const drawCanvas = (imageUrl?: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawText = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.fillRect(0, 800, canvas.width, 180);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 64px Arial";
      ctx.textAlign = "center";
      ctx.fillText(canvasText || "xnewsapp.com", canvas.width / 2, 900);

      ctx.fillStyle = "#a78bfa";
      ctx.font = "bold 34px Arial";
      ctx.fillText("Created with xnewsapp.com", canvas.width / 2, 955);
    };

    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;

        ctx.drawImage(img, x, y, width, height);
        drawText();
      };
      img.src = imageUrl;
      return;
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 70px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Canvas Editor", canvas.width / 2, 450);

    drawText();
  };

  useEffect(() => {
    drawCanvas(canvasImagePreview);
  }, [canvasText, canvasImagePreview]);

  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));

      if (musicPreview) URL.revokeObjectURL(musicPreview);
      if (generatedImagePreview) URL.revokeObjectURL(generatedImagePreview);
      if (photoMusicImagePreview) URL.revokeObjectURL(photoMusicImagePreview);
      if (dancingPhotoPreview) URL.revokeObjectURL(dancingPhotoPreview);
      if (canvasImagePreview) URL.revokeObjectURL(canvasImagePreview);

      window.speechSynthesis.cancel();
    };
  }, [
    mediaPreviews,
    musicPreview,
    generatedImagePreview,
    photoMusicImagePreview,
    dancingPhotoPreview,
    canvasImagePreview,
  ]);

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

  const addSceneToTimeline = (file: File, preview: string, duration = 5) => {
    setMediaFiles((prev) => [...prev, file]);
    setMediaPreviews((prev) => [...prev, preview]);
    setSceneDurations((prev) => [...prev, duration]);
    setCurrentIndex(mediaFiles.length);
  };

  const handleCanvasImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (canvasImagePreview) {
      URL.revokeObjectURL(canvasImagePreview);
    }

    const preview = URL.createObjectURL(file);

    setCanvasImageFile(file);
    setCanvasImagePreview(preview);
  };

  const handleDownloadCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      saveAs(blob, "xnewsapp-canvas-image.png");
    }, "image/png");
  };

  const handleAddCanvasToTimeline = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "xnewsapp-canvas-scene.png", {
        type: "image/png",
      });

      const preview = URL.createObjectURL(blob);

      addSceneToTimeline(file, preview, 5);

      alert("Canvas design added to timeline.");
    }, "image/png");
  };

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

  const handlePhotoMusicPhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (photoMusicImagePreview) {
      URL.revokeObjectURL(photoMusicImagePreview);
    }

    const preview = URL.createObjectURL(file);

    setPhotoMusicImageFile(file);
    setPhotoMusicImagePreview(preview);
  };

  const handlePhotoMusicAudioUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPhotoMusicAudioFile(file);
    setPhotoMusicAudioName(file.name);
    setBackgroundMusic(file);

    if (musicPreview) {
      URL.revokeObjectURL(musicPreview);
    }

    const preview = URL.createObjectURL(file);

    setMusicPreview(preview);
    setIsMusicPlaying(false);
  };

  const handleAddPhotoMusicSceneToTimeline = () => {
    if (!photoMusicImageFile || !photoMusicImagePreview) {
      alert("Please upload a photo first.");
      return;
    }

    addSceneToTimeline(photoMusicImageFile, photoMusicImagePreview, 5);

    alert("Photo music video scene added to timeline.");
  };

  const handleExportPhotoMusicVideo = async () => {
    try {
      if (!photoMusicImageFile || !photoMusicImagePreview) {
        alert("Please upload a photo first.");
        return;
      }

      if (!photoMusicAudioFile) {
        alert("Please upload a song first.");
        return;
      }

      setIsExportingPhotoMusic(true);
      setExportStatus("Rendering photo music video MP4...");

      const videoBlob = await exportPhotoMusicVideoMp4({
        imageFile: photoMusicImageFile,
        imagePreview: photoMusicImagePreview,
        audioFile: photoMusicAudioFile,
        durationSeconds: 15,
        musicVolume: 0.9,
      });

      saveAs(videoBlob, "photo-music-video.mp4");

      alert("Photo music video exported successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to export photo music video.");
    } finally {
      setIsExportingPhotoMusic(false);
      setExportStatus("");
    }
  };

  const handleDancingPhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (dancingPhotoPreview) {
      URL.revokeObjectURL(dancingPhotoPreview);
    }

    const preview = URL.createObjectURL(file);

    setDancingPhotoFile(file);
    setDancingPhotoPreview(preview);
    setDanceResultMessage("");
  };

  const handleGenerateDancingVideo = async () => {
    try {
      if (!dancingPhotoFile || !dancingPhotoPreview) {
        alert("Please upload a dancing photo first.");
        return;
      }

      setIsGeneratingDance(true);
      setExportStatus("Generating mock dancing video...");

      const result = await generateDancingVideo({
        imageFile: dancingPhotoFile,
        imagePreview: dancingPhotoPreview,
        danceStyle,
      });

      setDanceResultMessage(result.message);

      addSceneToTimeline(dancingPhotoFile, dancingPhotoPreview, 5);

      alert("Mock dancing video added to timeline.");
    } catch (error) {
      console.error(error);
      alert("Failed to generate dancing video.");
    } finally {
      setIsGeneratingDance(false);
      setExportStatus("");
    }
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
      setMultiScenePlan([]);

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

  const handleGenerateMultiScenePlan = () => {
    try {
      const prompt = aiImagePrompt.trim() || videoPrompt.trim();

      if (!prompt) {
        alert("Please write a prompt first.");
        return;
      }

      if (generatedImagePreview) {
        URL.revokeObjectURL(generatedImagePreview);
      }

      setGeneratedImageFile(null);
      setGeneratedImagePreview("");

      const plan = generateMultiScenePlan(prompt, 4);

      setMultiScenePlan(plan);

      alert("4-scene plan generated.");
    } catch (error) {
      console.error(error);
      alert("Failed to generate scene plan.");
    }
  };

  const handleGenerateSceneFromPlan = async (index: number) => {
    try {
      const scene = multiScenePlan[index];

      if (!scene) {
        alert("Scene not found.");
        return;
      }

      setIsGeneratingImage(true);

      const result = await generateSceneImage(scene.prompt, "1024x1024");

      addSceneToTimeline(result.file, result.previewUrl, scene.duration);

      alert(`Scene ${index + 1} added to timeline.`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate scene.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateAllScenesFromPlan = async () => {
    try {
      if (multiScenePlan.length === 0) {
        alert("Please generate a scene plan first.");
        return;
      }

      setIsGeneratingImage(true);

      for (const scene of multiScenePlan) {
        const result = await generateSceneImage(scene.prompt, "1024x1024");

        setMediaFiles((prev) => [...prev, result.file]);
        setMediaPreviews((prev) => [...prev, result.previewUrl]);
        setSceneDurations((prev) => [...prev, scene.duration]);
      }

      setCurrentIndex(mediaFiles.length);

      alert("All scenes generated and added to timeline.");
    } catch (error) {
      console.error(error);
      alert("Failed to generate all scenes.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAddGeneratedImage = () => {
    if (!generatedImageFile || !generatedImagePreview) {
      alert("Please generate an AI scene image first.");
      return;
    }

    addSceneToTimeline(generatedImageFile, generatedImagePreview, 5);

    setGeneratedImageFile(null);
    setGeneratedImagePreview("");

    alert("AI image added to video timeline.");
  };

  const handleDeleteScene = (index: number) => {
    const previewToDelete = mediaPreviews[index];

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
      setExportStatus("Generating AI voice...");

      const audioBlob = await generateVoice(voiceText);

      setAiVoiceBlob(audioBlob);

      saveAs(audioBlob, "creator-studio-voiceover.mp3");

      alert("AI voice generated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI voice.");
    } finally {
      setIsExporting(false);
      setExportStatus("");
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
      setExportStatus("Loading FFmpeg engine...");

      const ffmpeg = await loadFFmpeg();

      console.log("FFmpeg engine ready:", ffmpeg);

      setExportStatus("FFmpeg ready.");

      setTimeout(() => {
        setExportStatus("");
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to load FFmpeg.");
      setExportStatus("");
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
      setExportStatus("Rendering silent MP4...");

      const videoBlob = await exportSilentMp4(imagePreviews);

      saveAs(videoBlob, "creator-studio-silent-video.mp4");

      alert("Silent MP4 exported successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to export silent MP4.");
    } finally {
      setIsRecording(false);
      setExportStatus("");
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
      setExportStatus("Mixing narration into video...");

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
      setExportStatus("");
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
      setExportStatus("Mixing voice + background music...");

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
      setExportStatus("");
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
      setExportStatus("Preparing complete AI video...");

      const generated = generateCreatorContent(contentType, videoPrompt);

      setFacebookCaption(generated.caption);
      setVoiceText(generated.voice);

      setExportStatus("Generating AI narration...");

      const voiceResult = await tryGenerateVoice(generated.voice);

      if (!voiceResult.ok || !voiceResult.blob) {
        alert(
          "AI voice API unavailable. Exporting video without generated AI voice."
        );

        setExportStatus("Exporting silent fallback MP4...");

        const videoBlob = await exportSilentMp4(imagePreviews);

        saveAs(videoBlob, "creator-studio-complete-video-no-ai-voice.mp4");

        return;
      }

      const voiceBlob = voiceResult.blob;

      setAiVoiceBlob(voiceBlob);

      setExportStatus("Rendering final MP4...");

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
      setExportStatus("");
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1020] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-5 pb-28 sm:px-6 lg:px-8 lg:py-7">
        <header className="mb-5 rounded-[1.5rem] border border-white/10 bg-[#111827] px-4 py-5 shadow-creator sm:px-6 lg:mb-6">
          <div className="mb-3 inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-100">
            Creator Studio AI
          </div>

          <h1 className="max-w-4xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Create Facebook-ready videos faster
          </h1>

          <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-300 sm:text-base">
            Generate scenes, arrange your timeline, add narration and music,
            then export videos for Facebook, Reels, Shorts, and TikTok.
          </p>
        </header>

        <div className="mb-5">
          <AiToolLauncher
            selectedTool={selectedTool}
            onSelectTool={setSelectedTool}
          />
        </div>

        <div className="mb-5">
          <DynamicToolWorkspace
            selectedTool={selectedTool}
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
            backgroundMusic={backgroundMusic}
            musicPreview={musicPreview}
            musicVolume={musicVolume}
            setMusicVolume={setMusicVolume}
            isMusicPlaying={isMusicPlaying}
            audioRef={audioRef}
            onMusicUpload={handleMusicUpload}
            onToggleMusic={toggleMusic}
            photoMusicImagePreview={photoMusicImagePreview}
            photoMusicAudioName={photoMusicAudioName}
            photoMusicStyle={photoMusicStyle}
            isExportingPhotoMusic={isExportingPhotoMusic}
            setPhotoMusicStyle={setPhotoMusicStyle}
            onPhotoMusicPhotoUpload={handlePhotoMusicPhotoUpload}
            onPhotoMusicAudioUpload={handlePhotoMusicAudioUpload}
            onAddPhotoMusicSceneToTimeline={handleAddPhotoMusicSceneToTimeline}
            onExportPhotoMusicVideo={handleExportPhotoMusicVideo}
            dancingPhotoPreview={dancingPhotoPreview}
            danceStyle={danceStyle}
            isGeneratingDance={isGeneratingDance}
            danceResultMessage={danceResultMessage}
            setDanceStyle={setDanceStyle}
            onDancingPhotoUpload={handleDancingPhotoUpload}
            onGenerateDance={handleGenerateDancingVideo}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <section className="space-y-5">
            <Card className="rounded-[1.5rem] border border-white/10 bg-[#111827] text-white shadow-creator">
              <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-5">
                <CardTitle className="text-base font-extrabold text-white sm:text-lg">
                  1. Write your idea
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-5 sm:px-5">
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

            <Card className="rounded-[1.5rem] border border-white/10 bg-[#111827] text-white shadow-creator">
              <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-5">
                <CardTitle className="text-base font-extrabold text-white sm:text-lg">
                  Smart Canvas
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-5 sm:px-5">
                <SmartCanvasPanel
                  canvasText={canvasText}
                  setCanvasText={setCanvasText}
                  canvasRef={canvasRef}
                  onCanvasImageUpload={handleCanvasImageUpload}
                  onDownloadCanvasImage={handleDownloadCanvasImage}
                  onAddCanvasToTimeline={handleAddCanvasToTimeline}
                />
              </CardContent>
            </Card>

            {showDefaultSceneBuilder && (
              <Card className="rounded-[1.5rem] border border-white/10 bg-[#111827] text-white shadow-creator">
                <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-5">
                  <CardTitle className="text-base font-extrabold text-white sm:text-lg">
                    2. Generate or upload scenes
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5 px-4 py-5 sm:px-5">
                  <AiImagesPanel
                    aiImagePrompt={aiImagePrompt}
                    setAiImagePrompt={setAiImagePrompt}
                    isGeneratingImage={isGeneratingImage}
                    generatedImagePreview={generatedImagePreview}
                    multiScenePlan={multiScenePlan}
                    onGenerateImage={handleGenerateImage}
                    onGenerateMultiScenePlan={handleGenerateMultiScenePlan}
                    onAddGeneratedImage={handleAddGeneratedImage}
                    onGenerateSceneFromPlan={handleGenerateSceneFromPlan}
                    onGenerateAllScenesFromPlan={handleGenerateAllScenesFromPlan}
                  />

                  <MediaUploader onMediaUpload={handleMediaUpload} />
                </CardContent>
              </Card>
            )}

            <Card className="rounded-[1.5rem] border border-white/10 bg-[#111827] text-white shadow-creator xl:hidden">
              <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-5">
                <CardTitle className="text-base font-extrabold text-white sm:text-lg">
                  Preview and timeline
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-5 sm:px-5">
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
          </section>

          <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start">
            <Card className="rounded-[1.5rem] border border-white/10 bg-[#111827] text-white shadow-creator">
              <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-5">
                <CardTitle className="text-base font-extrabold text-white sm:text-lg">
                  Live preview and timeline
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-5 sm:px-5">
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

            <Card className="rounded-[1.5rem] border border-white/10 bg-[#111827] text-white shadow-creator">
              <CardHeader className="border-b border-white/10 px-4 py-4 sm:px-5">
                <CardTitle className="text-base font-extrabold text-white sm:text-lg">
                  Export and share
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-5 sm:px-5">
                <ExportPanel
                  isRecording={isRecording}
                  isExporting={isExporting}
                  exportStatus={exportStatus}
                  onGenerateCompleteVideo={handleGenerateCompleteVideo}
                  onShareToFacebook={shareToFacebook}
                  onInitializeFFmpeg={initializeFFmpeg}
                  onExportSilentMp4={handleExportSilentMp4}
                  onExportNarratedMp4={handleExportNarratedMp4}
                  onExportFinalMixedMp4={handleExportFinalMixedMp4}
                />
              </CardContent>
            </Card>

            <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-4 text-xs font-medium leading-5 text-amber-100">
              Facebook-safe reminder: review generated videos before posting.
              Avoid copyrighted media, misleading claims, impersonation, spam,
              or unsafe content.
            </div>
          </aside>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B1020]/95 px-4 py-3 backdrop-blur xl:hidden">
          <button
            type="button"
            onClick={handleGenerateCompleteVideo}
            disabled={isRecording || isExporting}
            className="h-12 w-full rounded-2xl bg-violet-600 text-sm font-bold text-white shadow-creator disabled:opacity-60"
          >
            {isRecording || isExporting
              ? exportStatus || "Generating video..."
              : "Generate Complete AI Video"}
          </button>
        </div>
      </div>
    </main>
  );
}
