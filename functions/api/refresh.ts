const client_id = "2b0ff51518114cf89178f38905b05dfc";
const client_secret = "26d51b3f2950451998c7454e316851fe";

export const main = async (argumentJson) => {
  const requestURL = argumentJson["requestUrl"];
  const params = new URLSearchParams(requestURL.split("?")[1]);

  const refresh_token = params.get("token");

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
      Authorization: "Basic " + btoa(`${client_id}:${client_secret}`),
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
  const authDataString =
    "spotifyTokenData=" +
    JSON.stringify({
      ...authData,
      timeOfLastRefresh: new Date().toUTCString(),
    });

  return {
    statusCode: 200,
    headers: {
      "set-cookie": authDataString,
    },
    body: "",
  };
};
