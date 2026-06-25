import { saveAs } from "file-saver";
import {
  isAndroid,
  isIOS,
  supportsNativeShare,
} from "./DeviceManager";
import { ExportFile, ExportOptions } from "./ExportTypes";

const DOWNLOAD_REVOKE_DELAY = 15000;

function createDownloadLink(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.target = "_self";
  anchor.rel = "noopener";
  anchor.style.display = "none";

  document.body.appendChild(anchor);

  try {
    anchor.dispatchEvent(
      new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
  } catch {
    anchor.click();
  }

  window.setTimeout(() => {
    if (document.body.contains(anchor)) {
      document.body.removeChild(anchor);
    }

    URL.revokeObjectURL(url);
  }, DOWNLOAD_REVOKE_DELAY);
}

async function shareBlob(blob: Blob, filename: string) {
  if (!supportsNativeShare()) {
    return false;
  }

  try {
    const file = new File([blob], filename, {
      type: blob.type,
    });

    // @ts-ignore
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      return false;
    }

    // @ts-ignore
    await navigator.share({
      files: [file],
      title: filename,
    });

    return true;
  } catch {
    return false;
  }
}

export async function downloadMedia(
  exportFile: ExportFile,
  options: ExportOptions = {}
) {
  console.log("DOWNLOAD START", {
    filename: exportFile.filename,
    size: exportFile.blob?.size,
    type: exportFile.blob?.type,
  });

  const { blob, filename } = exportFile;

  if (!blob || blob.size === 0) {
    throw new Error("Export produced an empty file.");
  }

  try {
    /*
 * Android
 */
if (isAndroid()) {
  const shared =
    options.shareOnMobile === true
      ? await shareBlob(blob, filename)
      : false;

  if (!shared) {
    console.log("ANDROID: Starting native download", {
      filename,
      size: blob.size,
      type: blob.type,
    });

    // Bypass file-saver on Android.
    // It has inconsistent behavior across Chrome/WebView versions,
    // especially after repeated downloads.
    createDownloadLink(blob, filename);

    console.log("ANDROID: Native download link created");
  }

  return true;
}

    /*
     * iPhone / iPad
     */
    if (isIOS()) {
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

    /*
     * Desktop
     */
    saveAs(blob, filename);

    return true;
  } catch (error) {
    console.error("Download failed.", error);

    try {
      createDownloadLink(blob, filename);
      return true;
    } catch (fallbackError) {
      console.error("Fallback download failed.", fallbackError);
      throw fallbackError;
    }
  }
}

export async function downloadImage(
  blob: Blob,
  filename: string
) {
  return downloadMedia({
    blob,
    filename,
    mimeType: "image/png",
  });
}

export async function downloadVideo(
  blob: Blob,
  filename: string
) {
  return downloadMedia({
    blob,
    filename,
    mimeType: "video/mp4",
  });
}

export async function downloadAudio(
  blob: Blob,
  filename: string
) {
  return downloadMedia({
    blob,
    filename,
    mimeType: "audio/mpeg",
  });
}
