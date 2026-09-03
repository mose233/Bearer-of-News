import { FalVideoTool } from "./falTypes";

export const falModelByTool: Record<FalVideoTool, string | null> = {
  "Text to Video": "fal-ai/wan-t2v",
  "Photo to Video": "fal-ai/wan-i2v",

  // These tools do not use Wan 2.1 yet.
  // They must not fall back to fake/mock generation.
  "Talking Avatar": null,
  "AI News Presenter": null,
  "Dance Animation": null,
  "AI Music Video Studio": null,
};
