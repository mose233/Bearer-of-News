import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;
let loadingPromise: Promise<FFmpeg> | null = null;

export const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const instance = new FFmpeg();

      const baseURL =
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

      console.log("Loading FFmpeg from:", baseURL);

      const coreURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.js`,
        "text/javascript"
      );

      const wasmURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      );

      const workerURL = await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      );

      await instance.load({
        coreURL,
        wasmURL,
        workerURL,
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
