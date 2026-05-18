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

export async function createSlideshowVideo(imagePreviews: ImagePreviewItem[]) {
  if (imagePreviews.length === 0) {
    throw new Error("Please upload images first.");
  }

  const ffmpeg = await loadFFmpeg();

  const cleanupFiles = [
    "slideshow.mp4",
    "final-video.mp4",
    "final-mixed-video.mp4",
    "final-auto-video.mp4",
    "voiceover.mp3",
    "background-music",
  ];

  for (const file of cleanupFiles) {
    try {
      await ffmpeg.deleteFile(file);
    } catch {
      // File may not exist yet. Safe to ignore.
    }
  }

  for (let i = 0; i < imagePreviews.length; i++) {
    const image = imagePreviews[i];

    const response = await fetch(image.preview);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    await ffmpeg.writeFile(`image${i}.png`, new Uint8Array(buffer));
  }

  await ffmpeg.exec([
    "-framerate",
    "1/5",
    "-i",
    "image%d.png",
    "-vf",
    "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-preset",
    "ultrafast",
    "slideshow.mp4",
  ]);

  return ffmpeg;
}

export async function exportSilentMp4(imagePreviews: ImagePreviewItem[]) {
  const ffmpeg = await createSlideshowVideo(imagePreviews);

  const data = await ffmpeg.readFile("slideshow.mp4");

  return new Blob([data], {
    type: "video/mp4",
  });
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
    "final-video.mp4",
  ]);

  const data = await ffmpeg.readFile("final-video.mp4");

  return new Blob([data], {
    type: "video/mp4",
  });
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
      "final-mixed-video.mp4",
    ]);
  }

  const data = await ffmpeg.readFile("final-mixed-video.mp4");

  return new Blob([data], {
    type: "video/mp4",
  });
}
