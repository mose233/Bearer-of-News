import { downloadAudio, downloadImage, downloadMedia, downloadVideo } from "./DownloadManager";
import { createExportFileName } from "./FileNameManager";

export class ExportManager {
  static async exportImage(blob: Blob, extension = "png") {
    const filename = createExportFileName(
      "xnewsapp-image",
      extension
    );

    return downloadImage(blob, filename);
  }

  static async exportPoster(blob: Blob) {
    const filename = createExportFileName(
      "xnewsapp-poster",
      "png"
    );

    return downloadImage(blob, filename);
  }

  static async exportProductAd(blob: Blob) {
    const filename = createExportFileName(
      "xnewsapp-product-ad",
      "png"
    );

    return downloadImage(blob, filename);
  }

  static async exportFacebookPost(blob: Blob) {
    const filename = createExportFileName(
      "xnewsapp-facebook-post",
      "png"
    );

    return downloadImage(blob, filename);
  }

  static async exportVideo(blob: Blob) {
    const filename = createExportFileName(
      "xnewsapp-video",
      "mp4"
    );

    return downloadVideo(blob, filename);
  }

  static async exportCinematic(blob: Blob) {
    const filename = createExportFileName(
      "xnewsapp-cinematic",
      "mp4"
    );

    return downloadVideo(blob, filename);
  }

  static async exportMusicVideo(blob: Blob) {
    const filename = createExportFileName(
      "xnewsapp-music-video",
      "mp4"
    );

    return downloadVideo(blob, filename);
  }

  static async exportVoice(blob: Blob) {
    const filename = createExportFileName(
      "xnewsapp-voice",
      "mp3"
    );

    return downloadAudio(blob, filename);
  }

  static async exportCustom(
    blob: Blob,
    filename: string
  ) {
    return downloadMedia({
      blob,
      filename,
      mimeType: blob.type,
    });
  }
}
