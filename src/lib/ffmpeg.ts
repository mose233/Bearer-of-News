import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: FFmpeg | null = null;

export const loadFFmpeg = async () => {
  try {
    // Return existing instance
    if (ffmpeg) {
      return ffmpeg;
    }

    ffmpeg = new FFmpeg();

    console.log("Loading FFmpeg core...");

    await ffmpeg.load();

    console.log("✅ FFmpeg loaded successfully");

    return ffmpeg;
  } catch (error) {
    console.error("❌ FFmpeg load error:", error);

    throw error;
  }
};

export default loadFFmpeg;
