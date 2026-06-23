export interface UploadedMedia {
  files: File[];
  previews: string[];
  durations: number[];
}

export function createUploadedMedia(
  files: File[],
  duration: number
): UploadedMedia {
  return {
    files,
    previews: files.map((file) => URL.createObjectURL(file)),
    durations: files.map(() => duration),
  };
}

export function revokePreviews(previews: string[]) {
  previews.forEach((url) => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore invalid object URLs.
    }
  });
}
