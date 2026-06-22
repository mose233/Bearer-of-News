import { exportPreviewVideo } from "./VideoExporter";
import { renderPreviewVideo } from "./PreviewRenderer";

export interface TimelineExportOptions {
  preview: string;
  duration: number;
}

export async function exportTimeline({
  preview,
  duration,
}: TimelineExportOptions) {
  const blob = await renderPreviewVideo({
    imageUrl: preview,
    duration,
  });

  await exportPreviewVideo(blob);
}
