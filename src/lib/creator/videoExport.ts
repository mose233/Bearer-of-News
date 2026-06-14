import { loadFFmpeg } from "@/lib/ffmpeg";

export type ImagePreviewItem = {
  file: File;
  preview: string;
};

export type ExportVideoOptions = {
  imagePreviews: ImagePreviewItem[];
  durationSeconds?: number;
  voiceBlob?: Blob | null;
  voiceVolume?: number;
  backgroundMusic?: File | null;
  musicVolume?: number;
};

export type ExportPhotoMusicVideoOptions = {
  imageFile: File;
  imagePreview: string;
  audioFile: File;
  durationSeconds?: number;
  musicVolume?: number;
};

function getSafeDuration(durationSeconds?: number) {
  return Math.min(Math.max(durationSeconds || 10, 10), 60);
}

function createMp4Blob(data: Uint8Array | string) {
  const bytes =
    data instanceof Uint8Array ? data : new TextEncoder().encode(data);

  const blob = new Blob([bytes], {
    type: "video/mp4",
  });

  if (blob.size === 0) {
    throw new Error("Generated MP4 is empty.");
  }

  return blob;
}

function getInputImageName(file: File) {
  if (file.type.includes("jpeg") || file.type.includes("jpg")) {
    return "input-image.jpg";
  }

  if (file.type.includes("webp")) {
    return "input-image.webp";
  }

  return "input-image.png";
}

async function cleanupFFmpegFiles(files: string[]) {
  const ffmpeg = await loadFFmpeg();

  for (const file of files) {
    try {
      await ffmpeg.deleteFile(file);
    } catch {
      // Ignore missing files.
    }
  }

  return ffmpeg;
}

async function runFFmpeg(command: string[], label: string) {
  const ffmpeg = await loadFFmpeg();

  try {
    await ffmpeg.exec(command);
  } catch (error) {
    console.error(`${label} failed:`, error);
    console.error("FFmpeg command:", command.join(" "));

    throw new Error(`${label} failed. Check console for FFmpeg details.`);
  }
}

export async function exportMediaMp4(
  mediaItems: ImagePreviewItem[],
  durationSeconds = 10
) {
  if (mediaItems.length === 0) {
    throw new Error("Please upload images or videos first.");
  }

  const safeDuration = getSafeDuration(durationSeconds);
  const firstItem = mediaItems[0];

  if (!firstItem?.file) {
    throw new Error("Media file is missing.");
  }

  const inputImageName = getInputImageName(firstItem.file);

  const ffmpeg = await cleanupFFmpegFiles([
    "media-output.mp4",
    "input-image.png",
    "input-image.jpg",
    "input-image.webp",
    "input-video.mp4",
  ]);

  const mediaBuffer = await firstItem.file.arrayBuffer();

  if (mediaBuffer.byteLength === 0) {
    throw new Error("Uploaded media is empty.");
  }

  if (firstItem.file.type.startsWith("video/")) {
    await ffmpeg.writeFile("input-video.mp4", new Uint8Array(mediaBuffer));

    await runFFmpeg(
      [
        "-y",
        "-stream_loop",
        "-1",
        "-i",
        "input-video.mp4",
        "-t",
        String(safeDuration),
        "-vf",
        "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,format=yuv420p",
        "-r",
        "30",
        "-an",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-preset",
        "ultrafast",
        "-movflags",
        "+faststart",
        "media-output.mp4",
      ],
      "Video export"
    );
  } else {
    await ffmpeg.writeFile(inputImageName, new Uint8Array(mediaBuffer));

    await runFFmpeg(
      [
        "-y",
        "-loop",
        "1",
        "-framerate",
        "30",
        "-i",
        inputImageName,
        "-t",
        String(safeDuration),
        "-vf",
        "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,format=yuv420p",
        "-r",
        "30",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-preset",
        "ultrafast",
        "-movflags",
        "+faststart",
        "media-output.mp4",
      ],
      "Image to MP4 export"
    );
  }

  const data = await ffmpeg.readFile("media-output.mp4");

  return createMp4Blob(data as Uint8Array | string);
}

export async function createSlideshowVideo(
  imagePreviews: ImagePreviewItem[],
  durationSeconds = 10
) {
  if (imagePreviews.length === 0) {
    throw new Error("Please upload images first.");
  }

  const safeDuration = getSafeDuration(durationSeconds);
  const firstImage = imagePreviews[0];

  if (!firstImage?.file) {
    throw new Error("Image file is missing.");
  }

  const inputImageName = getInputImageName(firstImage.file);

  const ffmpeg = await cleanupFFmpegFiles([
    "slideshow.mp4",
    "final-video.mp4",
    "final-mixed-video.mp4",
    "voiceover.mp3",
    "background-music",
    "input.png",
    "input-image.png",
    "input-image.jpg",
    "input-image.webp",
  ]);

  const imageBuffer = await firstImage.file.arrayBuffer();

  if (imageBuffer.byteLength === 0) {
    throw new Error("Uploaded image is empty.");
  }

  await ffmpeg.writeFile(inputImageName, new Uint8Array(imageBuffer));

  await runFFmpeg(
    [
      "-y",
      "-loop",
      "1",
      "-framerate",
      "30",
      "-i",
      inputImageName,
      "-t",
      String(safeDuration),
      "-vf",
      "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,format=yuv420p",
      "-r",
      "30",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "ultrafast",
      "-movflags",
      "+faststart",
      "slideshow.mp4",
    ],
    "Slideshow export"
  );

  return ffmpeg;
}

export async function exportSilentMp4(
  imagePreviews: ImagePreviewItem[],
  durationSeconds = 10
) {
  return exportMediaMp4(imagePreviews, durationSeconds);
}

export async function exportNarratedMp4({
  imagePreviews,
  durationSeconds = 10,
  voiceBlob,
  voiceVolume = 1,
}: ExportVideoOptions) {
  if (!voiceBlob) {
    throw new Error("Please generate AI voice first.");
  }

  const safeDuration = getSafeDuration(durationSeconds);
  const ffmpeg = await createSlideshowVideo(imagePreviews, safeDuration);
  const voiceBuffer = await voiceBlob.arrayBuffer();

  if (voiceBuffer.byteLength === 0) {
    throw new Error("Voice audio is empty.");
  }

  await ffmpeg.writeFile("voiceover.mp3", new Uint8Array(voiceBuffer));

  await runFFmpeg(
    [
      "-y",
      "-i",
      "slideshow.mp4",
      "-i",
      "voiceover.mp3",
      "-filter_complex",
      `[1:a]volume=${voiceVolume},apad[aout]`,
      "-map",
      "0:v",
      "-map",
      "[aout]",
      "-t",
      String(safeDuration),
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-movflags",
      "+faststart",
      "final-video.mp4",
    ],
    "Narrated MP4 export"
  );

  const data = await ffmpeg.readFile("final-video.mp4");

  return createMp4Blob(data as Uint8Array | string);
}

export async function exportFinalMixedMp4({
  imagePreviews,
  durationSeconds = 10,
  voiceBlob,
  voiceVolume = 1,
  backgroundMusic,
  musicVolume = 0.18,
}: ExportVideoOptions) {
  if (!voiceBlob) {
    throw new Error("Please generate AI voice first.");
  }

  const safeDuration = getSafeDuration(durationSeconds);
  const ffmpeg = await createSlideshowVideo(imagePreviews, safeDuration);
  const voiceBuffer = await voiceBlob.arrayBuffer();

  if (voiceBuffer.byteLength === 0) {
    throw new Error("Voice audio is empty.");
  }

  await ffmpeg.writeFile("voiceover.mp3", new Uint8Array(voiceBuffer));

  if (backgroundMusic) {
    const musicBuffer = await backgroundMusic.arrayBuffer();

    if (musicBuffer.byteLength === 0) {
      throw new Error("Background music is empty.");
    }

    await ffmpeg.writeFile("background-music", new Uint8Array(musicBuffer));

    await runFFmpeg(
      [
        "-y",
        "-i",
        "slideshow.mp4",
        "-i",
        "voiceover.mp3",
        "-stream_loop",
        "-1",
        "-i",
        "background-music",
        "-filter_complex",
        `[1:a]volume=${voiceVolume},apad[voice];[2:a]volume=${musicVolume}[music];[voice][music]amix=inputs=2:duration=first:dropout_transition=2[aout]`,
        "-map",
        "0:v",
        "-map",
        "[aout]",
        "-t",
        String(safeDuration),
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-movflags",
        "+faststart",
        "final-mixed-video.mp4",
      ],
      "Final mixed MP4 export"
    );
  } else {
    await runFFmpeg(
      [
        "-y",
        "-i",
        "slideshow.mp4",
        "-i",
        "voiceover.mp3",
        "-filter_complex",
        `[1:a]volume=${voiceVolume},apad[aout]`,
        "-map",
        "0:v",
        "-map",
        "[aout]",
        "-t",
        String(safeDuration),
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-movflags",
        "+faststart",
        "final-mixed-video.mp4",
      ],
      "Final MP4 export"
    );
  }

  const data = await ffmpeg.readFile("final-mixed-video.mp4");

  return createMp4Blob(data as Uint8Array | string);
}

export async function exportPhotoMusicVideoMp4({
  imageFile,
  audioFile,
  durationSeconds = 15,
  musicVolume = 0.85,
}: ExportPhotoMusicVideoOptions) {
  if (!imageFile) {
    throw new Error("Please upload a photo first.");
  }

  if (!audioFile) {
    throw new Error("Please upload a song first.");
  }

  const safeDuration = getSafeDuration(durationSeconds);
  const inputImageName = getInputImageName(imageFile);

  const ffmpeg = await cleanupFFmpegFiles([
    "photo-music-video.mp4",
    "photo-music-image.png",
    "photo-music-image.jpg",
    "photo-music-image.webp",
    "photo-music-audio",
  ]);

  const imageBuffer = await imageFile.arrayBuffer();

  if (imageBuffer.byteLength === 0) {
    throw new Error("Uploaded photo is empty.");
  }

  const photoImageName =
    inputImageName === "input-image.jpg"
      ? "photo-music-image.jpg"
      : inputImageName === "input-image.webp"
        ? "photo-music-image.webp"
        : "photo-music-image.png";

  await ffmpeg.writeFile(photoImageName, new Uint8Array(imageBuffer));

  const audioBuffer = await audioFile.arrayBuffer();

  if (audioBuffer.byteLength === 0) {
    throw new Error("Uploaded audio is empty.");
  }

  await ffmpeg.writeFile("photo-music-audio", new Uint8Array(audioBuffer));

  await runFFmpeg(
    [
      "-y",
      "-loop",
      "1",
      "-framerate",
      "30",
      "-i",
      photoImageName,
      "-stream_loop",
      "-1",
      "-i",
      "photo-music-audio",
      "-t",
      String(safeDuration),
      "-vf",
      "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,format=yuv420p",
      "-filter:a",
      `volume=${musicVolume}`,
      "-c:v",
      "libx264",
      "-c:a",
      "aac",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "ultrafast",
      "-movflags",
      "+faststart",
      "photo-music-video.mp4",
    ],
    "Photo music video export"
  );

  const data = await ffmpeg.readFile("photo-music-video.mp4");

  return createMp4Blob(data as Uint8Array | string);
}
