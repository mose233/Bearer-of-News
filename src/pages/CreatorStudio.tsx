import { PictureAIService } from "@/lib/ai/PictureAIService";
import { getPrice } from "@/lib/pricing/pricingEngine";
import PaymentModal from "@/components/payments/PaymentModal";
import { supabase } from "@/integrations/supabase/client";
import { isAndroid } from "@/lib/creator/DeviceManager";
import { generateVoice } from "@/lib/voice";
import { exportVoice } from "@/lib/creator/VoiceExporter";
import { renderPreviewVideo } from "@/lib/creator/PreviewRenderer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image as ImageIcon, Video, Music2, Sparkles, Play, ShieldCheck } from "lucide-react";
import { ExportManager } from "@/lib/creator/ExportManager";

import { getUSDPrice } from "@/lib/pricing/pricingEngine";
import { convertUSDToKES } from "@/lib/pricing/exchangeService";
import type { PaymentRequest } from "@/lib/payments/PaymentRequest";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import AiToolLauncher, {
  AiToolSelection,
} from "@/components/creator/AiToolLauncher";
import DynamicToolWorkspace from "@/components/creator/DynamicToolWorkspace";
import PreviewPanel from "@/components/creator/PreviewPanel";
import PicturePreviewPanel from "@/components/creator/PicturePreviewPanel";
import ExportPanel from "@/components/creator/ExportPanel";

import {
  generateSingleScene,
  createScenePlan,
} from "@/lib/creator/AISceneManager";

import { DanceStyle } from "@/lib/ai/videoProviders";

import { MultiScenePlan } from "@/lib/creator/multiSceneGenerator";

import {
  CreatorContentType,
  generateCreatorContent,
} from "@/lib/creator/templates";
import {
  addScene,
  deleteScene,
  duplicateScene,
  updateSceneDuration,
  buildImagePreviewItems,
} from "@/lib/creator/TimelineManager";
import {
  createUploadedMedia,
  revokePreviews,
} from "@/lib/creator/MediaManager";
import {
  createMusicPreview,
  revokeMusicPreview,
  stopAudio,
} from "@/lib/creator/MusicManager";
import {
  ImagePreviewItem,
  exportSilentMp4,
  exportNarratedMp4,
  exportFinalMixedMp4,
  exportPhotoMusicVideoMp4,
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
  const [downloadComplete, setDownloadComplete] = useState(false);

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
  const [videoCreativeType, setVideoCreativeType] = useState("General");
  const [videoOutputFormat, setVideoOutputFormat] = useState("Facebook Reel");
  const [selectedVideoDurationSeconds, setSelectedVideoDurationSeconds] = useState(10);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentPrice, setPaymentPrice] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [pendingGeneration, setPendingGeneration] =
  useState<(() => void) | null>(null);
  
  const requestPaidGeneration = (
  payment: PaymentRequest,
  generate: () => void
) => {
  console.log("Opening payment:", payment);

  setPaymentPrice(
    `${payment.currency} ${payment.amount.toFixed(2)}`
  );

  setPendingGeneration(() => generate);

  setPaymentOpen(true);
};
  const livePreviewSectionRef = useRef<HTMLDivElement | null>(null);
  const workspaceSectionRef = useRef<HTMLDivElement | null>(null);

  const handleSelectTool = (tool: AiToolSelection) => {
    setSelectedTool(tool);
    window.setTimeout(() => {
      workspaceSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  const imagePreviews: ImagePreviewItem[] = useMemo(() => {
  return buildImagePreviewItems(mediaFiles, mediaPreviews);
}, [mediaFiles, mediaPreviews]);
  const mediaItems: ImagePreviewItem[] = useMemo(() => {
    return mediaFiles
      .map((file, index) => ({
        file,
        preview: mediaPreviews[index],
      }))
      .filter((item) => Boolean(item.preview));
  }, [mediaFiles, mediaPreviews]);

  useEffect(() => {
    return () => {
      revokePreviews(mediaPreviews);

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

    const currentDuration = sceneDurations[currentIndex] || getTimelineDuration();

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === imagePreviews.length - 1 ? 0 : prev + 1
      );
    }, currentDuration * 1000);

    return () => clearInterval(interval);
  }, [
    isPlaying,
    imagePreviews.length,
    currentIndex,
    sceneDurations,
    selectedVideoDurationSeconds,
    selectedTool?.category,
  ]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const scrollToLivePreview = () => {
    setTimeout(() => {
      livePreviewSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  const getTimelineDuration = () => {
    return selectedVideoDurationSeconds || 10;
  };

 const addSceneToTimeline = (
  file: File,
  preview: string,
  duration = getTimelineDuration()
) => {
  const next = addScene(
    {
      mediaFiles,
      mediaPreviews,
      sceneDurations,
      currentIndex,
    },
    file,
    preview,
    duration
  );

  setMediaFiles(next.mediaFiles);
  setMediaPreviews(next.mediaPreviews);
  setSceneDurations(next.sceneDurations);
  setCurrentIndex(next.currentIndex);

  scrollToLivePreview();
};
const handleAddGeneratedMusicToVideo = async (
  audioUrl: string,
  durationSeconds: number,
  tool: string
) => {
  if (!audioUrl) {
    throw new Error("Generated music URL is missing.");
  }

  setExportStatus("Adding generated AI music to your video...");

  try {
    const response = await fetch(audioUrl);

    if (!response.ok) {
      throw new Error(
        `Could not retrieve generated audio (${response.status}).`
      );
    }

    const blob = await response.blob();

    if (blob.size === 0) {
      throw new Error("Generated audio file is empty.");
    }

    const file = new File(
      [blob],
      `xnewsapp-${tool
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}-ai-music.wav`,
      {
        type: blob.type || "audio/wav",
      }
    );

    revokeMusicPreview(musicPreview);

    const preview = createMusicPreview(file);

    setBackgroundMusic(file);
    setMusicPreview(preview);
    setIsMusicPlaying(false);

    setExportStatus(
      `AI music added to the video soundtrack (${Math.round(
        durationSeconds
      )} seconds).`
    );

    window.setTimeout(() => {
      livePreviewSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  } catch (error) {
    console.error("Failed to add generated Music AI to video:", error);

    throw error;
  }
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

  const handlePrepareTextToVideoPrompt = async () => {
    const prompt = videoPrompt.trim();

    if (!prompt) {
      alert("Please write a video prompt first.");
      return;
    }

    const enrichedPrompt = [
      `Creative type: ${videoCreativeType}`,
      `Output format: ${videoOutputFormat}`,
      prompt,
    ].join("\n");

    try {
      setIsGeneratingImage(true);
      setExportStatus("Creating AI storyboard...");
      setAiImagePrompt(enrichedPrompt);

      const generated = generateCreatorContent(contentType, prompt);
      setFacebookCaption(generated.caption);
      setVoiceText(generated.voice);
      setAiVoiceBlob(null);

      const plan = generateMultiScenePlan(
  enrichedPrompt,
  getTimelineDuration()
);
      setMultiScenePlan(plan);

      if (plan.length === 0) {
        alert("Storyboard could not be created. Please try a clearer idea.");
        return;
      }

      const startIndex = mediaFiles.length;
      const generatedFiles: File[] = [];
      const generatedPreviews: string[] = [];
      const generatedDurations: number[] = [];

      for (let index = 0; index < plan.length; index += 1) {
        const scene = plan[index];

        setExportStatus(
          `Generating scene image ${index + 1} of ${plan.length}...`
        );

        const result = await generateSingleScene(
  prompt,
  "1024x1024"
);

        generatedFiles.push(result.file);
        generatedPreviews.push(result.previewUrl);
        generatedDurations.push(scene.duration || selectedVideoDurationSeconds);
      }

      setMediaFiles((prev) => [...prev, ...generatedFiles]);
      setMediaPreviews((prev) => [...prev, ...generatedPreviews]);
      setSceneDurations((prev) => [...prev, ...generatedDurations]);
      setCurrentIndex(startIndex);

      scrollToLivePreview();

      alert(
        `${plan.length} AI scene images generated and added to the timeline. You can now preview and export.`
      );
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI video draft scenes.");
    } finally {
      setIsGeneratingImage(false);
      setExportStatus("");
    }
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

  revokeMusicPreview(musicPreview);

  const preview = createMusicPreview(file);

  setMusicPreview(preview);
  setIsMusicPlaying(false);
};

  const handleAddPhotoMusicSceneToTimeline = () => {
    if (!photoMusicImageFile || !photoMusicImagePreview) {
      alert("Please upload a photo first.");
      return;
    }

    addSceneToTimeline(photoMusicImageFile, photoMusicImagePreview, selectedVideoDurationSeconds);

    alert("Photo music video scene added to timeline.");
  };

  const handleExportPhotoMusicVideo = async () => {
  if (!photoMusicImageFile && !photoMusicImagePreview) {
    alert("Please upload a photo first.");
    return;
  }

  setIsExporting(true);
  setExportStatus("Exporting photo music video...");

  try {
    await exportPhotoMusicVideoMp4({
      file: photoMusicImageFile,
      preview: photoMusicImagePreview,
    });

    alert("Photo music video exported successfully.");
  } catch (error) {
    console.error(error);
    alert("Unable to export photo music video.");
  } finally {
    setIsExporting(false);
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
  if (!dancingPhotoFile || !dancingPhotoPreview) {
    alert("Please upload a dancing photo first.");
    return;
  }

  const generateDanceWithFal = async () => {
    try {
      setIsGeneratingDance(true);
      setExportStatus(
        `Generating ${danceStyle} dance video with fal.ai...`
      );
      setDanceResultMessage("");

      const { generateFalVideo } = await import("@/lib/fal/falService");

      const durationSeconds = Math.min(
        15,
        Math.max(2, selectedVideoDurationSeconds)
      );

      const dancePrompt = [
        "Create a real AI dance animation video from the uploaded person image.",
        `Dance style: ${danceStyle}.`,
        "Preserve the person's identity, appearance, clothing, and overall visual characteristics.",
        "Animate the person performing natural, energetic full-body dance movements appropriate for the selected style.",
        "Keep the motion coherent, smooth, physically natural, and visually consistent.",
        "Use a vertical social-media composition.",
      ].join(" ");

      const result = await generateFalVideo({
        tool: "Photo to Video",
        prompt: dancePrompt,
        imageFile: dancingPhotoFile,
        durationSeconds,
        aspectRatio: "9:16",
      });

      if (result.status === "failed" || !result.videoUrl) {
        throw new Error(
          result.error || "fal.ai did not return a dance video."
        );
      }

      const response = await fetch(result.videoUrl);

      if (!response.ok) {
        throw new Error(
          `Could not download the fal.ai dance video (${response.status}).`
        );
      }

      const blob = await response.blob();

      const file = new File(
        [blob],
        `xnewsapp-${danceStyle
          .toLowerCase()
          .replace(/\s+/g, "-")}-dance-ai-video.mp4`,
        { type: "video/mp4" }
      );

      const preview = URL.createObjectURL(blob);

      addSceneToTimeline(
        file,
        preview,
        durationSeconds
      );

      setDanceResultMessage(
        `${danceStyle} real AI dance video generated by fal.ai and added to the preview and timeline.`
      );

      setExportStatus(
        `${danceStyle} real AI dance video generated by fal.ai.`
      );
    } catch (error) {
      console.error(
        "Desktop Dance Animation fal.ai generation failed:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "fal.ai dance video generation failed.";

      setDanceResultMessage(
        `Dance video generation failed: ${message}`
      );

      setExportStatus(
        `Dance video generation failed: ${message}`
      );
    } finally {
      setIsGeneratingDance(false);
    }
  };

  requestPaidGeneration(
    {
      tool: "Dance Animation",
      usdPrice: 1.08,
      currency: "USD",
      amount: 1.08,
      description: "Dance Animation AI video generation",
    },
    generateDanceWithFal
  );
};

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);

  if (files.length === 0) return;

  revokePreviews(mediaPreviews);

  const uploaded = createUploadedMedia(
    files,
    getTimelineDuration()
  );

  setMediaFiles(uploaded.files);
  setMediaPreviews(uploaded.previews);
  setSceneDurations(uploaded.durations);
  setCurrentIndex(0);
};
 const performImageGeneration = async () => {
  try {
    const prompt = aiImagePrompt.trim() || videoPrompt.trim();

    if (!prompt) {
      alert("Please write an AI image prompt first.");
      return;
    }

    setIsGeneratingImage(true);
    setMultiScenePlan([]);

    console.log("Starting real fal.ai Picture AI generation...");
    console.log("Prompt:", prompt);

    const result = await PictureAIService.generate({
      prompt,
      tool: "Text to Image",
      aspectRatio: "1:1",
    });

    console.log("PictureAIService result:", result);

    if (!result.success || !result.imageUrl) {
      throw new Error(
        result.error || "fal.ai did not return an image."
      );
    }

    if (generatedImagePreview) {
      URL.revokeObjectURL(generatedImagePreview);
    }

    setGeneratedImagePreview(result.imageUrl);

    // Convert the fal.ai image URL into a File so the
    // existing desktop timeline/export workflow can continue.
    const response = await fetch(result.imageUrl);

    if (!response.ok) {
      throw new Error("Failed to download the generated fal.ai image.");
    }

    const blob = await response.blob();

    const file = new File(
      [blob],
      `picture-ai-${Date.now()}.png`,
      {
        type: blob.type || "image/png",
      }
    );

    setGeneratedImageFile(file);

    alert("Picture AI image generated successfully.");
  } catch (error) {
    console.error("Picture AI failed:", error);

    alert(
      error instanceof Error
        ? error.message
        : String(error)
    );
  } finally {
    setIsGeneratingImage(false);
  }
};

const handleGenerateImage = () => {
  const usdPrice = getUSDPrice("Picture AI");

  requestPaidGeneration(
    {
      tool: "Picture AI",
      usdPrice,
      currency: "USD",
      amount: usdPrice,
      description: "Picture AI Generation",
    },
    () => {
      performImageGeneration();
    }
  );
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

     const plan = createScenePlan(
  prompt,
  getTimelineDuration()
);

if (plan.length === 0) {
  alert("No scenes could be generated.");
  return;
}

setMultiScenePlan(plan);

alert(`${plan.length} scene plan generated successfully.`);
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

      const result = await generateSingleScene(
  scene.prompt,
  "1024x1024"
);

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
        const result = await generateSingleScene(
  scene.prompt,
  "1024x1024"
);

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

    addSceneToTimeline(
      generatedImageFile,
      generatedImagePreview,
      selectedVideoDurationSeconds
    );

    setGeneratedImageFile(null);
    setGeneratedImagePreview("");

    alert("AI image added to video timeline.");
  };

 const handleDeleteScene = (index: number) => {
  const previewToDelete = mediaPreviews[index];

  if (previewToDelete) {
    URL.revokeObjectURL(previewToDelete);
  }

  const next = deleteScene(
    {
      mediaFiles,
      mediaPreviews,
      sceneDurations,
      currentIndex,
    },
    index
  );

  setMediaFiles(next.mediaFiles);
  setMediaPreviews(next.mediaPreviews);
  setSceneDurations(next.sceneDurations);
  setCurrentIndex(next.currentIndex);
};

  const handleDuplicateScene = (index: number) => {
  const next = duplicateScene(
    {
      mediaFiles,
      mediaPreviews,
      sceneDurations,
      currentIndex,
    },
    index
  );

  setMediaFiles(next.mediaFiles);
  setMediaPreviews(next.mediaPreviews);
  setSceneDurations(next.sceneDurations);
  setCurrentIndex(next.currentIndex);
};

  const handleUpdateSceneDuration = (
  index: number,
  duration: number
) => {
  const next = updateSceneDuration(
    {
      mediaFiles,
      mediaPreviews,
      sceneDurations,
      currentIndex,
    },
    index,
    duration
  );

  setSceneDurations(next.sceneDurations);
};

  const handleMusicUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  revokeMusicPreview(musicPreview);

  const preview = createMusicPreview(file);

  setBackgroundMusic(file);
  setMusicPreview(preview);
  setIsMusicPlaying(false);
};

  const toggleMusic = () => {
  if (!audioRef.current) return;

  if (isMusicPlaying) {
    stopAudio(audioRef.current);
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

      await exportVoice({
  blob: audioBlob,
  filename: "xnewsapp-ai-voice",
});

      alert("AI voice generated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI voice.");
    } finally {
      setIsExporting(false);
      setExportStatus("");
    }
  };

  const openFacebookAfterExport = () => {
    window.open(
      "https://www.facebook.com/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const initializeFFmpeg = async () => {
    alert(
      "FFmpeg browser export has been removed for now. Video rendering will be handled by backend AI/rendering services later."
    );
  };
const resetCurrentProject = () => {
  // Release preview URLs
  revokePreviews(mediaPreviews);

  if (generatedImagePreview) {
    URL.revokeObjectURL(generatedImagePreview);
  }

  if (photoMusicImagePreview) {
    URL.revokeObjectURL(photoMusicImagePreview);
  }

  if (dancingPhotoPreview) {
    URL.revokeObjectURL(dancingPhotoPreview);
  }

  // Clear timeline
  setMediaFiles([]);
  setMediaPreviews([]);
  setSceneDurations([]);

  // Clear generated AI image
  setGeneratedImageFile(null);
  setGeneratedImagePreview("");

  // Clear Picture AI
  setPictureFile(null);
  setPicturePreview("");
  setPictureFileName("");

  // Clear Photo Music
  setPhotoMusicImageFile(null);
  setPhotoMusicImagePreview("");
  setPhotoMusicAudioFile(null);
  setPhotoMusicAudioName("");

  // Clear Dancing Photo
  setDancingPhotoFile(null);
  setDancingPhotoPreview("");

  // Reset player
  setCurrentIndex(0);
  setIsPlaying(false);

  // Clear export state
  setExportStatus("");
};
  const handleDownloadGeneratedImage = async () => {
  if (generatedImageFile) {
    await ExportManager.exportImage(generatedImageFile);
    setDownloadComplete(true);
    return;
  }

  if (!generatedImagePreview) {
    alert("Please generate an image first.");
    return;
  }

  const response = await fetch(generatedImagePreview);
  const blob = await response.blob();

  await ExportManager.exportImage(blob);
    setDownloadComplete(true);
};
  const handleExportPrimaryMedia = async () => {
    try {
    if (selectedTool?.category === "Picture AI") {
      if (generatedImageFile || generatedImagePreview) {
        await handleDownloadGeneratedImage();
        return;
      }

      const currentPreview = mediaPreviews[currentIndex];
      const currentFile = mediaFiles[currentIndex];

      if (currentPreview && currentFile?.type.startsWith("image/")) {
        const response = await fetch(currentPreview);
        const blob = await response.blob();

        await ExportManager.exportImage(blob);
        return;
      }

      if (imagePreviews.length > 0) {
        const fallbackPreview = imagePreviews[0];

        const response = await fetch(fallbackPreview.preview);
        const blob = await response.blob();

        await ExportManager.exportImage(blob);
        return;
      }

      alert("Please generate or add an image first.");
      return;
    }

    const currentFile = mediaFiles[currentIndex];
    const currentPreview = mediaPreviews[currentIndex];

    if (!currentFile || !currentPreview) {
      alert("Please upload or generate media first.");
      return;
    }

    if (currentFile.type.startsWith("video/")) {
      await ExportManager.exportVideo(currentFile);
      return;
    }

    if (currentFile.type.startsWith("image/")) {
      try {
        setIsExporting(true);
        setExportStatus("Creating preview video download...");

        const videoBlob = await renderPreviewVideo({
  imageUrl: currentPreview,
  duration: getTimelineDuration(),
});

        await ExportManager.exportCinematic(videoBlob);
        return;
      } catch (error) {
        console.error(error);
        alert("Failed to create video download. Downloading image instead.");
        await ExportManager.exportImage(currentFile);
        return;
      } finally {
        setIsExporting(false);
        setExportStatus("");
      }
    }

    await ExportManager.exportCustom(currentFile, currentFile.name || "xnewsapp-media");
     } finally {
  if (!isAndroid()) {
    setTimeout(() => {
      resetCurrentProject();
    }, 1000);
  }
}
  };

 const handleExportSilentMp4 = async () => {
  if (!mediaFiles[currentIndex] && !mediaPreviews[currentIndex]) {
    alert("Please upload or generate media first.");
    return;
  }

  setIsExporting(true);
  setExportStatus("Exporting silent MP4...");

  try {
    await exportSilentMp4({
      file: mediaFiles[currentIndex],
      preview: mediaPreviews[currentIndex],
    });
  } finally {
    setIsExporting(false);
    setExportStatus("");

    setTimeout(() => {
      resetCurrentProject();
    }, 1000);
  }
};
  
 const handleExportNarratedMp4 = async () => {
  if (!mediaFiles[currentIndex] && !mediaPreviews[currentIndex]) {
    alert("Please upload or generate media first.");
    return;
  }

  setIsExporting(true);
  setExportStatus("Exporting narrated MP4...");

  try {
    await exportNarratedMp4({
      file: mediaFiles[currentIndex],
      preview: mediaPreviews[currentIndex],
    });
  } catch (error) {
    console.error(error);
    alert("Unable to export narrated MP4.");
  } finally {
    setIsExporting(false);
    setExportStatus("");

    setTimeout(() => {
      resetCurrentProject();
    }, 1000);
  }
};
  const handleExportFinalMixedMp4 = async () => {
  if (imagePreviews.length === 0) {
    alert("Please upload or generate images first.");
    return;
  }

  if (!aiVoiceBlob) {
    alert("Please generate AI voice first.");
    return;
  }

  setIsExporting(true);
  setExportStatus(
    "Exporting final mixed MP4 with voice and background music..."
  );

  try {
    const videoBlob = await exportFinalMixedMp4({
      imagePreviews,
      durationSeconds: getTimelineDuration(),
      voiceBlob: aiVoiceBlob,
      voiceVolume,
      backgroundMusic,
      musicVolume,
    });

    await ExportManager.exportCustom(
      videoBlob,
      "xnewsapp-final-video.mp4"
    );
  } catch (error) {
    console.error("Final mixed MP4 export failed:", error);

    alert(
      error instanceof Error
        ? `Unable to export final mixed MP4: ${error.message}`
        : "Unable to export final mixed MP4."
    );
  } finally {
    setIsExporting(false);
    setExportStatus("");

    setTimeout(() => {
      resetCurrentProject();
    }, 1000);
  }
};
  return (
    <main className="min-h-screen bg-[#031027] text-slate-100">
      <div className="mx-auto max-w-[1512px] px-3 py-3 pb-10 sm:px-4 lg:px-6 lg:py-4">
        <header className="relative mb-2 min-h-[132px] overflow-hidden rounded-[1.2rem] border border-blue-300/20 bg-[radial-gradient(ellipse_at_76%_50%,rgba(91,33,182,0.48),transparent_43%),linear-gradient(105deg,#06132c,#071635_55%,#180b45)] px-4 py-4 shadow-creator sm:px-6 lg:min-h-[154px]">
          <div className="relative z-10 max-w-[66%] sm:max-w-[62%]">
            <div className="mb-2 inline-flex items-center rounded-full border border-violet-300/30 bg-violet-600/30 px-3 py-1 text-[11px] font-bold text-violet-50">Creator Studio</div>
            <h1 className="text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl lg:text-[38px]">
              Create <span className="bg-gradient-to-r from-sky-300 via-fuchsia-400 to-violet-300 bg-clip-text text-transparent">AI videos,</span> images and music
            </h1>
            <p className="mt-2 max-w-3xl text-xs font-medium leading-5 text-slate-200 sm:text-sm lg:text-base">Choose a tool, create your media, then export and download.</p>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 flex w-[43%] items-center justify-center overflow-hidden">
            <div className="absolute bottom-[-40%] right-[8%] h-36 w-72 rotate-[-12deg] rounded-[50%] border-t-[3px] border-fuchsia-500/80 shadow-[0_-8px_28px_rgba(217,70,239,0.25)]"/>
            <div className="relative flex items-center gap-2">
              <div className="hidden h-16 w-20 -rotate-12 items-center justify-center rounded-xl border border-cyan-300/60 bg-gradient-to-br from-cyan-400/40 to-indigo-950 shadow-[0_0_24px_rgba(34,211,238,0.28)] sm:flex"><Sparkles className="h-8 w-8 text-cyan-100"/></div>
              <div className="flex h-16 w-16 -rotate-6 items-center justify-center rounded-xl border border-fuchsia-300/70 bg-gradient-to-br from-pink-500/70 via-violet-700 to-indigo-950 shadow-[0_0_24px_rgba(217,70,239,0.35)] sm:h-24 sm:w-24"><Sparkles className="h-9 w-9 text-white sm:h-12 sm:w-12"/></div>
              <div className="flex h-12 w-12 rotate-9 items-center justify-center rounded-xl border border-sky-300/60 bg-gradient-to-br from-sky-400/70 to-blue-950 shadow-[0_0_22px_rgba(56,189,248,0.3)] sm:h-16 sm:w-16"><Music2 className="h-7 w-7 text-white sm:h-9 sm:w-9"/></div>
              <div className="hidden h-14 w-16 rotate-12 items-center justify-center rounded-xl border border-pink-300/60 bg-gradient-to-br from-orange-400/50 to-fuchsia-950 md:flex"><Play className="h-7 w-7 fill-white text-white"/></div>
            </div>
          </div>
        </header>

        <div className="mb-5">
          <AiToolLauncher
            selectedTool={selectedTool}
            onSelectTool={handleSelectTool}
          />
        </div>

        <div className="mb-2 grid grid-cols-1 items-stretch gap-2 lg:grid-cols-[1.15fr_0.85fr]"><div ref={workspaceSectionRef} className="min-w-0 scroll-mt-4">
          {selectedTool ? (
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
            onAddMusicToVideo={handleAddGeneratedMusicToVideo}
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
            videoPrompt={videoPrompt}
            setVideoPrompt={setVideoPrompt}
            videoCreativeType={videoCreativeType}
            setVideoCreativeType={setVideoCreativeType}
            videoOutputFormat={videoOutputFormat}
            setVideoOutputFormat={setVideoOutputFormat}
            onPrepareTextToVideoPrompt={handlePrepareTextToVideoPrompt}
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
            onMediaUpload={handleMediaUpload}
            onPublishToFacebook={openFacebookAfterExport}
            onDownloadGeneratedImage={handleDownloadGeneratedImage}
            onAddEnhancedPhotoToTimeline={(file, preview, durationSeconds) =>
  addSceneToTimeline(
    file,
    preview,
    durationSeconds || getTimelineDuration()
  )
}
onVideoDurationChange={setSelectedVideoDurationSeconds}

requestGeneration={requestPaidGeneration}

onRequestPayment={(amount, onSuccess) => {
  setPaymentPrice(amount);
  setPendingGeneration(() => onSuccess);
  setPaymentOpen(true);
}}
          />
          ) : (
            <section className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-[1.2rem] border border-blue-300/20 bg-[radial-gradient(ellipse_at_50%_65%,rgba(91,33,182,0.35),transparent_55%),linear-gradient(130deg,#081a39,#06142b)] p-4 sm:min-h-[285px] sm:p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold leading-tight text-slate-100 sm:text-xl"><Sparkles className="h-6 w-6 text-fuchsia-300"/>Choose a tool to begin</h2>
              <p className="mt-1 text-sm text-slate-200 sm:text-base">Select a tool above to start creating.</p>
              <div aria-hidden="true" className="relative mt-3 flex min-h-[170px] flex-1 items-end justify-center overflow-hidden">
                <div className="absolute bottom-0 h-16 w-[95%] rounded-[50%] bg-fuchsia-600/30 blur-2xl"/>
                <div className="absolute bottom-4 left-[3%] right-[3%] h-10 -rotate-3 rounded-[50%] border-t-4 border-fuchsia-500/90"/>
                <div className="absolute bottom-5 left-[7%] flex h-[112px] w-[31%] -rotate-[8deg] items-center justify-center rounded-xl border-2 border-cyan-300/80 bg-gradient-to-br from-sky-400/70 via-indigo-700 to-purple-950 shadow-[0_0_28px_rgba(56,189,248,0.32)] sm:h-[135px]">
                  <div className="absolute inset-2 rounded-lg border border-white/30 bg-gradient-to-tr from-orange-300/70 via-pink-500/50 to-blue-500/80"/>
                  <ImageIcon className="relative h-12 w-12 text-white drop-shadow-lg sm:h-16 sm:w-16"/>
                  <div className="absolute -bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-xl bg-pink-600"><ImageIcon className="h-6 w-6 text-white"/></div>
                </div>
                <div className="absolute bottom-6 left-[37%] flex h-[105px] w-[31%] rotate-[-3deg] flex-col items-center justify-center rounded-xl border-2 border-violet-300/70 bg-gradient-to-br from-slate-800 via-violet-950 to-fuchsia-900 shadow-[0_0_30px_rgba(168,85,247,0.35)] sm:h-[130px]">
                  <div className="absolute -top-3 left-2 right-2 h-4 -skew-x-12 border border-white/40 bg-[repeating-linear-gradient(135deg,#f5d0fe_0_10px,#312e81_10px_20px)]"/>
                  <div className="flex h-[65%] w-[82%] items-center justify-center rounded-lg border border-violet-300/50 bg-slate-950/80"><Play className="h-10 w-10 fill-fuchsia-300 text-fuchsia-300 sm:h-12 sm:w-12"/></div>
                  <div className="absolute -bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-xl bg-violet-600"><Video className="h-6 w-6 text-white"/></div>
                </div>
                <div className="absolute bottom-5 right-[5%] flex h-[112px] w-[27%] -rotate-[5deg] items-center justify-center rounded-[2rem] border-2 border-cyan-300/70 bg-gradient-to-br from-blue-500/70 via-indigo-950 to-slate-950 shadow-[0_0_32px_rgba(34,211,238,0.35)] sm:h-[140px]">
                  <div className="absolute inset-3 rounded-[1.5rem] border-[5px] border-sky-400/80"/>
                  <Music2 className="relative h-12 w-12 text-cyan-100 sm:h-16 sm:w-16"/>
                  <div className="absolute -bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-xl bg-sky-500"><Music2 className="h-6 w-6 text-white"/></div>
                </div>
                <Sparkles className="absolute left-[8%] top-[15%] h-5 w-5 text-cyan-300"/>
                <Sparkles className="absolute left-[47%] top-[2%] h-5 w-5 text-fuchsia-300"/>
                <Sparkles className="absolute right-[8%] top-[12%] h-6 w-6 text-cyan-300"/>
              </div>
            </section>
          )}
        </div>

          <section ref={livePreviewSectionRef} className="min-w-0">
            <Card className="h-full rounded-[1.2rem] border border-blue-300/20 bg-[linear-gradient(135deg,#081a35,#061329)] text-white shadow-creator">
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-base font-bold text-slate-100 sm:text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-4">
                {selectedTool?.category === "Picture AI" ? (
                  <PicturePreviewPanel
                    mediaFiles={mediaFiles}
                    imagePreviews={imagePreviews}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    facebookCaption={facebookCaption}
                  />
                ) : (
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
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        <section className="rounded-[1.2rem] border border-blue-300/20 bg-[linear-gradient(110deg,#071731,#061329)] p-3 shadow-creator sm:p-4">
          <h2 className="mb-1.5 text-base font-bold text-slate-100 sm:text-lg">Export &amp; Download</h2>
          <Card className="border-0 bg-transparent text-white shadow-none">
            <CardContent className="p-0">
              <ExportPanel
                isRecording={isRecording}
                isExporting={isExporting}
                exportStatus={exportStatus}
                exportPrimaryLabel={selectedTool?.category === "Picture AI" ? "Download Image" : "Download Media"}
                onExportPrimary={handleExportPrimaryMedia}
                onOpenFacebook={openFacebookAfterExport}
                onInitializeFFmpeg={initializeFFmpeg}
                onExportSilentMp4={handleExportSilentMp4}
                onExportNarratedMp4={handleExportNarratedMp4}
                onExportFinalMixedMp4={handleExportFinalMixedMp4}
              />
            </CardContent>
          </Card>
          <div className="mt-2 rounded-xl border border-amber-400/70 bg-amber-500/[0.04] px-3 py-2 text-xs font-semibold text-amber-300 sm:text-sm">
            <ShieldCheck className="mr-2 inline h-4 w-4 align-middle text-amber-400" />
            Review your content before downloading or sharing.
          </div>
          {isAndroid() && downloadComplete && (
            <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <p className="mb-3 font-semibold text-emerald-300">✅ Download complete.</p>
              <p className="mb-4 text-sm text-slate-300">Tap below to start a new creation.</p>
              <button onClick={() => { setDownloadComplete(false); resetCurrentProject(); }} className="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-black hover:bg-emerald-400">Click to Generate Again</button>
            </div>
          )}
        </section>

      </div>

      <PaymentModal
  open={paymentOpen}
  price={paymentPrice}
  onClose={() => setPaymentOpen(false)}
  onPaymentSuccess={() => {
    console.log("✅ PaymentModal: Payment confirmed");

    setPaymentOpen(false);
    setPaymentComplete(true);

    console.log("pendingGeneration =", pendingGeneration);

    if (pendingGeneration) {
      console.log("🚀 Executing pending generation...");

      pendingGeneration();

      console.log("✅ pendingGeneration finished");

      setPendingGeneration(null);
    } else {
      console.log("❌ pendingGeneration is NULL");
    }
  }}
/>

  </main>
);
}
