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
  fps = 24,
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
    mimeType = "";
  }

  const stream = canvas.captureStream(fps);

  let recorder: MediaRecorder;

  try {
    recorder =
      mimeType !== ""
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
  } catch {
    throw new Error(
      "This browser does not support video preview export."
    );
  }

  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const finished = new Promise<Blob>((resolve) => {
    recorder.onstop = () =>
      resolve(
        new Blob(chunks, {
          type: mimeType || "video/webm",
        })
      );
  });

  recorder.start();

  const safeDuration = Math.min(duration, 15);
  const totalFrames = safeDuration * fps;

  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;

  let fitWidth: number;
  let fitHeight: number;

  if (imageRatio > canvasRatio) {
    fitWidth = width;
    fitHeight = width / imageRatio;
  } else {
    fitHeight = height;
    fitWidth = height * imageRatio;
  }

  for (let frame = 0; frame < totalFrames; frame++) {
    const progress = frame / totalFrames;

    ctx.clearRect(0, 0, width, height);

    // -------------------------------------------------
    // Blurred Background
    // -------------------------------------------------

    ctx.save();

    ctx.filter = "blur(35px) brightness(55%)";

    const bgScale = Math.max(
      width / image.width,
      height / image.height
    );

    const bgWidth = image.width * bgScale;
    const bgHeight = image.height * bgScale;

    ctx.drawImage(
      image,
      (width - bgWidth) / 2,
      (height - bgHeight) / 2,
      bgWidth,
      bgHeight
    );

    ctx.restore();

    // Dark overlay

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, width, height);

    // -------------------------------------------------
    // Cinematic Zoom
    // -------------------------------------------------

    const zoom = 1 + progress * 0.08;

    const drawWidth = fitWidth * zoom;
    const drawHeight = fitHeight * zoom;

    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    // -------------------------------------------------
    // Shadow
    // -------------------------------------------------

    ctx.save();

    ctx.shadowColor = "rgba(0,0,0,.45)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 8;

    ctx.drawImage(
      image,
      x,
      y,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    await new Promise((r) =>
      setTimeout(r, 1000 / fps)
    );
  }

  recorder.stop();

  return finished;
}
