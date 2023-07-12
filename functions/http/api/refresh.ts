class Response {
  body: string;
  headers: any;
  statusCode: number;

  constructor(body: string, headers: any, statusCode: number) {
    this.body = body;
    this.headers = headers || {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173",
    };
    this.statusCode = statusCode;
  }
}

interface SpotifyAuthData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export default async function refresh(request) {
  const { queryParams } = request;

  const refresh_token = queryParams.refresh_token;

  if (refresh_token === null) {
    return {
      statusCode: 400,
      body: "Invalid refresh token",
    };
  }

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      refresh_token: refresh_token,
      grant_type: "refresh_token",
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

  if (authData.access_token === undefined) {
    return new Response(JSON.stringify(authData), null, 500);
  }

  return new Response(JSON.stringify(authData), null, 200);
}
