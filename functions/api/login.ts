// import * as UrlLib from "https://deno.land/std/node/url.ts";
const client_id = "2b0ff51518114cf89178f38905b05dfc";
const scopes = ["user-read-private", "user-read-email", "user-library-read"];

export const main = (argumentJson) => {
  const requestURL = argumentJson["requestUrl"];
  const urlParams = new URLSearchParams(requestURL);
  const spotifyUrl = new URL(`https://accounts.spotify.com/authorize`);

  // const purl = UrlLib.parse(requestURL);
  // const redirect_uri = `${purl.protocol}//${purl.host}/callback`;
  const redirect_uri = "https://adoringly-alive-calf.pgsdemo.com/callback";

  let state = urlParams.get("state");
  if (!state) {
    // TODO: replace with prod url
    state = "test";
  }

  spotifyUrl.searchParams.append("client_id", client_id);
  spotifyUrl.searchParams.append("response_type", "code");
  // TODO: replace with prod url
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
