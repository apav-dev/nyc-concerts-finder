// TODO: remove this file and replace with calls in useSpotifyActions
import { SpotifyTrack } from "../types/spotify";
import { fetch } from "@yext/pages/util";
import { SpotifyAuth } from "../types/auth";

export const getTopTracks = async (
  accessToken: string,
  artistId: string
): Promise<SpotifyTrack[]> => {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  return data.tracks;
};

export const playTrack = (
  accessToken: string,
  deviceId: string,
  trackUri: string,
  position: number
) => {
  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    body: JSON.stringify({ uris: [trackUri], position_ms: position }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const refreshAuthToken = async (
  refreshToken?: string
): Promise<SpotifyAuth | undefined> => {
  if (!refreshToken) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8000/refresh?refresh_token=${refreshToken}`
    );
    const data = await response.json();
    return data as SpotifyAuth;
  } catch (e) {
    console.log(e);
  }
};
