declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const FACEBOOK_APP_ID = "3796273373998643";
const FACEBOOK_SDK_ID = "facebook-jssdk";

export type FacebookPage = {
  id: string;
  name: string;
  access_token?: string;
  category?: string;
};

export async function loadFacebookSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      resolve();
      return;
    }

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });

      resolve();
    };

    const existing = document.getElementById(FACEBOOK_SDK_ID);

    if (existing) {
      return;
    }

    const script = document.createElement("script");
    script.id = FACEBOOK_SDK_ID;
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      reject(new Error("Failed to load Facebook SDK"));
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
    if (!window.FB) {
      reject(new Error("Facebook SDK not loaded"));
      return;
    }

    window.FB.login(
      (response: any) => {
        if (!response?.authResponse?.accessToken) {
          reject(
            new Error(
              "Facebook login cancelled or permissions denied"
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
    `https://graph.facebook.com/v20.0/me/accounts?fields=id,name,category,access_token&access_token=${encodeURIComponent(
      accessToken
    )}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        "Unable to load Facebook Pages"
    );
  }

  return data.data || [];
}
