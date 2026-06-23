import { generateSceneImage } from "@/lib/creator/imageGeneration";
import {
  generateMultiScenePlan,
  MultiScenePlan,
} from "@/lib/creator/multiSceneGenerator";

export interface SceneGenerationResult {
  file: File;
  previewUrl: string;
}

export async function generateSingleScene(
  prompt: string,
  size = "1024x1024"
): Promise<SceneGenerationResult> {
  return generateSceneImage(prompt, size);
}

export function createScenePlan(
  prompt: string,
  duration: number
): MultiScenePlan[] {
  return generateMultiScenePlan(prompt, duration);
}
