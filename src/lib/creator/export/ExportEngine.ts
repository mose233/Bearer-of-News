import { isAndroid } from "@/lib/creator/DeviceManager";
import { ExportManager } from "@/lib/creator/ExportManager";
import { downloadAndroidMedia } from "@/lib/creator/android/AndroidDownloadManager";

export type ExportMedia =
  | {
      type: "image";
      blob: Blob;
    }
  | {
      type: "video";
      blob: Blob;
    }
  | {
      type: "audio";
      blob: Blob;
    };

export class ExportEngine {
  static async export(media: ExportMedia) {
    console.log("EXPORT ENGINE CALLED", media.type);
    // Desktop stays EXACTLY the same.
    // Android will later receive its own implementation.
    if (isAndroid()) {
      return this.exportAndroid(media);
    }

    return this.exportDesktop(media);
  }

  private static async exportDesktop(media: ExportMedia) {
    switch (media.type) {
      case "image":
        return ExportManager.exportImage(media.blob);

      case "video":
        return ExportManager.exportVideo(media.blob);

      case "audio":
        return ExportManager.exportVoice(media.blob);
    }
  }

  private static async exportAndroid(media: ExportMedia) {
  let filename = "";

  switch (media.type) {
    case "image":
      filename = `xnewsapp-image-${Date.now()}.png`;
      break;

    case "video":
      filename = `xnewsapp-video-${Date.now()}.mp4`;
      break;

    case "audio":
      filename = `xnewsapp-audio-${Date.now()}.mp3`;
      break;
  }

  return downloadAndroidMedia({
    blob: media.blob,
    filename,
    mimeType: media.blob.type,
  });
}
  } 
