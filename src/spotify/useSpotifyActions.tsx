import { useContext } from "react";
import { SpotifyTrack } from "../types/spotify";
import {
  SpotifyActionTypes,
  SpotifyContext,
  SpotifyState,
} from "./SpotifyProvider";
import { getTopTracks, refreshAuthToken } from "../api/spotify";
import { fetch } from "@yext/pages/util";

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
    checkAndRefreshToken();

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

    // go through each artist track and fetch the waveform for each track
    const artistTracksWithWaveform = await Promise.all(
      artistIds.map((artistId) =>
        Promise.all(
          artistTracksMap[artistId].map(async (track) => {
            const waveformResponse = await fetch(
              `http://localhost:8000/waveform/${track.id}?token=${authData?.access_token}`
            );
            const waveform = await waveformResponse.json();
            return { ...track, waveform };
          })
        )
      )
    );

    // update the artistTracksMap with the waveform
    artistIds.forEach((artistId, idx) => {
      artistTracksMap[artistId] = artistTracksWithWaveform[idx];
    });

    // dispatch the action to update the artistTracks in the spotifyState
    dispatch({
      type: SpotifyActionTypes.SetArtistTracks,
      payload: artistTracksMap,
    });
  };

  const checkAndRefreshToken = async () => {
    const { authData } = spotifyState;

    if (!authData?.timeOfLastRefresh) {
      console.warn("No timeOfLastRefresh in authState");
      return;
    }

    const timeSinceLastRefresh =
      new Date().getTime() - new Date(authData.timeOfLastRefresh).getTime();

    console.log(timeSinceLastRefresh, authData.expires_in * 1000);

    if (timeSinceLastRefresh > authData.expires_in * 1000) {
      console.log("refreshing token");
      // refresh token

      const refreshedAuthData = await refreshAuthToken(authData.refresh_token);
      if (refreshedAuthData) {
        const timeOfLastRefresh = new Date().toUTCString();
        localStorage.setItem(
          "authData",
          JSON.stringify({
            ...refreshedAuthData,
            timeOfLastRefresh,
          })
        );
        setSpotifyAuth({
          ...spotifyState,
          authData: {
            ...refreshedAuthData,
            timeOfLastRefresh,
          },
        });
      }
    }
  };

  return {
    setSpotifyAuth,
    setServerUrl,
    setSelectedTrack,
    fetchTracksForArtists,
  };
};
