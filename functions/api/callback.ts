// import * as UrlLib from "https://deno.land/std/node/url.ts";

export const main = async (argumentJson) => {
  const requestURL = argumentJson["requestUrl"];
  const parsedUrl = new URL(requestURL);
  const code = parsedUrl.searchParams.get("code");
  const state = parsedUrl.searchParams.get("state");

  // const purl = UrlLib.parse(requestURL);
  // const redirect_uri = `${purl.protocol}//${purl.host}/callback`;

  if (state === null) {
    return {
      statusCode: 400,
      body: "Line 15",
    };
  } else if (code === null) {
    return {
      statusCode: 400,
      body: "Line 20",
    };
  } else {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: "https://adoringly-alive-calf.pgsdemo.com/callback",
        grant_type: "authorization_code",
      },
      headers: {
        // replace with env vars
        Authorization:
          "Basic " +
          btoa(
            `2b0ff51518114cf89178f38905b05dfc:26d51b3f2950451998c7454e316851fe`
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

    const authData = await authResponse.json();
    const authDataString = JSON.stringify(authData);
    const redirectUrlStr = `${state}?tokenData=${authDataString}`;

    return {
      statusCode: 302,
      headers: {
        Location: redirectUrlStr,
      },
      body: "",
    };
  }
};
