import { FalVideoTool } from "./falTypes";

export const falModelByTool: Record<FalVideoTool, string | null> = {
  "Text to Video": "fal-ai/wan/v2.7/text-to-video",
  "Photo to Video": "fal-ai/wan/v2.7/image-to-video",

  // These tools do not have a dedicated fal.ai implementation yet.
  // They must not fall back to fake/mock video generation.
  "Talking Avatar": null,
  "AI News Presenter": null,
  "Dance Animation": null,
  "AI Music Video Studio": null,
};
