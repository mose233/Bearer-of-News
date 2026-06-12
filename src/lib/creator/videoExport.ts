export async function createSlideshowVideo(
  imagePreviews: ImagePreviewItem[]
) {
  if (imagePreviews.length === 0) {
    throw new Error("Please upload or generate images first.");
  }

  const ffmpeg = await cleanupFFmpegFiles([
    "concat.txt",
    "slideshow.mp4",
    "final-video.mp4",
    "final-mixed-video.mp4",
  ]);

  const imageNames: string[] = [];

  for (let i = 0; i < imagePreviews.length; i++) {
    const image = imagePreviews[i];

    const imageName = `image${i}.png`;

    const buffer = await image.file.arrayBuffer();

    if (buffer.byteLength === 0) {
      throw new Error(`Image ${i + 1} file is empty.`);
    }

    await ffmpeg.writeFile(
      imageName,
      new Uint8Array(buffer)
    );

    imageNames.push(imageName);
  }

  const concatText = [
    ...imageNames.flatMap((imageName) => [
      `file '${imageName}'`,
      "duration 5",
    ]),
    `file '${imageNames[imageNames.length - 1]}'`,
  ].join("\n");

  await ffmpeg.writeFile(
    "concat.txt",
    new TextEncoder().encode(concatText)
  );

  await ffmpeg.exec([
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    "concat.txt",
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

  const output = await ffmpeg.readFile(
    "slideshow.mp4"
  );

  if (
    !(output instanceof Uint8Array) ||
    output.byteLength === 0
  ) {
    throw new Error("Generated MP4 is empty.");
  }

  return ffmpeg;
}
