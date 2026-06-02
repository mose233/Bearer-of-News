declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const FACEBOOK_APP_ID = "3796273373998643";
const FACEBOOK_SDK_ID = "facebook-jssdk";
const FACEBOOK_VERSION = "v20.0";

export type FacebookPage = {
  id: string;
  name: string;
  access_token?: string;
  category?: string;
};

export type FacebookPublishResult = {
  id?: string;
  post_id?: string;
  success?: boolean;
};
export async function publishPhotoFileToFacebookPage({
  pageId,
  pageAccessToken,
  imageFile,
  caption,
}: {
  pageId: string;
  pageAccessToken: string;
  imageFile: File;
  caption?: string;
}): Promise<FacebookPublishResult> {
  const formData = new FormData();

  formData.append("source", imageFile);
  formData.append("message", caption || "");
  formData.append("access_token", pageAccessToken);

  const response = await fetch(
    `https://graph.facebook.com/${FACEBOOK_VERSION}/${pageId}/photos`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Failed to publish photo.");
  }

  return data;
}

export async function publishVideoFileToFacebookPage({
  pageId,
  pageAccessToken,
  videoFile,
  caption,
}: {
  pageId: string;
  pageAccessToken: string;
  videoFile: File;
  caption?: string;
}): Promise<FacebookPublishResult> {
  const formData = new FormData();

  formData.append("source", videoFile);
  formData.append("description", caption || "");
  formData.append("access_token", pageAccessToken);

  const response = await fetch(
    `https://graph.facebook.com/${FACEBOOK_VERSION}/${pageId}/videos`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Failed to publish video.");
  }

  return data;
}

export async function loadFacebookSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.FB && typeof window.FB.login === "function") {
      resolve();
      return;
    }

    window.fbAsyncInit = () => {
      if (!window.FB) {
        reject(new Error("Facebook SDK loaded but FB object is missing."));
        return;
      }

      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: FACEBOOK_VERSION,
      });

      resolve();
    };

    const existingScript = document.getElementById(FACEBOOK_SDK_ID);

    if (existingScript) {
      const waitForFb = setInterval(() => {
        if (window.FB && typeof window.FB.login === "function") {
          clearInterval(waitForFb);
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(waitForFb);
        reject(new Error("Facebook SDK did not become ready."));
      }, 10000);

      return;
    }

    const script = document.createElement("script");
    script.id = FACEBOOK_SDK_ID;
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      reject(new Error("Failed to load Facebook SDK."));
    };

    document.body.appendChild(script);
  });
}

export async function loginWithFacebookPages() {
  await loadFacebookSdk();

  return new Promise<{
    accessToken: string;
    userID: string;
  }>((resolve, reject) => {
    if (!window.FB || typeof window.FB.login !== "function") {
      reject(new Error("Facebook login is not available. Please refresh and try again."));
      return;
    }

    window.FB.login(
      (response: any) => {
        if (!response?.authResponse?.accessToken) {
          reject(new Error("Facebook login cancelled or permissions denied."));
          return;
        }

        resolve({
          accessToken: response.authResponse.accessToken,
          userID: response.authResponse.userID,
        });
      },
      {
        scope:
          "email,public_profile,pages_show_list,pages_read_engagement,pages_manage_posts",
        return_scopes: true,
        auth_type: "rerequest",
      }
    );
  });
}

export async function getFacebookPages(
  accessToken: string
): Promise<FacebookPage[]> {
  const response = await fetch(
    `https://graph.facebook.com/${FACEBOOK_VERSION}/me/accounts?fields=id,name,category,access_token&access_token=${encodeURIComponent(
      accessToken
    )}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Unable to load Facebook Pages.");
  }

  return data.data || [];
}

export async function publishPhotoToFacebookPage({
  pageId,
  pageAccessToken,
  imageUrl,
  caption,
}: {
  pageId: string;
  pageAccessToken: string;
  imageUrl: string;
  caption?: string;
}): Promise<FacebookPublishResult> {
  if (!pageId) throw new Error("Missing Facebook Page ID.");
  if (!pageAccessToken) throw new Error("Missing Facebook Page access token.");

  if (!imageUrl || !imageUrl.startsWith("https://")) {
    throw new Error("Facebook requires a public HTTPS image URL.");
  }

  const response = await fetch(
    `https://graph.facebook.com/${FACEBOOK_VERSION}/${pageId}/photos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: imageUrl,
        message: caption || "",
        access_token: pageAccessToken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Failed to publish photo.");
  }

  return data;
}

export async function publishVideoToFacebookPage({
  pageId,
  pageAccessToken,
  videoUrl,
  caption,
}: {
  pageId: string;
  pageAccessToken: string;
  videoUrl: string;
  caption?: string;
}): Promise<FacebookPublishResult> {
  if (!pageId) throw new Error("Missing Facebook Page ID.");
  if (!pageAccessToken) throw new Error("Missing Facebook Page access token.");

  if (!videoUrl || !videoUrl.startsWith("https://")) {
    throw new Error("Facebook requires a public HTTPS video URL.");
  }

  const response = await fetch(
    `https://graph.facebook.com/${FACEBOOK_VERSION}/${pageId}/videos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_url: videoUrl,
        description: caption || "",
        access_token: pageAccessToken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Failed to publish video.");
  }

  return data;
}
