import { ExportManager } from "./ExportManager";

export interface VoiceExportOptions {
  blob?: Blob | null;
  preview?: string | null;
  filename?: string;
}

async function blobFromPreview(url: string): Promise<Blob> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to download voice preview.");
  }

  return response.blob();
}

export async function exportVoice({
  blob,
  preview,
  filename = "xnewsapp-voice",
}: VoiceExportOptions) {
  if (blob) {
    await ExportManager.exportCustom(
      blob,
      `${filename}.${getExtension(blob.type)}`
    );
    return;
  }

  if (preview) {
    const voiceBlob = await blobFromPreview(preview);

    await ExportManager.exportCustom(
      voiceBlob,
      `${filename}.${getExtension(voiceBlob.type)}`
    );

    return;
  }

  throw new Error("No voice available.");
}

function getExtension(type: string) {
  if (type.includes("mpeg")) return "mp3";

  if (type.includes("mp3")) return "mp3";

  if (type.includes("wav")) return "wav";

  if (type.includes("ogg")) return "ogg";

  return "mp3";
}
