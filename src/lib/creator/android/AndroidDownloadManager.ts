import { Capacitor } from "@capacitor/core";

export default class AndroidDownloadService {
  static isAvailable(): boolean {
    return Capacitor.getPlatform() === "android";
  }

  static async saveMedia(
    blob: Blob,
    filename: string,
    mimeType: string
  ): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    console.log("Android native save requested", {
      filename,
      mimeType,
      size: blob.size,
    });

    throw new Error("Native Android save not implemented yet.");
  }

  static saveImage(blob: Blob, filename: string) {
    return this.saveMedia(blob, filename, "image/png");
  }

  static saveVideo(blob: Blob, filename: string) {
    return this.saveMedia(blob, filename, "video/mp4");
  }

  static saveAudio(blob: Blob, filename: string) {
    return this.saveMedia(blob, filename, "audio/mpeg");
  }
}
