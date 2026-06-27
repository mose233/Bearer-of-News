import { AndroidExportFile, AndroidExportOptions } from "./AndroidTypes";
import { shareFile } from "./AndroidShareManager";

const DOWNLOAD_REVOKE_DELAY = 15000;

function createDownloadLink(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";

  document.body.appendChild(anchor);

  requestAnimationFrame(() => {
    anchor.click();
  });

  window.setTimeout(() => {
    if (document.body.contains(anchor)) {
      document.body.removeChild(anchor);
    }

    URL.revokeObjectURL(url);
  }, DOWNLOAD_REVOKE_DELAY);
}

export async function downloadAndroidMedia(
  exportFile: AndroidExportFile,
  options: AndroidExportOptions = {}
): Promise<boolean> {
  const { blob, filename } = exportFile;

  if (!blob || blob.size === 0) {
    throw new Error("Export produced an empty file.");
  }

  const shared =
    options.shareOnMobile === true
      ? await shareFile(blob, filename)
      : false;

   if (!shared) {
    await new Promise((resolve) =>
      requestAnimationFrame(resolve)
    );

    createDownloadLink(blob, filename);

    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );
  }

  return true;
}
