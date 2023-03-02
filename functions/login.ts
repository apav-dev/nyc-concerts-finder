const client_id = "2b0ff51518114cf89178f38905b05dfc";
const scopes = ["user-read-private", "user-read-email", "user-library-read"];

export const main = (argumentJson) => {
  const requestURL = argumentJson["requestUrl"];
  const urlParams = new URLSearchParams(requestURL);
  const spotifyUrl = new URL(`https://accounts.spotify.com/authorize`);

  console.log("requestURL", requestURL);
  console.log("urlParams", urlParams);

  let state = urlParams.get("state");
  if (!state) {
    // TODO: replace with prod url
    state = "";
  }

  spotifyUrl.searchParams.append("client_id", client_id);
  spotifyUrl.searchParams.append("response_type", "code");
  // TODO: replace with prod url
  spotifyUrl.searchParams.append(
    "redirect_uri",
    "http://localhost:8000/callback"
  );
  spotifyUrl.searchParams.append("scope", scopes.join(" "));
  spotifyUrl.searchParams.append("state", state);

  //return redirect to the spotify url
  return {
    statusCode: 302,
    headers: {
      Location: spotifyUrl,
    },
    body: "",
  };
};
