import {
  DanceStyle,
  generateDancingVideo,
} from "@/lib/ai/videoProviders";

export async function createDanceVideo(
  imageFile: File,
  imagePreview: string,
  danceStyle: DanceStyle
) {
  return generateDancingVideo({
    imageFile,
    imagePreview,
    danceStyle,
  });
}
