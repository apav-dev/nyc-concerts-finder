interface SpotifyAuthData {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export default async function callback(request) {
  const { queryParams } = request;

  const state = queryParams.state;
  const code = queryParams.code;

  // TODO: adjust for production and for when functions run at 5173
  const redirect_uri = `http://localhost:8000/api/callback`;

  if (state === null) {
    return {
      statusCode: 400,
      body: "Bad Request: No state provided",
    };
  } else if (code === null) {
    return {
      statusCode: 400,
      body: "Bad Request: No code provided",
    };
  } else {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        // TODO: make this dynamic
        redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          btoa(
            `${YEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${YEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
          ),
      },
      json: true,
    };

    const authResponse = await fetch(authOptions.url, {
      method: "POST",
      body: new URLSearchParams(authOptions.form),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authOptions.headers.Authorization,
      },
    });

    const authData: SpotifyAuthData = await authResponse.json();
    const location = new URL(state);
    // append access_token, refresh_token, and expires_in to the URL as hash params
    location.hash = `access_token=${authData.access_token}&refresh_token=${authData.refresh_token}&expires_in=${authData.expires_in}`;

    return {
      statusCode: 302,
      headers: {
        Location: location.toString(),
      },
      body: "",
    };
  }
}
