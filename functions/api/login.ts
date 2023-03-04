// import * as UrlLib from "https://deno.land/std/node/url.ts";
const client_id = "2b0ff51518114cf89178f38905b05dfc";
const scopes = ["user-read-private", "user-read-email", "user-library-read"];

export const main = (argumentJson) => {
  const requestURL = argumentJson["requestUrl"];
  // requestURL is in the form /login?state=https://adoringly-alive-calf.pgsdemo.com/concerts/5852338. get the state param
  const urlParams = new URLSearchParams(requestURL);

  const spotifyUrl = new URL(`https://accounts.spotify.com/authorize`);

  const redirect_uri = "https://adoringly-alive-calf.pgsdemo.com/callback";
  // if (argumentJson["headers"]["X-Forwarded-Host"]) {
  //   redirect_uri = `https://${argumentJson["headers"]["X-Bot-Score"]}/callback`;
  // }

  let state = urlParams.get("state");
  if (!state) {
    state = "https://adoringly-alive-calf.pgsdemo.com/concerts/5852338";
  }

  spotifyUrl.searchParams.append("client_id", client_id);
  spotifyUrl.searchParams.append("response_type", "code");
  // TODO: replace with prod url
  spotifyUrl.searchParams.append("redirect_uri", redirect_uri);
  spotifyUrl.searchParams.append("scope", scopes.join(" "));
  spotifyUrl.searchParams.append("state", state);

  // return {
  //   statusCode: 302,
  //   headers: {
  //     Location: spotifyUrl.toString(),
  //   },
  //   body: "",
  // };
  // const argumentJsonToString = JSON.stringify(argumentJson);
  // const url = argumentJson["requestUrl"];
  // const userAgent = argumentJson["userAgent"];
  // let botscore = 0;
  // if (argumentJson["headers"]["X-Bot-Score"]) {
  //   botscore = argumentJson["headers"]["X-Bot-Score"];
  // }
  return {
    "body": `
        <!DOCTYPE html>
            <html lang="en">
            <head>
            </head>
            <body>
                <div style="margin: auto; width:50%; border: 3px solid green; padding: 10px">
                    <body>
                      <div>URL Params: ${urlParams.toString()}</div>
                    </body>
                </div>
            </body>
            </html>
        `,
    "statusCode": 200,
    "headers": {
      "Cache-control": "no-store",
      "X-Yext-Test": "Example header",
    },
  };
};

// <h1>API!</h1>
// <div>Argument JSON: ${argumentJsonToString}</div>
// <div>Request URL: ${url}</div>
// <div>User Agent: ${userAgent}</div>
// <div>Bot Score: ${botscore}</div>
