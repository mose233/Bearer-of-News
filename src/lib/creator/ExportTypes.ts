export type ExportKind =
  | "image"
  | "video"
  | "audio"
  | "document";

export interface ExportFile {
  blob: Blob;
  filename: string;
  mimeType: string;
}

export interface ExportOptions {
  openAfterDownload?: boolean;
  shareOnMobile?: boolean;
}
