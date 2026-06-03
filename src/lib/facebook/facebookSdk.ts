declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const FACEBOOK_APP_ID = "3796273373998643";
const FACEBOOK_SDK_ID = "facebook-jssdk";
const FACEBOOK_VERSION = "v20.0";

const FACEBOOK_PAGE_SCOPES =
  "email,public_profile,pages_show_list,pages_read_engagement,pages_manage_posts";

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

export async function loadFacebookSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.FB?.login) {
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
        xfbml: false,
        version: FACEBOOK_VERSION,
      });

      resolve();
    };

    if (document.getElementById(FACEBOOK_SDK_ID)) {
      const timer = window.setInterval(() => {
        if (window.FB?.login) {
          window.clearInterval(timer);
          resolve();
        }
      }, 100);

      window.setTimeout(() => {
        window.clearInterval(timer);
        reject(new Error("Facebook SDK did not become ready."));
      }, 10000);

      return;
    }

    const script = document.createElement("script");
    script.id = FACEBOOK_SDK_ID;
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Failed to load Facebook SDK."));
    document.body.appendChild(script);
  });
}

export async function loginWithFacebookPages(): Promise<{
  accessToken: string;
  userID: string;
}> {
  await loadFacebookSdk();

  return new Promise((resolve, reject) => {
    if (!window.FB?.login) {
      reject(new Error("Facebook login is not available."));
      return;
    }

    window.FB.login(
      (response: any) => {
        if (!response?.authResponse?.accessToken) {
          console.error("Facebook login response:", response);
          reject(
            new Error(
              "Facebook login failed or Page permissions were not approved."
            )
          );
          return;
        }

        resolve({
          accessToken: response.authResponse.accessToken,
          userID: response.authResponse.userID,
        });
      },
      {
        scope: FACEBOOK_PAGE_SCOPES,
        return_scopes: true,
        auth_type: "rerequest",
      }
    );
  });
}

export async function getFacebookPages(
  accessToken: string
): Promise<FacebookPage[]> {
  const url = new URL(
    `https://graph.facebook.com/${FACEBOOK_VERSION}/me/accounts`
  );

  url.searchParams.set("fields", "id,name,category,access_token");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Unable to load Facebook Pages.");
  }

  return data.data || [];
}

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
  formData.append("published", "true");
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
  formData.append("published", "true");
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
