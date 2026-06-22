import { ExportManager } from "./ExportManager";

export interface ImageExportOptions {
  file?: File | Blob | null;
  preview?: string | null;
  defaultName?: string;
}

async function blobFromPreview(preview: string): Promise<Blob> {
  const response = await fetch(preview);

  if (!response.ok) {
    throw new Error("Unable to load preview image.");
  }

  return response.blob();
}

export async function exportImage(
  options: ImageExportOptions
): Promise<void> {
  const {
    file,
    preview,
    defaultName = "xnewsapp-image",
  } = options;

  if (file instanceof Blob) {
    await ExportManager.exportCustom(
      file,
      `${defaultName}.png`
    );
    return;
  }

  if (preview) {
    const blob = await blobFromPreview(preview);

    await ExportManager.exportCustom(
      blob,
      `${defaultName}.png`
    );
    return;
  }

  throw new Error("No image available to export.");
}

export async function exportPoster(
  file?: File | Blob | null,
  preview?: string | null
) {
  return exportImage({
    file,
    preview,
    defaultName: "xnewsapp-poster",
  });
}

export async function exportFacebookPost(
  file?: File | Blob | null,
  preview?: string | null
) {
  return exportImage({
    file,
    preview,
    defaultName: "xnewsapp-facebook-post",
  });
}

export async function exportQuote(
  file?: File | Blob | null,
  preview?: string | null
) {
  return exportImage({
    file,
    preview,
    defaultName: "xnewsapp-quote",
  });
}

export async function exportThumbnail(
  file?: File | Blob | null,
  preview?: string | null
) {
  return exportImage({
    file,
    preview,
    defaultName: "xnewsapp-thumbnail",
  });
}

export async function exportAdvertisement(
  file?: File | Blob | null,
  preview?: string | null
) {
  return exportImage({
    file,
    preview,
    defaultName: "xnewsapp-advertisement",
  });
}

export async function exportFaceReveal(
  file?: File | Blob | null,
  preview?: string | null
) {
  return exportImage({
    file,
    preview,
    defaultName: "xnewsapp-face-reveal",
  });
}

export async function exportPhotoEnhancer(
  file?: File | Blob | null,
  preview?: string | null
) {
  return exportImage({
    file,
    preview,
    defaultName: "xnewsapp-photo-enhancer",
  });
}
