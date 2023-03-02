import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getRandomString } from "./utils.ts";
import { serve } from "https://deno.land/std@0.178.0/http/server.ts";

const app = new Application();
const router = new Router();

const client_id = "2b0ff51518114cf89178f38905b05dfc";
const redirect_uri = "http://localhost:8000/callback";
const state = getRandomString(16);
const scopes = ["user-read-private", "user-read-email", "user-library-read"];

router.get("/login", (ctx) => {
  const url = new URL(`https://accounts.spotify.com/authorize`);
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

    ctx.response.body = authData;
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
