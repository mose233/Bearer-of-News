export type FalVideoTool =
  | "Text to Video"
  | "Photo to Video"
  | "Talking Avatar"
  | "AI News Presenter"
  | "Dance Animation"
  | "AI Music Video Studio";

export type FalVideoRequest = {
  tool: FalVideoTool;
  prompt: string;
  imageUrl?: string;
  audioUrl?: string;
  durationSeconds: number;
  aspectRatio: "9:16" | "1:1" | "16:9";
};

export type FalVideoResult = {
  id: string;
  status: "queued" | "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
};
