```ts
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
    const extension =
      media.type === "image"
        ? "png"
        : media.type === "video"
        ? "mp4"
        : "mp3";

    const mime =
      media.type === "image"
        ? "image/png"
        : media.type === "video"
        ? "video/mp4"
        : "audio/mpeg";

    const filename = "xnewsapp-" + media.type + "-" + Date.now() + "." + extension;

    const file = new File([media.blob], filename, {
      type: mime,
    });

    // 1. Native Android share
    try {
      // @ts-ignore
      if (
        navigator.share &&
        navigator.canShare &&
        // @ts-ignore
        navigator.canShare({ files: [file] })
      ) {
        // @ts-ignore
        await navigator.share({
          files: [file],
          title: filename,
        });

        return true;
      }
    } catch (e) {
      console.warn("Native share unavailable.", e);
    }

    // 2. Blob URL fallback
    try {
      const url = URL.createObjectURL(media.blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 2000);

      return true;
    } catch (e) {
      console.warn("Blob download failed.", e);
    }

    // 3. Data URL last resort
    try {
      const reader = new FileReader();

      await new Promise<void>((resolve, reject) => {
        reader.onload = () => {
          const a = document.createElement("a");
          a.href = reader.result as string;
          a.download = filename;
          a.click();
          resolve();
        };

        reader.onerror = reject;

        reader.readAsDataURL(media.blob);
      });

      return true;
    } catch (e) {
      console.error("Android export failed.", e);
      throw e;
    }
  }
}
```
