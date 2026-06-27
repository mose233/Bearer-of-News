import { supportsNativeShare } from "../DeviceManager";

export async function shareFile(
  blob: Blob,
  filename: string
): Promise<boolean> {
  if (!supportsNativeShare()) {
    return false;
  }

  try {
    const file = new File([blob], filename, {
      type: blob.type,
    });

    // @ts-ignore
    if (
      navigator.canShare &&
      // @ts-ignore
      !navigator.canShare({ files: [file] })
    ) {
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
