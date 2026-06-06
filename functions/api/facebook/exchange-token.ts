
They were copied into the `.ts` file. TypeScript cannot compile them.

Replace the **whole** `functions/api/facebook/exchange-token.ts` with this clean version — no backticks except inside the URL template strings:

```ts
const FACEBOOK_VERSION = "v20.0";
const FALLBACK_REDIRECT_URI = "https://xnewsapp.com/facebook-callback";

function getAbsoluteRedirectUri(context: any) {
  const fromEnv = String(context?.env?.FACEBOOK_REDIRECT_URI || "").trim();

  if (fromEnv.startsWith("https://")) {
    return fromEnv;
  }

  return FALLBACK_REDIRECT_URI;
}

export async function onRequestPost(context: any) {
  try {
    const { code } = await context.request.json();

    if (!code) {
      return Response.json(
        { error: "Missing Facebook code." },
        { status: 400 }
      );
    }

    const envKeys = context?.env ? Object.keys(context.env) : [];

    const appId = String(context?.env?.FACEBOOK_APP_ID || "").trim();
    const appSecret = String(context?.env?.FACEBOOK_APP_SECRET || "").trim();
    const redirectUri = getAbsoluteRedirectUri(context);

    if (!appId) {
      return Response.json(
        {
          error: "Missing FACEBOOK_APP_ID.",
          debug: {
            hasEnv: !!context?.env,
            availableKeys: envKeys,
            redirectUriDetected: redirectUri,
          },
        },
        { status: 500 }
      );
    }

    if (!appSecret) {
      return Response.json(
        {
          error: "Missing FACEBOOK_APP_SECRET.",
          debug: {
            hasEnv: !!context?.env,
            availableKeys: envKeys,
          },
        },
        { status: 500 }
      );
    }

    const tokenUrl = new URL(
      `https://graph.facebook.com/${FACEBOOK_VERSION}/oauth/access_token`
    );

    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenResponse = await fetch(tokenUrl.toString());
    const tokenData: any = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return Response.json(
        {
          error:
            tokenData?.error?.message || "Failed to exchange Facebook code.",
          redirectUriUsed: redirectUri,
          raw: tokenData,
        },
        { status: 400 }
      );
    }

    const pagesUrl = new URL(
      `https://graph.facebook.com/${FACEBOOK_VERSION}/me/accounts`
    );

    pagesUrl.searchParams.set(
      "fields",
      "id,name,category,access_token,tasks"
    );
    pagesUrl.searchParams.set("access_token", tokenData.access_token);

    const pagesResponse = await fetch(pagesUrl.toString());
    const pagesData: any = await pagesResponse.json();

    if (!pagesResponse.ok) {
      return Response.json(
        {
          error:
            pagesData?.error?.message || "Failed to load Facebook Pages.",
          raw: pagesData,
        },
        { status: 400 }
      );
    }

    return Response.json({
      userAccessToken: tokenData.access_token,
      pages: pagesData.data || [],
      redirectUriUsed: redirectUri,
      debug: {
        availableKeys: envKeys,
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        error: error?.message || "Facebook token exchange failed.",
      },
      { status: 500 }
    );
  }
}
