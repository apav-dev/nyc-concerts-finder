import { useContext } from "react";
import { SpotifyTrack } from "../types/spotify";
import {
  SpotifyActionTypes,
  SpotifyContext,
  SpotifyState,
} from "./SpotifyProvider";
import { getTopTracks } from "../api/spotify";

export const useSpotifyActions = () => {
  const { dispatch, spotifyState } = useContext(SpotifyContext);

  const setSpotifyAuth = (payload: SpotifyState) => {
    return dispatch({ type: SpotifyActionTypes.SetSpotifyAuth, payload });
  };

  const setServerUrl = (payload: string) => {
    return dispatch({ type: SpotifyActionTypes.SetServerUrl, payload });
  };

  const setSelectedTrack = (payload: SpotifyTrack) => {
    return dispatch({ type: SpotifyActionTypes.SetSelectedTrack, payload });
  };

  const fetchTracksForArtists = async (artistIds: string[]) => {
    const { authData } = spotifyState;

    // use Promise.all to fetch all tracks for all artists using the getTopTracks api
    const artistTracks = await Promise.all(
      artistIds.map((artistId) =>
        getTopTracks(authData?.access_token || "", artistId.split(":")[2] || "")
      )
    );

    // create a map of artistId: SpotifyTrack[]
    const artistTracksMap = artistIds.reduce((acc, artistId, idx) => {
      acc[artistId] = artistTracks[idx];
      return acc;
    }, {} as Record<string, SpotifyTrack[]>);

    // dispatch the action to update the artistTracks in the spotifyState
    dispatch({
      type: SpotifyActionTypes.SetArtistTracks,
      payload: artistTracksMap,
    });
  };

  return {
    setSpotifyAuth,
    setServerUrl,
    setSelectedTrack,
    fetchTracksForArtists,
  };
};
