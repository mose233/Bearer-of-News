export function createMusicPreview(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeMusicPreview(preview: string) {
  if (!preview) return;

  try {
    URL.revokeObjectURL(preview);
  } catch {
    // Ignore invalid URLs.
  }
}

export function stopAudio(audio: HTMLAudioElement | null) {
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;
}
