```ts
import { saveAs } from "file-saver";
import {
  isAndroid,
  isIOS,
  supportsNativeShare,
} from "./DeviceManager";
import { ExportFile, ExportOptions } from "./ExportTypes";

const DOWNLOAD_REVOKE_DELAY = 1500;

function createDownloadLink(blob: Blob, filename: string) {
  console.log("[DOWNLOAD] STEP A - createDownloadLink()");
  console.log("[DOWNLOAD] Blob size:", blob.size);

  const url = URL.createObjectURL(blob);
  console.log("[DOWNLOAD] STEP B - Object URL created:", url);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";

  console.log("[DOWNLOAD] STEP C - Anchor created");

  document.body.appendChild(anchor);

  console.log("[DOWNLOAD] STEP D - Clicking anchor");
  anchor.click();
  console.log("[DOWNLOAD] STEP E - Anchor click finished");

  window.setTimeout(() => {
    console.log("[DOWNLOAD] STEP F - Cleaning up");

    if (document.body.contains(anchor)) {
      document.body.removeChild(anchor);
    }

    URL.revokeObjectURL(url);

    console.log("[DOWNLOAD] STEP G - Object URL revoked");
  }, DOWNLOAD_REVOKE_DELAY);
}

async function shareBlob(blob: Blob, filename: string) {
  console.log("[DOWNLOAD] shareBlob()");

  if (!supportsNativeShare()) {
    console.log("[DOWNLOAD] Native Share NOT supported");
    return false;
  }

  try {
    const file = new File([blob], filename, {
      type: blob.type,
    });

    // @ts-ignore
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      console.log("[DOWNLOAD] canShare() returned false");
      return false;
    }

    console.log("[DOWNLOAD] Opening native share");

    // @ts-ignore
    await navigator.share({
      files: [file],
      title: filename,
    });

    console.log("[DOWNLOAD] Native share completed");

    return true;
  } catch (err) {
    console.error("[DOWNLOAD] Native share failed", err);
    return false;
  }
}

export async function downloadMedia(
  exportFile: ExportFile,
  options: ExportOptions = {}
) {
  console.log("====================================");
  console.log("[DOWNLOAD] START");
  console.log("====================================");

  const { blob, filename } = exportFile;

  console.log("[DOWNLOAD] Filename:", filename);
  console.log("[DOWNLOAD] Blob exists:", !!blob);
  console.log("[DOWNLOAD] Blob size:", blob?.size);

  if (!blob || blob.size === 0) {
    console.error("[DOWNLOAD] Empty blob");
    throw new Error("Export produced an empty file.");
  }

  try {
    if (isAndroid()) {
      console.log("[DOWNLOAD] Android detected");

      const shared =
        options.shareOnMobile === true
          ? await shareBlob(blob, filename)
          : false;

      console.log("[DOWNLOAD] Shared:", shared);

      if (!shared) {
        console.log("[DOWNLOAD] Using download link");

        await new Promise((resolve) =>
          requestAnimationFrame(resolve)
        );

        createDownloadLink(blob, filename);

        await new Promise((resolve) =>
          setTimeout(resolve, 400)
        );
      }

      console.log("[DOWNLOAD] Android download finished");
      return true;
    }

    if (isIOS()) {
      console.log("[DOWNLOAD] iOS detected");

      const shared =
        options.shareOnMobile === true
          ? await shareBlob(blob, filename)
          : false;

      if (!shared) {
        try {
          saveAs(blob, filename);
        } catch {
          createDownloadLink(blob, filename);
        }
      }

      return true;
    }

    console.log("[DOWNLOAD] Desktop detected");

    saveAs(blob, filename);

    console.log("[DOWNLOAD] Desktop saveAs finished");

    return true;
  } catch (error) {
    console.error("[DOWNLOAD] FAILED", error);

    try {
      console.log("[DOWNLOAD] Running fallback");

      createDownloadLink(blob, filename);

      return true;
    } catch (fallbackError) {
      console.error("[DOWNLOAD] Fallback failed", fallbackError);
      throw fallbackError;
    }
  } finally {
    console.log("====================================");
    console.log("[DOWNLOAD] END");
    console.log("====================================");
  }
}

export async function downloadImage(blob: Blob, filename: string) {
  return downloadMedia({
    blob,
    filename,
    mimeType: "image/png",
  });
}

export async function downloadVideo(blob: Blob, filename: string) {
  return downloadMedia({
    blob,
    filename,
    mimeType: "video/mp4",
  });
}

export async function downloadAudio(blob: Blob, filename: string) {
  return downloadMedia({
    blob,
    filename,
    mimeType: "audio/mpeg",
  });
}
```
