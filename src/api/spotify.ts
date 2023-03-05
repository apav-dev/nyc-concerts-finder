import { SpotifyTrack } from "../types/spotify";

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
