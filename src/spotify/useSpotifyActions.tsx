import { useContext } from "react";
import { SpotifyTrack } from "../types/spotify";
import {
  SpotifyActionTypes,
  SpotifyContext,
  SpotifyState,
  TrackState,
} from "./SpotifyProvider";
import { getTopTracks } from "../api/spotify";
import { SpotifyAuth } from "../types/auth";

export const useSpotifyActions = () => {
  const { dispatch, spotifyState } = useContext(SpotifyContext);

  const login = () => {
    const originalUrl = window.location.href;
    const baseUrl = new URL(originalUrl).origin;

    if (baseUrl.includes("localhost")) {
      const state = baseUrl + "/" + originalUrl.substring(baseUrl.length + 1);
      const newUrl = new URL(`http://localhost:8000/api/login`);
      newUrl.searchParams.set("state", state);
      window.location.href = newUrl.href;
    } else {
      const state = originalUrl.substring(baseUrl.length + 1);
      const newUrl = new URL(`${baseUrl}/api/login`);
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

  const fetchWaveformsForTracksInState = async (tracks: SpotifyTrack[]) => {
    await checkAndRefreshToken();

    const { authData } = spotifyState;

    const domain = window.location.origin.includes("localhost")
      ? "http://localhost:8000"
      : "";

    const tracksAndWaveformPromises = await Promise.all(
      tracks.map(async (track) => {
        const waveform = await fetch(
          `${domain}/api/tracks/${track.id}/waveform?token=${authData?.access_token}`
        ).then((res) => res.json());
        return { ...track, waveform: waveform.levels };
      })
    );

    dispatch({
      type: SpotifyActionTypes.SetTracks,
      payload: tracksAndWaveformPromises,
    });
  };

  const fetchWaveformForTrack = async (trackId: string) => {
    await checkAndRefreshToken();

    const { authData, selectedTrack } = spotifyState;

    const domain = window.location.origin.includes("localhost")
      ? "http://localhost:8000"
      : "";

    const waveform = await fetch(
      `${domain}/api/tracks/${trackId}/waveform?token=${authData?.access_token}`
    ).then((res) => res.json());

    if (selectedTrack && selectedTrack.id === trackId) {
      dispatch({
        type: SpotifyActionTypes.SetSelectedTrack,
        payload: {
          ...selectedTrack,
          waveform: waveform.levels,
        },
      });
    }
  };

  const checkAndRefreshToken = async () => {
    // check local storage for spotify_auth
    const spotifyAuthStr = localStorage.getItem("spotify_auth");

    if (spotifyAuthStr) {
      const spotifyAuth: SpotifyAuth = JSON.parse(spotifyAuthStr);

      // check if token is expired
      const now = new Date();
      const expiresAt = new Date(spotifyAuth.expires_at);
      if (now > expiresAt) {
        const authResp = await fetch(
          `http://localhost:8000/api/refresh?refresh_token=${spotifyAuth.refresh_token}`
        ).then((res) => res.json());

        const expires_at =
          new Date().getTime() + parseInt(authResp.expires_in) * 1000;

        const authData = {
          access_token: authResp.access_token,
          refresh_token: spotifyAuth.refresh_token,
          expires_at,
        };

        localStorage.setItem("spotify_auth", JSON.stringify(authData));

        dispatch({
          type: SpotifyActionTypes.SetSpotifyAuth,
          payload: {
            authData,
          },
        });
      }
    } else {
      console.warn(
        "no spotify auth found in local storage when trying to refresh token"
      );
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
    fetchWaveformsForTracksInState,
  };
};
