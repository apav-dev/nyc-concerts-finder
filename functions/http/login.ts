const client_id = "2b0ff51518114cf89178f38905b05dfc";
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "streaming",
  "user-read-playback-state",
];

export const main = (argumentJson) => {
  const requestURL = argumentJson["requestUrl"];
  const params = new URLSearchParams(requestURL.split("?")[1]);

  const spotifyUrl = new URL(`https://accounts.spotify.com/authorize`);

  const forwardedProto = argumentJson["headers"]["X-Forwarded-Proto"][0];
  const forwardedHost = argumentJson["headers"]["X-Forwarded-Host"][0];

  const redirect_uri = `${forwardedProto}://${forwardedHost}/callback`;

  let state = params.get("state");
  if (!state) {
    state = "state not found";
  }

  spotifyUrl.searchParams.append("client_id", client_id);
  spotifyUrl.searchParams.append("response_type", "code");
  spotifyUrl.searchParams.append("redirect_uri", redirect_uri);
  spotifyUrl.searchParams.append("scope", scopes.join(" "));
  spotifyUrl.searchParams.append("state", state);

  return {
    statusCode: 302,
    headers: {
      Location: spotifyUrl.toString(),
    },
    body: "",
  };
};
