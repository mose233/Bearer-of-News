import { ExportEngine } from "@/lib/creator/export/ExportEngine";
import { generateVoice } from "@/lib/voice";
import { exportVoice } from "@/lib/creator/VoiceExporter";
import { renderPreviewVideo } from "@/lib/creator/PreviewRenderer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ExportManager } from "@/lib/creator/ExportManager";

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
import { createDanceVideo } from "@/lib/creator/DanceManager";

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
    try {
      if (!dancingPhotoFile || !dancingPhotoPreview) {
        alert("Please upload a dancing photo first.");
        return;
      }

      setIsGeneratingDance(true);
      setExportStatus("Generating mock dancing video...");

     const result = await createDanceVideo(
  dancingPhotoFile,
  dancingPhotoPreview,
  danceStyle
);

      setDanceResultMessage(result.message);

      addSceneToTimeline(
        dancingPhotoFile,
        dancingPhotoPreview,
        selectedVideoDurationSeconds
      );

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
  let blob: Blob | null = null;

  if (generatedImageFile) {
    blob = generatedImageFile;
  } else if (generatedImagePreview) {
    const response = await fetch(generatedImagePreview);
    blob = await response.blob();
  }

  if (!blob) {
    alert("Please generate an image first.");
    return;
  }

  await ExportEngine.export({
    type: "image",
    blob,
  });
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
  setTimeout(() => {
    resetCurrentProject();
  }, 1000);
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

  return (
    <main className="min-h-screen bg-[#0B1020] text-slate-100">
      <div className="mx-auto max-w-7xl px-3 py-4 pb-24 sm:px-4 lg:px-6 lg:py-5">
        <header className="mb-4 rounded-[1.25rem] border border-white/10 bg-[#111827] px-3 py-4 shadow-creator sm:px-4 lg:mb-5">
          <div className="mb-2 inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-[11px] font-bold text-violet-100">
            Creator Studio
          </div>

          <h1 className="max-w-4xl text-xl font-extrabold tracking-tight text-white sm:text-2xl lg:text-3xl">
            Create AI videos, images and music
          </h1>

          <p className="mt-2 max-w-3xl text-xs font-medium leading-5 text-slate-300 sm:text-sm">
            Choose a tool, create your media, then export and download.
          </p>
        </header>

        <div className="mb-5">
          <AiToolLauncher
            selectedTool={selectedTool}
            onSelectTool={handleSelectTool}
          />
        </div>

        <div ref={workspaceSectionRef} className="mb-5 scroll-mt-4">
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
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <section ref={livePreviewSectionRef} className="space-y-4">
            <Card className="rounded-[1.25rem] border border-white/10 bg-[#111827] text-white shadow-creator">
              <CardHeader className="border-b border-white/10 px-3 py-3 sm:px-4">
                <CardTitle className="text-sm font-semibold text-slate-200">
                  Preview
                </CardTitle>
              </CardHeader>

              <CardContent className="px-3 py-4 sm:px-4">
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

            <Card className="rounded-[1.25rem] border border-white/10 bg-[#111827] text-white shadow-creator">
              <CardHeader className="border-b border-white/10 px-3 py-3 sm:px-4">
                <CardTitle className="text-sm font-semibold text-slate-200">
                  Export & Download
                </CardTitle>
              </CardHeader>

              <CardContent className="px-3 py-4 sm:px-4">
  <ExportPanel
  isRecording={isRecording}
  isExporting={isExporting}
  exportStatus={exportStatus}
  exportPrimaryLabel={
    selectedTool?.category === "Picture AI"
      ? "Download Image"
      : "Download Media"
  }
  onExportPrimary={handleExportPrimaryMedia}
  onOpenFacebook={openFacebookAfterExport}
  onInitializeFFmpeg={initializeFFmpeg}
  onExportSilentMp4={handleExportSilentMp4}
  onExportNarratedMp4={handleExportNarratedMp4}
  onExportFinalMixedMp4={handleExportNarratedMp4}
/>
               
</CardContent>
            </Card>

            <div className="rounded-[1.25rem] border border-amber-400/20 bg-amber-400/10 p-3 text-[11px] font-medium leading-5 text-amber-100">
              Review your content before downloading or sharing.
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}
