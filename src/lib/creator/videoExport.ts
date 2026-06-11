export async function exportSilentMp4(
  imagePreviews: ImagePreviewItem[]
) {
  const ffmpeg = await createSlideshowVideo(imagePreviews);

  const data = await ffmpeg.readFile("slideshow.mp4");

  const uint8 =
    data instanceof Uint8Array
      ? data
      : new Uint8Array(data as ArrayBuffer);

  const blob = new Blob([uint8], {
    type: "video/mp4",
  });

  if (blob.size === 0) {
    throw new Error("Generated MP4 is empty.");
  }

  return blob;
}
