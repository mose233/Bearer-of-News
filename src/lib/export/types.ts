export type ExportMediaType = "image" | "video" | "audio" | "document";

export interface ExportMedia {
  blob?: Blob;
  url?: string;

  filename: string;

  mimeType: string;

  type: ExportMediaType;
}

export interface DownloadResult {
  success: boolean;

  filename: string;

  message?: string;

  error?: unknown;
}
