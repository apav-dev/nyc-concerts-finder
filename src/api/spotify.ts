import { SpotifyTrack } from "../types/spotify";
import { fetch } from "@yext/pages/util";

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
  trackUri: string
) => {
  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    body: JSON.stringify({ uris: [trackUri] }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
