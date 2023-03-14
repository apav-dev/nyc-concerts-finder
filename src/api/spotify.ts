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

export const playTrack = async (
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

export const refreshAuthToken = async (refreshToken: string) => {
  await fetch(`http://localhost:8000/refresh?refresh_token=${refreshToken}`);
};

export const seekToPosition = (
  accessToken: string,
  deviceId: string,
  position: number
) => {
  fetch(
    `https://api.spotify.com/v1/me/player/seek?position_ms=${position}&device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
