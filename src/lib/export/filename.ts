import { ExportMediaType } from "./types";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function generateTimestamp() {
  const now = new Date();

  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    "-" +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

function extensionForMime(mime: string) {
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("webm")) return "webm";
  if (mime.includes("png")) return "png";
  if (mime.includes("jpeg")) return "jpg";
  if (mime.includes("jpg")) return "jpg";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("mp3")) return "mp3";
  if (mime.includes("wav")) return "wav";

  return "bin";
}

export function generateFilename(
  type: ExportMediaType,
  mimeType: string
) {
  const ext = extensionForMime(mimeType);

  return `xnewsapp-${type}-${generateTimestamp()}.${ext}`;
}
