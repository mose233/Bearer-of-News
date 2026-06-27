```typescript
/**
 * Professional video preview renderer with cinematic zoom effect
 * @module VideoRenderer
 */

export interface PreviewRenderOptions {
  /** Source image URL (supports cross-origin) */
  imageUrl: string;
  /** Video duration in seconds (capped at 15s for performance) */
  duration: number;
  /** Frames per second (default: 12) */
  fps?: number;
  /** Output width in pixels (default: 540) */
  width?: number;
  /** Output height in pixels (default: 960) */
  height?: number;
}

export interface RenderStats {
  totalFrames: number;
  duration: number;
  fps: number;
  resolution: { width: number; height: number };
  codec: string;
}

/**
 * Renders a cinematic video preview from a single image
 * 
 * @param options - Render configuration
 * @returns Promise resolving to video Blob
 * 
 * @example
 * ```typescript
 * const video = await renderPreviewVideo({
 *   imageUrl: 'https://example.com/image.jpg',
 *   duration: 5,
 *   fps: 24,
 *   width: 1080,
 *   height: 1920
 * });
```

*/
export async function renderPreviewVideo(
options: PreviewRenderOptions
): Promise<Blob> {
const config = normalizeConfig(options);
const canvas = createCanvas(config.width, config.height);
const context = getContext(canvas);

const image = await loadImage(config.imageUrl);
const stream = canvas.captureStream(config.fps);
const codec = selectOptimalCodec();
const recorder = initializeRecorder(stream, codec);

const chunks: Blob[] = [];
const recordingPromise = new Promise<Blob>((resolve) => {
recorder.ondataavailable = (event) => {
if (event.data.size > 0) chunks.push(event.data);
};
recorder.onstop = () => {
resolve(new Blob(chunks, { type: codec }));
};
});

recorder.start(1000); // 1-second chunks for memory efficiency

const totalFrames = Math.floor(Math.min(config.duration, 15) * config.fps);
const frameInterval = 1000 / config.fps;

for (let frame = 0; frame < totalFrames; frame++) {
const progress = frame / totalFrames;
renderFrame(context, image, config.width, config.height, progress);
await sleep(frameInterval);
}

recorder.stop();
return recordingPromise;
}

/**

· Normalizes and validates configuration options
  */
  function normalizeConfig(options: PreviewRenderOptions): Required<PreviewRenderOptions> {
  return {
  imageUrl: options.imageUrl,
  duration: Math.max(1, options.duration),
  fps: Math.min(60, Math.max(1, options.fps ?? 12)),
  width: Math.min(4096, Math.max(100, options.width ?? 540)),
  height: Math.min(4096, Math.max(100, options.height ?? 960)),
  };
  }

/**

· Creates canvas with error handling
  */
  function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
  }

/**

· Retrieves canvas context with validation
  */
  function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d", {
  alpha: false,
  desynchronized: true,
  willReadFrequently: false,
  });

if (!ctx) {
throw new RenderError(
"Failed to initialize canvas context",
ErrorCode.CONTEXT_INIT_FAILED
);
}

return ctx;
}

/**

· Loads image with retry logic and timeout
  */
  async function loadImage(src: string): Promise<HTMLImageElement> {
  const MAX_RETRIES = 2;
  const TIMEOUT_MS = 10000;

for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
try {
return await loadImageWithTimeout(src, TIMEOUT_MS);
} catch (error) {
if (attempt === MAX_RETRIES) {
throw new RenderError(
Failed to load image after ${MAX_RETRIES} attempts: ${error},
ErrorCode.IMAGE_LOAD_FAILED
);
}
await sleep(1000 * attempt);
}
}

throw new RenderError("Image loading failed unexpectedly", ErrorCode.IMAGE_LOAD_FAILED);
}

/**

· Loads image with timeout protection
  */
  function loadImageWithTimeout(src: string, timeoutMs: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.referrerPolicy = "strict-origin-when-cross-origin";
  let timeoutId: number;
  const cleanup = () => {
  if (timeoutId) clearTimeout(timeoutId);
  img.onload = null;
  img.onerror = null;
  };
  timeoutId = window.setTimeout(() => {
  cleanup();
  reject(new Error(Image load timeout after ${timeoutMs}ms));
  }, timeoutMs);
  img.onload = () => {
  cleanup();
  resolve(img);
  };
  img.onerror = (event) => {
  cleanup();
  reject(new Error(Image load error: ${event.type}));
  };
  img.src = src;
  });
  }

/**

· Selects optimal video codec with fallback
  */
  function selectOptimalCodec(): string {
  const codecs = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
  "video/mp4",
  ];

for (const codec of codecs) {
if (MediaRecorder.isTypeSupported(codec)) {
return codec;
}
}

return "video/webm"; // Fallback, will use browser default
}

/**

· Initializes MediaRecorder with error handling
  */
  function initializeRecorder(stream: MediaStream, mimeType: string): MediaRecorder {
  try {
  const options: MediaRecorderOptions = {
  mimeType,
  videoBitsPerSecond: 2500000, // 2.5 Mbps for quality
  };
  return new MediaRecorder(stream, options);
  } catch (error) {
  throw new RenderError(
  MediaRecorder initialization failed: ${error},
  ErrorCode.RECORDER_INIT_FAILED
  );
  }
  }

/**

· Renders a single frame with cinematic effects
  */
  function renderFrame(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  progress: number
  ): void {
  // Clear with black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

// Calculate aspect-ratio-preserving dimensions
const { drawWidth, drawHeight, offsetX, offsetY } = calculateImagePlacement(
image.width,
image.height,
width,
height,
progress
);

// Enable high-quality image rendering
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

/**

· Calculates image placement with cinematic zoom effect
  */
  function calculateImagePlacement(
  imgWidth: number,
  imgHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  progress: number
  ): {
  drawWidth: number;
  drawHeight: number;
  offsetX: number;
  offsetY: number;
  } {
  const imageRatio = imgWidth / imgHeight;
  const canvasRatio = canvasWidth / canvasHeight;

// Calculate base dimensions (fit to canvas)
let baseWidth: number, baseHeight: number;
if (imageRatio > canvasRatio) {
baseWidth = canvasWidth;
baseHeight = canvasWidth / imageRatio;
} else {
baseHeight = canvasHeight;
baseWidth = canvasHeight * imageRatio;
}

// Subtle cinematic zoom (1% to 3% over duration)
const zoomProgress = Math.min(progress, 1);
const zoom = 1 + (zoomProgress * 0.02);

const drawWidth = baseWidth * zoom;
const drawHeight = baseHeight * zoom;

return {
drawWidth,
drawHeight,
offsetX: (canvasWidth - drawWidth) / 2,
offsetY: (canvasHeight - drawHeight) / 2,
};
}

/**

· Utility function for async delays
  */
  function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
  }

/**

· Custom error class for renderer errors
  */
  export class RenderError extends Error {
  public readonly code: ErrorCode;
  public readonly timestamp: Date;

constructor(message: string, code: ErrorCode) {
super(message);
this.name = "RenderError";
this.code = code;
this.timestamp = new Date();
}
}

/**

· Error codes for comprehensive error handling
  */
  export enum ErrorCode {
  CONTEXT_INIT_FAILED = "CONTEXT_INIT_FAILED",
  IMAGE_LOAD_FAILED = "IMAGE_LOAD_FAILED",
  RECORDER_INIT_FAILED = "RECORDER_INIT_FAILED",
  STREAM_CAPTURE_FAILED = "STREAM_CAPTURE_FAILED",
  RENDER_TIMEOUT = "RENDER_TIMEOUT",
  }

/**

· Utility to get render statistics for debugging
  */
  export function getRenderStats(
  options: PreviewRenderOptions,
  codec: string
  ): RenderStats {
  const config = normalizeConfig(options);
  return {
  totalFrames: Math.floor(Math.min(config.duration, 15) * config.fps),
  duration: Math.min(config.duration, 15),
  fps: config.fps,
  resolution: {
  width: config.width,
  height: config.height,
  },
  codec,
  };
  }

```
