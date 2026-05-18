import React, { useEffect, useMemo, useRef, useState } from "react";
import { saveAs } from "file-saver";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import PromptPanel from "@/components/creator/PromptPanel";
import MediaUploader from "@/components/creator/MediaUploader";
import VoicePanel from "@/components/creator/VoicePanel";
import MusicPanel from "@/components/creator/MusicPanel";
import PreviewPanel from "@/components/creator/PreviewPanel";
import ExportPanel from "@/components/creator/ExportPanel";

import { loadFFmpeg } from "@/lib/ffmpeg";
import { generateVoice } from "@/lib/voice";

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

      window.speechSynthesis.cancel();
    };
  }, [mediaPreviews, musicPreview]);

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

    alert("Script generated successfully.");
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
        alert("Please upload images first.");
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
        alert("Please upload images first.");
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
        alert("Please upload images first.");
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
        alert("Please upload images first.");
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
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Creator Studio AI</h1>

        <p className="text-gray-500 mt-2">
          Create social videos with scripts, AI voice, uploaded visuals,
          background music, MP4 export, and Facebook sharing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Video</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
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

            <MediaUploader onMediaUpload={handleMediaUpload} />

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

        <Card>
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
          </CardHeader>

          <CardContent>
            <PreviewPanel
              mediaFiles={mediaFiles}
              imagePreviews={imagePreviews}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              facebookCaption={facebookCaption}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
