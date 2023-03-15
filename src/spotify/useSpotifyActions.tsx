import { useContext } from "react";
import { SpotifyTrack } from "../types/spotify";
import {
  SpotifyActionTypes,
  SpotifyContext,
  SpotifyState,
  TrackState,
} from "./SpotifyProvider";
import { getTopTracks, refreshAuthToken } from "../api/spotify";
import Cookies from "js-cookie";
import { SpotifyAuth } from "../types/auth";

export const useSpotifyActions = () => {
  const { dispatch, spotifyState } = useContext(SpotifyContext);

  // TODO: use fetch
  const login = () => {
    const originalUrl = window.location.href;
    const baseUrl = new URL(originalUrl).origin;

    if (baseUrl.includes("localhost")) {
      const state = baseUrl + "/" + originalUrl.substring(baseUrl.length + 1);
      const newUrl = new URL(`http://localhost:8000/login`);
      newUrl.searchParams.set("state", state);
      window.location.href = newUrl.href;
    } else {
      const state = originalUrl.substring(baseUrl.length + 1);
      const newUrl = new URL(`${baseUrl}/login`);
      newUrl.searchParams.set("state", state);
      window.location.href = newUrl.href;
    }
  };

  const setSpotifyAuth = (payload: SpotifyState) => {
    return dispatch({ type: SpotifyActionTypes.SetSpotifyAuth, payload });
  };

  const setServerUrl = (payload: string) => {
    return dispatch({ type: SpotifyActionTypes.SetServerUrl, payload });
  };

  const setSelectedTrack = (payload: SpotifyTrack) => {
    return dispatch({ type: SpotifyActionTypes.SetSelectedTrack, payload });
  };

  const fetchArtist = async (artistId: string) => {
    await checkAndRefreshToken();

    const { authData } = spotifyState;

    // fetch the Artist using the spotify get artist api. Use fetch to get the artist
    const artist = await fetch(
      `https://api.spotify.com/v1/artists/${artistId.split(":")[2]}`,
      {
        headers: {
          Authorization: `Bearer ${authData?.access_token}`,
        },
      }
    ).then((res) => res.json());

    dispatch({
      type: SpotifyActionTypes.SetSelectedArtist,
      payload: artist,
    });
  };

  const fetchTracksForArtist = async (artistId: string) => {
    await checkAndRefreshToken();

    const { authData } = spotifyState;

    const artistTracks = await getTopTracks(
      authData?.access_token || "",
      artistId.split(":")[2] || ""
    );

    dispatch({
      type: SpotifyActionTypes.SetTracks,
      payload: artistTracks,
    });
  };

  const fetchArtistAndTracks = async (artistId: string) => {
    dispatch({
      type: SpotifyActionTypes.ToggleArtistDataLoading,
      payload: true,
    });

    await checkAndRefreshToken();

    const { authData } = spotifyState;

    // fetch the Artist using the spotify get artist api. Use fetch to get the artist
    const artist = await fetch(
      `https://api.spotify.com/v1/artists/${artistId.split(":")[2]}`,
      {
        headers: {
          Authorization: `Bearer ${authData?.access_token}`,
        },
      }
    ).then((res) => res.json());

    dispatch({
      type: SpotifyActionTypes.SetSelectedArtist,
      payload: artist,
    });

    const artistTracks = await getTopTracks(
      authData?.access_token || "",
      artistId.split(":")[2] || ""
    );

    dispatch({
      type: SpotifyActionTypes.SetTracks,
      payload: artistTracks,
    });

    dispatch({
      type: SpotifyActionTypes.ToggleArtistDataLoading,
      payload: false,
    });
  };

  const fetchWaveformForTrack = async (trackId: string) => {
    await checkAndRefreshToken();

    const { authData, selectedTrack } = spotifyState;

    const waveform = await fetch(
      `http://localhost:8000/waveform/${trackId}?token=${authData?.access_token}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());

    if (selectedTrack && selectedTrack.id === trackId) {
      dispatch({
        type: SpotifyActionTypes.SetSelectedTrack,
        payload: {
          ...selectedTrack,
          waveform,
        },
      });
    }
  };

  const checkAndRefreshToken = async () => {
    // check if spotifyTokenData is still a cookie
    const spotifyTokenData = Cookies.get("spotifyTokenData");

    if (!spotifyTokenData) {
      // get the refresh token from local storage
      const refreshToken = localStorage.getItem("spotify_refresh_token");

      if (refreshToken) {
        await refreshAuthToken(refreshToken);

        // get the spotifyTokenData from the cookie
        const newSpotifyTokenData = Cookies.get("spotifyTokenData");

        if (newSpotifyTokenData) {
          const newAuthData: SpotifyAuth = JSON.parse(newSpotifyTokenData);

          setSpotifyAuth({
            ...spotifyState,
            authData: newAuthData,
          });
        }
      }
    }
  };

  const seekToPosition = async (position: number) => {
    await checkAndRefreshToken();

    const { authData, deviceId, trackState } = spotifyState;
    if (trackState) {
      fetch(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${position}&device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authData?.access_token}`,
          },
        }
      ).then((_res) => {
        setTrackState({
          ...trackState,
          position,
        });
      });
    }
  };

  const setPlayer = async (player: Spotify.Player) => {
    dispatch({
      type: SpotifyActionTypes.SetPlayer,
      payload: player,
    });
  };

  const setDeviceId = (deviceId: string) => {
    dispatch({
      type: SpotifyActionTypes.SetDeviceId,
      payload: deviceId,
    });
  };

  const setTrackState = (trackState: TrackState) => {
    dispatch({
      type: SpotifyActionTypes.SetTrackState,
      payload: trackState,
    });
  };

  const togglePlayPaused = () => {
    dispatch({
      type: SpotifyActionTypes.SetPaused,
      payload: !spotifyState.isPaused,
    });
  };

  return {
    login,
    setSpotifyAuth,
    setServerUrl,
    setSelectedTrack,
    fetchArtist,
    fetchTracksForArtist,
    fetchArtistAndTracks,
    togglePlayPaused,
    fetchWaveformForTrack,
    seekToPosition,
    setPlayer,
    setDeviceId,
    setTrackState,
  };
};
