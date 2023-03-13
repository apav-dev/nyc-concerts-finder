/* eslint-disable no-var */
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { SpotifyAudioAnalysis } from "./types.ts";

const app = new Application();
const router = new Router();

app.use(
  oakCors({
    origin: "http://localhost:5173",
  })
);

const client_id = "2b0ff51518114cf89178f38905b05dfc";
const client_secret = "26d51b3f2950451998c7454e316851fe";
const redirect_uri = "http://localhost:8000/callback";
const scopes = ["user-read-private", "user-read-email", "streaming"];

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

    const cookieOptions = {
      httpOnly: true,
      secure: false, // No HTTPS used for local development
    };
    ctx.cookies.set("tokenData", authDataString, cookieOptions);

    ctx.response.redirect(state + "?tokenData=" + authDataString);
  }
});

router.get("/refresh", async (ctx) => {
  const refresh_token = ctx.request.url.searchParams.get("refresh_token");

  if (refresh_token === null) {
    ctx.response.status = 400;
    ctx.response.body = "Invalid refresh token";
    return;
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
  const authDataString = JSON.stringify(authData);

  const cookieOptions = {
    httpOnly: true,
    secure: false, // No HTTPS used for local development
  };

  ctx.cookies.set("tokenData", authDataString, cookieOptions);

  ctx.response.body = authDataString;
});

// credit: https://medium.com/swlh/creating-waveforms-out-of-spotify-tracks-b22030dd442b
router.get("/waveform/:id", async (ctx) => {
  const id = ctx.params.id;

  if (id === null) {
    ctx.response.status = 400;
    ctx.response.body = "Invalid id";
    return;
  }
  if (ctx.request.url.searchParams.get("token") === null) {
    ctx.response.status = 400;
    ctx.response.body = "Invalid token";
    return;
  }

  const response = await fetch(
    `https://api.spotify.com/v1/audio-analysis/${id}`,
    {
      headers: {
        Authorization: `Bearer ${ctx.request.url.searchParams.get("token")}`,
      },
    }
  );

  const data = (await response.json()) as SpotifyAudioAnalysis;

  if (data.error?.status === 401 && data.error.message) {
    ctx.response.status = 401;
    ctx.response.body = data.error.message;
  } else if (response.ok) {
    const duration = data.track.duration;

    const segments = data.segments.map((segment) => {
      const loudness = segment.loudness_max;

      return {
        start: segment.start / duration,
        duration: segment.duration / duration,
        loudness: 1 - Math.min(Math.max(loudness, -35), 0) / -35,
      };
    });

    const min = Math.min(...segments.map((segment) => segment.loudness));
    const max = Math.max(...segments.map((segment) => segment.loudness));
    const levels = [];
    for (let i = 0.0; i < 1; i += 0.001) {
      const s = segments.find((segment) => {
        return i <= segment.start + segment.duration;
      });
      const loudness = Math.round((s.loudness / max) * 100) / 100;
      levels.push(loudness);
    }

    ctx.response.body = levels;
  } else {
    console.log("Bad Request");
    ctx.response.status = 400;
    ctx.response.body = { message: "Bad Request" };
  }
});

//endpoint that tests if cors is working
router.get("/test", (ctx) => {
  ctx.response.body = "test";
});

// Define your 404 route
// app.use((ctx) => {
//   const cookieOptions = {
//     httpOnly: true,
//     secure: false, // No HTTPS used for local development
//   };
//   ctx.cookies.set("test", "value", cookieOptions);

//   ctx.response.status = 200;
//   ctx.response.body = "Test Endpoint";
// });

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on port 8000");
await app.listen({ port: 8000 });
