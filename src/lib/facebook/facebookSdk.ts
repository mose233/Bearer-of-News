const FACEBOOK_APP_ID = "3796273373998643";
const FACEBOOK_VERSION = "v20.0";
const FACEBOOK_REDIRECT_URI = "https://xnewsapp.com/facebook-callback";

const FACEBOOK_SCOPES =
  "public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts";

export type FacebookPage = {
  id: string;
  name: string;
  access_token?: string;
  category?: string;
  tasks?: string[];
};

export type FacebookConnection = {
  accessToken: string;
  pages: FacebookPage[];
};

export type FacebookPublishResult = {
  id?: string;
  post_id?: string;
  success?: boolean;
};

function getFacebookError(data: any, fallback: string) {
  return data?.error?.error_user_msg || data?.error?.message || fallback;
}

export function startFacebookOAuthLogin() {
  const state = crypto.randomUUID();

  sessionStorage.setItem("facebook_oauth_state", state);

  const url = new URL(
    `https://www.facebook.com/${FACEBOOK_VERSION}/dialog/oauth`
  );

  url.searchParams.set("client_id", FACEBOOK_APP_ID);
  url.searchParams.set("redirect_uri", FACEBOOK_REDIRECT_URI);
  url.searchParams.set("state", state);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", FACEBOOK_SCOPES);

  window.location.href = url.toString();
}

export function getSavedFacebookConnection(): FacebookConnection | null {
  const accessToken = localStorage.getItem("facebook_user_access_token");
  const savedPages = localStorage.getItem("facebook_pages");

  if (!accessToken || !savedPages) {
    return null;
  }

  try {
    const pages = JSON.parse(savedPages);

    if (!Array.isArray(pages)) {
      return null;
    }

    return {
      accessToken,
      pages,
    };
  } catch {
    clearFacebookConnection();
    return null;
  }
}

export function clearFacebookConnection() {
  localStorage.removeItem("facebook_user_access_token");
  localStorage.removeItem("facebook_pages");
  sessionStorage.removeItem("facebook_oauth_state");
}

export async function loginWithFacebookPages(): Promise<{
  accessToken: string;
  userID: string;
}> {
  const connection = getSavedFacebookConnection();

  if (connection?.accessToken) {
    return {
      accessToken: connection.accessToken,
      userID: "facebook-user",
    };
  }

  throw new Error(
    "Please connect your Facebook Page first before publishing."
  );
}

export async function getFacebookPages(
  accessToken: string
): Promise<FacebookPage[]> {
  const connection = getSavedFacebookConnection();

  if (connection?.pages?.length) {
    return connection.pages;
  }

  const url = new URL(
    `https://graph.facebook.com/${FACEBOOK_VERSION}/me/accounts`
  );

  url.searchParams.set("fields", "id,name,category,access_token,tasks");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    throw new Error(getFacebookError(data, "Unable to load Facebook Pages."));
  }

  const pages = Array.isArray(data?.data) ? data.data : [];

  localStorage.setItem("facebook_pages", JSON.stringify(pages));

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

  if (!response.ok) {
    throw new Error(getFacebookError(data, "Failed to publish video."));
  }

  return data;
}
