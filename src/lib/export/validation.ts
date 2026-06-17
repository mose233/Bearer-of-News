import { ExportMedia } from "./types";

export function validateExportMedia(
  media: ExportMedia
): string | null {
  if (!media.blob && !media.url) {
    return "Nothing to download.";
  }

  if (media.blob && media.blob.size === 0) {
    return "Generated file is empty.";
  }

  if (!media.filename.trim()) {
    return "Filename is missing.";
  }

  if (!media.mimeType.trim()) {
    return "MIME type is missing.";
  }

  return null;
}
