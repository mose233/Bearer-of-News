import { ImagePreviewItem } from "./videoExport";

export interface TimelineState {
  mediaFiles: File[];
  mediaPreviews: string[];
  sceneDurations: number[];
  currentIndex: number;
}

export function addScene(
  state: TimelineState,
  file: File,
  preview: string,
  duration: number
): TimelineState {
  return {
    mediaFiles: [...state.mediaFiles, file],
    mediaPreviews: [...state.mediaPreviews, preview],
    sceneDurations: [...state.sceneDurations, duration],
    currentIndex: state.mediaFiles.length,
  };
}

export function deleteScene(
  state: TimelineState,
  index: number
): TimelineState {
  return {
    mediaFiles: state.mediaFiles.filter((_, i) => i !== index),

    mediaPreviews: state.mediaPreviews.filter((_, i) => i !== index),

    sceneDurations: state.sceneDurations.filter((_, i) => i !== index),

    currentIndex:
      state.mediaFiles.length <= 1
        ? 0
        : Math.min(
            state.currentIndex,
            state.mediaFiles.length - 2
          ),
  };
}

export function duplicateScene(
  state: TimelineState,
  index: number
): TimelineState {
  const file = state.mediaFiles[index];
  const preview = state.mediaPreviews[index];
  const duration = state.sceneDurations[index];

  return {
    mediaFiles: [
      ...state.mediaFiles.slice(0, index + 1),
      file,
      ...state.mediaFiles.slice(index + 1),
    ],

    mediaPreviews: [
      ...state.mediaPreviews.slice(0, index + 1),
      preview,
      ...state.mediaPreviews.slice(index + 1),
    ],

    sceneDurations: [
      ...state.sceneDurations.slice(0, index + 1),
      duration,
      ...state.sceneDurations.slice(index + 1),
    ],

    currentIndex: index + 1,
  };
}

export function updateSceneDuration(
  state: TimelineState,
  index: number,
  duration: number
): TimelineState {
  const next = [...state.sceneDurations];

  next[index] = Math.min(
    Math.max(duration, 1),
    60
  );

  return {
    ...state,
    sceneDurations: next,
  };
}

export function buildImagePreviewItems(
  mediaFiles: File[],
  mediaPreviews: string[]
): ImagePreviewItem[] {
  return mediaFiles
    .map((file, index) => ({
      file,
      preview: mediaPreviews[index],
    }))
    .filter((item) => item.file.type.startsWith("image/"));
}
