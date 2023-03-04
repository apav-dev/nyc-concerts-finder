const client_id = "2b0ff51518114cf89178f38905b05dfc";
const scopes = ["user-read-private", "user-read-email", "user-library-read"];

export const main = (argumentJson) => {
  const requestURL = argumentJson["requestUrl"];
  const params = new URLSearchParams(requestURL.split("?")[1]);
  // can a url in the form /login?state=1234 be used with new URLSearchParams?
  // const urlParams = new URLSearchParams("/login?state=1234");

  const spotifyUrl = new URL(`https://accounts.spotify.com/authorize`);

  let redirect_uri = "https://adoringly-alive-calf.pgsdemo.com/callback";
  if (argumentJson["headers"]["X-Forwarded-Host"]) {
    redirect_uri = `https://${argumentJson["headers"]["X-Bot-Score"]}/callback`;
  }

  let state = params.get("state");
  if (!state) {
    state = "state not found";
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
  // const argumentJsonToString = JSON.stringify(argumentJson);
  // const url = argumentJson["requestUrl"];
  // const userAgent = argumentJson["userAgent"];
  // let botscore = 0;
  // if (argumentJson["headers"]["X-Bot-Score"]) {
  //   botscore = argumentJson["headers"]["X-Bot-Score"];
  // }
  // return {
  //   "body": `
  //       <!DOCTYPE html>
  //           <html lang="en">
  //           <head>
  //           </head>
  //           <body>
  //               <div style="margin: auto; width:50%; border: 3px solid green; padding: 10px">
  //                   <body>
  //                       <h1>API!</h1>
  //                       <div>Argument JSON: ${urlParams.toString()}</div>
  //                   </body>
  //               </div>
  //           </body>
  //           </html>
  //       `,
  //   "statusCode": 200,
  //   "headers": {
  //     "Cache-control": "no-store",
  //     "X-Yext-Test": "Example header",
  //   },
  // };
};

// <div>Argument JSON: ${argumentJsonToString}</div>
//         <div>Request URL: ${url}</div>
//         <div>User Agent: ${userAgent}</div>
//         <div>Bot Score: ${botscore}</div>
