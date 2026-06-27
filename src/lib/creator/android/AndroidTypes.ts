export interface AndroidExportFile {
  blob: Blob;
  filename: string;
  mimeType: string;
}

export interface AndroidExportOptions {
  shareOnMobile?: boolean;
}
