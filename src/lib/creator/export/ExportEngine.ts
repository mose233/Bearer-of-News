import { isAndroid } from "@/lib/creator/DeviceManager";
import { ExportManager } from "@/lib/creator/ExportManager";

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
  return this.exportDesktop(media);
}
}
  
