import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;
let loadingPromise: Promise<FFmpeg> | null = null;

export const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const instance = new FFmpeg();

    const baseURL =
      "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";

    try {
      await instance.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          "text/javascript"
        ),
      });

      ffmpeg = instance;
      return instance;
    } catch (error) {
      ffmpeg = null;
      loadingPromise = null;

      console.error("Failed to load FFmpeg:", error);

      throw new Error(
        error instanceof Error
          ? `Failed to load FFmpeg: ${error.message}`
          : "Failed to load FFmpeg."
      );
    }
  })();

  return loadingPromise;
};

export default loadFFmpeg;
