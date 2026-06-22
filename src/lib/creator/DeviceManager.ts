export type DeviceType = "android" | "ios" | "desktop";

export function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") {
    return "desktop";
  }

  const ua = navigator.userAgent.toLowerCase();

  if (/android/.test(ua)) {
    return "android";
  }

  if (/iphone|ipad|ipod/.test(ua)) {
    return "ios";
  }

  return "desktop";
}

export const isAndroid = () => getDeviceType() === "android";

export const isIOS = () => getDeviceType() === "ios";

export const isDesktop = () => getDeviceType() === "desktop";

export function supportsNativeShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

export function supportsFileSystemDownload(): boolean {
  return typeof window !== "undefined";
}
