import { ExportManager } from "./ExportManager";

export interface VideoExportOptions {
  blob?: Blob | null;
  file?: File | null;
  preview?: string | null;
  defaultName?: string;
}

async function blobFromPreview(preview: string): Promise<Blob> {
  const response = await fetch(preview);

  if (!response.ok) {
    throw new Error("Unable to load preview video.");
  }

  return await response.blob();
}

export async function exportVideo(
  options: VideoExportOptions
): Promise<void> {
  const {
    blob,
    file,
    preview,
    defaultName = "xnewsapp-video",
  } = options;

  if (blob) {
    await ExportManager.exportCustom(
      blob,
      `${defaultName}.${getExtension(blob.type)}`
    );
    return;
  }

  if (file) {
    await ExportManager.exportCustom(
      file,
      file.name || `${defaultName}.${getExtension(file.type)}`
    );
    return;
  }

  if (preview) {
    const previewBlob = await blobFromPreview(preview);

    await ExportManager.exportCustom(
      previewBlob,
      `${defaultName}.${getExtension(previewBlob.type)}`
    );

    return;
  }

  throw new Error("No video available to export.");
}

export async function exportCinematic(
  blob: Blob
) {
  await exportVideo({
    blob,
    defaultName: "xnewsapp-cinematic",
  });
}

export async function exportPreviewVideo(
  blob: Blob
) {
  await exportVideo({
    blob,
    defaultName: "xnewsapp-preview",
  });
}

export async function exportTimelineVideo(
  blob: Blob
) {
  await exportVideo({
    blob,
    defaultName: "xnewsapp-timeline",
  });
}

export async function exportMusicVideo(
  blob: Blob
) {
  await exportVideo({
    blob,
    defaultName: "xnewsapp-music-video",
  });
}

function getExtension(type: string) {
  if (type.includes("mp4")) return "mp4";

  if (type.includes("webm")) return "webm";

  if (type.includes("ogg")) return "ogg";

  return "bin";
}
