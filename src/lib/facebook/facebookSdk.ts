declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const FACEBOOK_APP_ID = "3796273373998643";
const FACEBOOK_SDK_ID = "facebook-jssdk";
const FACEBOOK_VERSION = "v20.0";

const FACEBOOK_SCOPES = "public_profile,email,pages_show_list";

export type FacebookPage = {
  id: string;
  name: string;
  access_token?: string;
  category?: string;
  tasks?: string[];
};

export type FacebookPublishResult = {
  id?: string;
  post_id?: string;
  success?: boolean;
};

function getFacebookError(data: any, fallback: string) {
  return data?.error?.error_user_msg || data?.error?.message || fallback;
}

function showDebug(title: string, data: unknown) {
  console.log(title, data);
  alert(`${title}\n\n${JSON.stringify(data, null, 2)}`);
}

export async function loadFacebookSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.FB?.login && window.FB?.getLoginStatus) {
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
        if (window.FB?.login && window.FB?.getLoginStatus) {
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

function getLoginStatus(): Promise<any> {
  return new Promise((resolve) => {
    window.FB.getLoginStatus((response: any) => resolve(response), true);
  });
}

function loginWithPopup(): Promise<any> {
  return new Promise((resolve) => {
    window.FB.login((response: any) => resolve(response), {
      scope: FACEBOOK_SCOPES,
      return_scopes: true,
    });
  });
}

function getPermissions(): Promise<any> {
  return new Promise((resolve) => {
    window.FB.api("/me/permissions", (response: any) => resolve(response));
  });
}

export async function loginWithFacebookPages(): Promise<{
  accessToken: string;
  userID: string;
}> {
  await loadFacebookSdk();

  const status = await getLoginStatus();
  showDebug("LOGIN STATUS", status);

  if (status?.status === "connected" && status?.authResponse?.accessToken) {
    const permissions = await getPermissions();
    showDebug("PERMISSIONS", permissions);

    return {
      accessToken: status.authResponse.accessToken,
      userID: status.authResponse.userID,
    };
  }

  const loginResponse = await loginWithPopup();
  showDebug("LOGIN RESPONSE", loginResponse);

  if (!loginResponse?.authResponse?.accessToken) {
    throw new Error(
      "Facebook login failed. Please open xnewsapp.com in Chrome, allow popups, and approve Page permissions."
    );
  }

  const permissions = await getPermissions();
  showDebug("PERMISSIONS", permissions);

  return {
    accessToken: loginResponse.authResponse.accessToken,
    userID: loginResponse.authResponse.userID,
  };
}

export async function getFacebookPages(
  accessToken: string
): Promise<FacebookPage[]> {
  const url = new URL(
    `https://graph.facebook.com/${FACEBOOK_VERSION}/me/accounts`
  );

  url.searchParams.set("fields", "id,name,category,access_token,tasks");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  const data = await response.json();

  showDebug("FACEBOOK RESPONSE", data);

  if (!response.ok) {
    throw new Error(getFacebookError(data, "Unable to load Facebook Pages."));
  }

  const pages = Array.isArray(data?.data) ? data.data : [];

  alert(
    `Pages Found: ${pages.length}\n\n` +
      pages.map((p: FacebookPage) => `${p.name} (${p.id})`).join("\n")
  );

  return pages;
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

  showDebug("FACEBOOK PHOTO PUBLISH RESPONSE", data);

  if (!response.ok) {
    throw new Error(getFacebookError(data, "Failed to publish photo."));
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

  showDebug("FACEBOOK VIDEO PUBLISH RESPONSE", data);

  if (!response.ok) {
    throw new Error(getFacebookError(data, "Failed to publish video."));
  }

  return data;
}
