export const main = async (argumentJson) => {
  const requestURL = argumentJson["requestUrl"];
  const searchParams = new URLSearchParams();
  requestURL
    .split("?")[1]
    .split("&")
    .forEach((pair) => {
      const [key, value] = pair.split("=");
      searchParams.append(key, value);
    });
  const state = searchParams.get("state");
  const code = searchParams.get("code");

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
        redirect_uri: "https://adoringly-alive-calf.pgsdemo.com/callback",
        grant_type: "authorization_code",
      },
      headers: {
        // replace with env vars
        Authorization:
          "Basic " +
          btoa(
            // TODO: hide this data
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
