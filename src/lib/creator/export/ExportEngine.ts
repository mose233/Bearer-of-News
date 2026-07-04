import { isAndroid } from "@/lib/creator/DeviceManager";
import { ExportManager } from "@/lib/creator/ExportManager";
import AndroidDownloadService from "@/lib/creator/android/AndroidDownloadService";

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

  switch (media.type) {
  case "image":
    return AndroidDownloadService.saveImage(media.blob, filename);

  case "video":
    return AndroidDownloadService.saveVideo(media.blob, filename);

  case "audio":
    return AndroidDownloadService.saveAudio(media.blob, filename);
}
