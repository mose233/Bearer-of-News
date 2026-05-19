export type DanceStyle =
  | "Afrobeats"
  | "Amapiano"
  | "Michael Jackson Style"
  | "TikTok Dance"
  | "Funny Meme Dance"
  | "Gospel Celebration";

export type GenerateDancingVideoOptions = {
  imageFile: File;
  imagePreview: string;
  danceStyle: DanceStyle;
};

export type GeneratedVideoResult = {
  ok: boolean;
  provider: "mock" | "fal" | "runway" | "kling" | "heygen";
  videoBlob: Blob | null;
  videoUrl: string;
  message: string;
};

export const danceStyles: DanceStyle[] = [
  "Afrobeats",
  "Amapiano",
  "Michael Jackson Style",
  "TikTok Dance",
  "Funny Meme Dance",
  "Gospel Celebration",
];

export async function generateDancingVideoMock({
  imageFile,
  imagePreview,
  danceStyle,
}: GenerateDancingVideoOptions): Promise<GeneratedVideoResult> {
  if (!imageFile || !imagePreview) {
    throw new Error("Please upload a photo first.");
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    ok: true,
    provider: "mock",
    videoBlob: null,
    videoUrl: imagePreview,
    message: `Mock dancing video ready using ${danceStyle}. Real AI motion will be connected later.`,
  };
}

export async function generateDancingVideo(
  options: GenerateDancingVideoOptions
): Promise<GeneratedVideoResult> {
  // Future paid API connection will go here.
  // Example providers:
  // - fal.ai
  // - Kling
  // - Runway
  // - HeyGen
  // - D-ID
  //
  // For now we return a safe mock result so the app framework works.

  return generateDancingVideoMock(options);
}
