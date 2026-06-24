export interface PreviewRenderOptions {
  imageUrl: string;
  duration: number;
  fps?: number;
  width?: number;
  height?: number;
}

export async function renderPreviewVideo({
  imageUrl,
  duration,
  fps = 12,
  width = 540,
  height = 960,
}: PreviewRenderOptions): Promise<Blob> {
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas.");
  }

  const image = new Image();

  image.crossOrigin = "anonymous";

  image.src = imageUrl;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
  });

  let mimeType = "video/webm";

if (!MediaRecorder.isTypeSupported(mimeType)) {
  console.warn("video/webm not supported. Using browser default.");
  mimeType = "";
}

  const stream = canvas.captureStream(fps);
if (!stream) {
  throw new Error("Unable to create video stream.");
}
 let recorder: MediaRecorder;

try {
 recorder =
  mimeType !== ""
    ? new MediaRecorder(stream, { mimeType })
    : new MediaRecorder(stream);
} catch (error) {
  console.error("MediaRecorder failed", error);

  throw new Error(
    "This browser does not support video preview export."
  );
}

  const chunks: Blob[] = [];

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  const finished = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(
        new Blob(chunks, {
          type: mimeType,
        })
      );
    };
  });

  recorder.start();
const safeDuration = Math.min(duration, 15);
const totalFrames = safeDuration * fps;

  for (let frame = 0; frame < totalFrames; frame++) {
    const progress = frame / totalFrames;

    ctx.clearRect(0, 0, width, height);

    // Gentle zoom animation
    const zoom = 1 + progress * 0.15;

    const drawWidth = width * zoom;
    const drawHeight = height * zoom;

    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    ctx.drawImage(
      image,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );

    await new Promise((r) =>
      setTimeout(r, 1000 / fps)
    );
  }

  recorder.stop();

  return finished;
}
