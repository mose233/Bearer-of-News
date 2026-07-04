import AndroidDownloadService from "@/lib/android/AndroidDownloadService";
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
  
  anchor.rel = "noopener";
  anchor.style.display = "none";

  document.body.appendChild(anchor);
document.body.appendChild(anchor);

// Give Android Chrome time to attach the element
requestAnimationFrame(() => {
  anchor.click();

  window.setTimeout(() => {
    if (document.body.contains(anchor)) {
      document.body.removeChild(anchor);
    }

    URL.revokeObjectURL(url);
  }, DOWNLOAD_REVOKE_DELAY);
});

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
  const freshBlob = new Blob([blob], {
    type: blob.type,
  });

  const url = URL.createObjectURL(freshBlob);

const link = document.createElement("a");
link.href = url;
link.download = filename;
link.target = "_self";

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

setTimeout(() => {
  URL.revokeObjectURL(url);
}, 30000);
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
