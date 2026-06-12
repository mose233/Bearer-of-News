import { loadFFmpeg } from "@/lib/ffmpeg";

export type ImagePreviewItem = {
  file: File;
  preview: string;
};

export type ExportVideoOptions = {
  imagePreviews: ImagePreviewItem[];
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

export async function createSlideshowVideo(imagePreviews: ImagePreviewItem[]) {
  if (imagePreviews.length === 0) {
    throw new Error("Please upload images first.");
  }

  const ffmpeg = await cleanupFFmpegFiles([
    "slideshow.mp4",
    "final-video.mp4",
    "final-mixed-video.mp4",
    "voiceover.mp3",
    "background-music",
    "input.png",
  ]);

  const firstImage = imagePreviews[0];
  const imageBuffer = await firstImage.file.arrayBuffer();

  if (imageBuffer.byteLength === 0) {
    throw new Error("Uploaded image is empty.");
  }

  await ffmpeg.writeFile("input.png", new Uint8Array(imageBuffer));

  await ffmpeg.exec([
    "-loop",
    "1",
    "-i",
    "input.png",
    "-t",
    "5",
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
  ]);

  return ffmpeg;
}

export async function exportSilentMp4(imagePreviews: ImagePreviewItem[]) {
  try {
    const ffmpeg = await createSlideshowVideo(imagePreviews);
    const data = await ffmpeg.readFile("slideshow.mp4");

    return createMp4Blob(data as Uint8Array | string);
  } catch (error) {
    console.error("EXPORT ERROR:", error);

    alert(
      `Export failed:\n${
        error instanceof Error ? error.message : String(error)
      }`
    );

    throw error;
  }
}

export async function exportNarratedMp4({
  imagePreviews,
  voiceBlob,
  voiceVolume = 1,
}: ExportVideoOptions) {
  if (!voiceBlob) {
    throw new Error("Please generate AI voice first.");
  }

  const ffmpeg = await createSlideshowVideo(imagePreviews);
  const voiceBuffer = await voiceBlob.arrayBuffer();

  await ffmpeg.writeFile("voiceover.mp3", new Uint8Array(voiceBuffer));

  await ffmpeg.exec([
    "-i",
    "slideshow.mp4",
    "-i",
    "voiceover.mp3",
    "-filter_complex",
    `[1:a]volume=${voiceVolume}[voice]`,
    "-map",
    "0:v",
    "-map",
    "[voice]",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-shortest",
    "-movflags",
    "+faststart",
    "final-video.mp4",
  ]);

  const data = await ffmpeg.readFile("final-video.mp4");

  return createMp4Blob(data as Uint8Array | string);
}

export async function exportFinalMixedMp4({
  imagePreviews,
  voiceBlob,
  voiceVolume = 1,
  backgroundMusic,
  musicVolume = 0.18,
}: ExportVideoOptions) {
  if (!voiceBlob) {
    throw new Error("Please generate AI voice first.");
  }

  const ffmpeg = await createSlideshowVideo(imagePreviews);
  const voiceBuffer = await voiceBlob.arrayBuffer();

  await ffmpeg.writeFile("voiceover.mp3", new Uint8Array(voiceBuffer));

  if (backgroundMusic) {
    const musicBuffer = await backgroundMusic.arrayBuffer();

    await ffmpeg.writeFile("background-music", new Uint8Array(musicBuffer));

    await ffmpeg.exec([
      "-i",
      "slideshow.mp4",
      "-i",
      "voiceover.mp3",
      "-stream_loop",
      "-1",
      "-i",
      "background-music",
      "-filter_complex",
      `[1:a]volume=${voiceVolume}[voice];[2:a]volume=${musicVolume}[music];[voice][music]amix=inputs=2:duration=first:dropout_transition=2[aout]`,
      "-map",
      "0:v",
      "-map",
      "[aout]",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-shortest",
      "-movflags",
      "+faststart",
      "final-mixed-video.mp4",
    ]);
  } else {
    await ffmpeg.exec([
      "-i",
      "slideshow.mp4",
      "-i",
      "voiceover.mp3",
      "-filter_complex",
      `[1:a]volume=${voiceVolume}[voice]`,
      "-map",
      "0:v",
      "-map",
      "[voice]",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-shortest",
      "-movflags",
      "+faststart",
      "final-mixed-video.mp4",
    ]);
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

  const safeDuration = Math.min(Math.max(durationSeconds, 5), 60);

  const ffmpeg = await cleanupFFmpegFiles([
    "photo-music-video.mp4",
    "photo-music-image.png",
    "photo-music-audio",
  ]);

  const imageBuffer = await imageFile.arrayBuffer();

  if (imageBuffer.byteLength === 0) {
    throw new Error("Uploaded photo is empty.");
  }

  await ffmpeg.writeFile("photo-music-image.png", new Uint8Array(imageBuffer));

  const audioBuffer = await audioFile.arrayBuffer();

  if (audioBuffer.byteLength === 0) {
    throw new Error("Uploaded audio is empty.");
  }

  await ffmpeg.writeFile("photo-music-audio", new Uint8Array(audioBuffer));

  await ffmpeg.exec([
    "-loop",
    "1",
    "-i",
    "photo-music-image.png",
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
    "-shortest",
    "-movflags",
    "+faststart",
    "photo-music-video.mp4",
  ]);

  const data = await ffmpeg.readFile("photo-music-video.mp4");

  return createMp4Blob(data as Uint8Array | string);
}
