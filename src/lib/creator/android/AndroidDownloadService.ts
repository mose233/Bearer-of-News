import { Capacitor } from "@capacitor/core";

export default class AndroidDownloadService {
  static isAvailable(): boolean {
    return Capacitor.getPlatform() === "android";
  }

  static async saveImage(
    blob: Blob,
    filename: string
  ): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    throw new Error("Android native image saving is not implemented yet.");
  }

  static async saveVideo(
    blob: Blob,
    filename: string
  ): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    throw new Error("Android native video saving is not implemented yet.");
  }

  static async saveAudio(
    blob: Blob,
    filename: string
  ): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    throw new Error("Android native audio saving is not implemented yet.");
  }
}
