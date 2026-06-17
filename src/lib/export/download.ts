import { saveAs } from "file-saver";

import { ExportMedia, DownloadResult } from "./types";
import { validateExportMedia } from "./validation";

export async function downloadMedia(
  media: ExportMedia
): Promise<DownloadResult> {
  try {
    const validation = validateExportMedia(media);

    if (validation) {
      return {
        success: false,
        filename: media.filename,
        message: validation,
      };
    }

    if (media.blob) {
      saveAs(media.blob, media.filename);

      return {
        success: true,
        filename: media.filename,
      };
    }

    if (media.url) {
      const response = await fetch(media.url);

      if (!response.ok) {
        throw new Error("Failed to download remote file.");
      }

      const blob = await response.blob();

      saveAs(blob, media.filename);

      return {
        success: true,
        filename: media.filename,
      };
    }

    return {
      success: false,
      filename: media.filename,
      message: "Unsupported download source.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      filename: media.filename,
      error,
      message: "Download failed.",
    };
  }
}
