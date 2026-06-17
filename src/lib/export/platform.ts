export type Platform = {
  isBrowser: boolean;

  isChrome: boolean;
  isEdge: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isSamsungInternet: boolean;

  isIOS: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  isMac: boolean;
  isLinux: boolean;

  supportsDownloadAttribute: boolean;
  supportsBlob: boolean;
  supportsObjectURL: boolean;
  supportsFileSaver: boolean;

  prefersOpenInNewTab: boolean;
};

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1);

  const isAndroid = /Android/i.test(ua);

  const isSafari =
    /^((?!chrome|android).)*safari/i.test(ua);

  const isChrome =
    /Chrome/i.test(ua) &&
    !/Edg/i.test(ua);

  const isEdge = /Edg/i.test(ua);

  const isFirefox = /Firefox/i.test(ua);

  const isSamsungInternet =
    /SamsungBrowser/i.test(ua);

  const supportsDownloadAttribute =
    "download" in document.createElement("a");

  const supportsBlob =
    typeof Blob !== "undefined";

  const supportsObjectURL =
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function";

  return {
    isBrowser: true,

    isChrome,
    isEdge,
    isFirefox,
    isSafari,
    isSamsungInternet,

    isIOS,
    isAndroid,

    isWindows: /Win/i.test(ua),
    isMac: /Mac/i.test(ua),
    isLinux: /Linux/i.test(ua),

    supportsDownloadAttribute,
    supportsBlob,
    supportsObjectURL,

    supportsFileSaver: true,

    // iOS Safari downloads are more reliable
    // when opening in a new tab.
    prefersOpenInNewTab:
      isIOS || isSafari,
  };
}
