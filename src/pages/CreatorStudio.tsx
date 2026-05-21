import React, { useEffect, useMemo, useRef, useState } from "react";
import { saveAs } from "file-saver";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import PromptPanel from "@/components/creator/PromptPanel";
import AiImagesPanel from "@/components/creator/AiImagesPanel";
import AiToolLauncher, {
  AiToolSelection,
} from "@/components/creator/AiToolLauncher";
import MediaUploader from "@/components/creator/MediaUploader";
import VoicePanel from "@/components/creator/VoicePanel";
import MusicPanel from "@/components/creator/MusicPanel";
import PreviewPanel from "@/components/creator/PreviewPanel";
import ExportPanel from "@/components/creator/ExportPanel";
import PhotoMusicVideoPanel from "@/components/creator/PhotoMusicVideoPanel";
import DancingPhotoPanel from "@/components/creator/DancingPhotoPanel";

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

  const selectedToolName = selectedTool?.tool;
  const showAllTools = !selectedToolName;

  const showAiImages =
    showAllTools ||
    selectedTool?.category === "Picture AI" ||
    selectedToolName === "Text to Video" ||
    selectedToolName === "AI News Video";

  const showMediaUploader =
    showAllTools ||
    selectedTool?.category === "Picture AI" ||
    selectedTool?.category === "Video AI";

  const showPhotoMusic =
    showAllTools || selectedToolName === "Photo Music Video";

  const showDancingPhoto = showAllTools || selectedToolName === "Dancing Photo";

  const showVoicePanel =
    showAllTools ||
    selectedToolName === "AI Voiceover" ||
    selectedToolName === "Text to Speech" ||
    selectedToolName === "Narration Studio";

  const showMusicPanel =
    showAllTools ||
    selectedToolName === "Background Music" ||
    selectedToolName === "Jingle Creator" ||
    selectedToolName === "Lyric Video";

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

      if (musicPreview) URL.revokeObjectURL(musicPreview);
      if (generatedImagePreview) URL.revokeObjectURL(generatedImagePreview);
      if (photoMusicImagePreview) URL.revokeObjectURL(photoMusicImagePreview);
      if (dancingPhotoPreview) URL.revokeObjectURL(dancingPhotoPreview);

      window.speechSynthesis.cancel();
    };
  }, [
    mediaPreviews,
    musicPreview,
    generatedImagePreview,
    photoMusicImagePreview,
    dancingPhotoPreview,
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

      const videoBlob = await exportPhotoMusicVideoMp4
