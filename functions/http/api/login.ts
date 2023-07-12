const scopes = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "streaming",
  "user-read-playback-state",
];

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

export default function login(request) {
  const { queryParams } = request;

  const spotifyUrl = new URL(`https://accounts.spotify.com/authorize`);

  // TODO: adjust for production and for when functions run at 5173
  const redirect_uri = `http://localhost:8000/api/callback`;

  let state = queryParams.state;
  if (!state) {
    state = "state not found";
  }

  spotifyUrl.searchParams.append("client_id", YEXT_PUBLIC_SPOTIFY_CLIENT_ID);
  spotifyUrl.searchParams.append("response_type", "code");
  spotifyUrl.searchParams.append("redirect_uri", redirect_uri);
  spotifyUrl.searchParams.append("scope", scopes.join(" "));
  spotifyUrl.searchParams.append("state", state);

  return new Response(
    JSON.stringify({ spotifyUrl }),
    {
      Location: spotifyUrl.toString(),
    },
    302
  );
}
