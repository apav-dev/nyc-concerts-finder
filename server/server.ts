/* eslint-disable no-var */
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application();
const router = new Router();

const client_id = "2b0ff51518114cf89178f38905b05dfc";
const client_secret = "26d51b3f2950451998c7454e316851fe";
const redirect_uri = "http://localhost:8000/callback";
const scopes = ["user-read-private", "user-read-email", "user-library-read"];

router.get("/login", (ctx) => {
  let state = ctx.request.url.searchParams.get("state");

  const url = new URL(`https://accounts.spotify.com/authorize`);

  if (state === null) {
    state = "http://localhost:5173";
  }

  url.searchParams.append("client_id", client_id);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("redirect_uri", redirect_uri);
  url.searchParams.append("scope", scopes.join(" "));
  url.searchParams.append("state", state);

  ctx.response.redirect(url);
});

router.get("/callback", async (ctx) => {
  const code = ctx.request.url.searchParams.get("code");
  const state = ctx.request.url.searchParams.get("state");

  if (state === null) {
    ctx.response.status = 400;
    ctx.response.body = "Invalid state";
    return;
  } else if (code === null) {
    ctx.response.status = 400;
    ctx.response.body = "Access denied";
    return;
  } else {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
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
    const authDataString = JSON.stringify(authData);

    ctx.response.redirect(state + "?tokenData=" + authDataString);
  }
});

// Define your 404 route
// app.use((ctx) => {
//   ctx.response.status = 404;
//   ctx.response.body = "Not found";
// });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
