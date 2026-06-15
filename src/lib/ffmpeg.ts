import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: FFmpeg | null = null;
let loadingPromise: Promise<FFmpeg> | null = null;

export const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const instance = new FFmpeg();

      const baseURL = "/ffmpeg";

      console.log("Loading FFmpeg from:", baseURL);

      await instance.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL: `${baseURL}/ffmpeg-core.wasm`,
        workerURL: `${baseURL}/ffmpeg-core.worker.js`,
      });

      console.log("FFmpeg loaded successfully");

      ffmpeg = instance;
      return instance;
    } catch (error) {
      console.error("FFmpeg load failed:", error);

      loadingPromise = null;
      ffmpeg = null;

      throw error;
    }
  })();

  return loadingPromise;
};

export default loadFFmpeg;
