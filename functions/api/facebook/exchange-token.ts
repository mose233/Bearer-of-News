export async function onRequestPost(context: any) {
  try {
    const { code } = await context.request.json();

    if (!code) {
      return Response.json({ error: "Missing Facebook code." }, { status: 400 });
    }

    const appId = context.env.FACEBOOK_APP_ID;
    const appSecret = context.env.FACEBOOK_APP_SECRET;
    const redirectUri = context.env.FACEBOOK_REDIRECT_URI;

    const tokenUrl = new URL("https://graph.facebook.com/v20.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenResponse = await fetch(tokenUrl.toString());
    const tokenData: any = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return Response.json(
        { error: tokenData?.error?.message || "Failed to exchange Facebook code.", raw: tokenData },
        { status: 400 }
      );
    }

    const pagesUrl = new URL("https://graph.facebook.com/v20.0/me/accounts");
    pagesUrl.searchParams.set("fields", "id,name,category,access_token,tasks");
    pagesUrl.searchParams.set("access_token", tokenData.access_token);

    const pagesResponse = await fetch(pagesUrl.toString());
    const pagesData: any = await pagesResponse.json();

    if (!pagesResponse.ok) {
      return Response.json(
        { error: pagesData?.error?.message || "Failed to load Facebook Pages.", raw: pagesData },
        { status: 400 }
      );
    }

    return Response.json({
      userAccessToken: tokenData.access_token,
      pages: pagesData.data || [],
    });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Facebook token exchange failed." },
      { status: 500 }
    );
  }
}
