export type ExportStage =
  | "preparing"
  | "rendering"
  | "encoding"
  | "optimizing"
  | "downloading"
  | "complete";

export interface ExportProgress {
  stage: ExportStage;
  progress: number;
  message: string;
}

export function createProgress(
  stage: ExportStage,
  progress: number
): ExportProgress {
  const messages: Record<ExportStage, string> = {
    preparing: "Preparing project...",
    rendering: "Rendering video...",
    encoding: "Encoding media...",
    optimizing: "Optimizing output...",
    downloading: "Downloading...",
    complete: "Finished.",
  };

  return {
    stage,
    progress,
    message: messages[stage],
  };
}
