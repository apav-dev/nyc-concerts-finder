import { ComplexImageType } from "@yext/pages/components";
import * as React from "react";
import { createContext, Dispatch, useEffect, useReducer } from "react";
import { refreshAuthToken } from "../api/spotify";
import { SpotifyAuth } from "../types/auth";
import { SpotifyArtist, SpotifyTrack } from "../types/spotify";
import Cookies from "js-cookie";

export type Artist = {
  name: string;
  photoGallery: ComplexImageType[];
  description?: string;
  c_spotifyId?: string;
};

export type TrackState = {
  paused: boolean;
  position: number;
  duration: number;
  updateTime: number;
};

export type SpotifyState = {
  authData?: SpotifyAuth;
  serverUrl?: string;
  selectedTrack?: SpotifyTrack;
  selectedArtist?: SpotifyArtist;
  tracks?: SpotifyTrack[]; // artistId: SpotifyTrack[]
  isPaused?: boolean;
  artistDataLoading?: boolean;
  player?: Spotify.Player;
  deviceId?: string;
  trackState?: TrackState;
};

export enum SpotifyActionTypes {
  SetSpotifyAuth,
  SetServerUrl,
  SetSelectedTrack,
  SetSelectedArtist,
  SetTracks,
  SetPaused,
  ToggleArtistDataLoading,
  SetPlayer,
  SetDeviceId,
  SetTrackState,
}

export interface SetSpotifyAuth {
  type: SpotifyActionTypes.SetSpotifyAuth;
  payload: SpotifyState;
}
export interface SetServerUrl {
  type: SpotifyActionTypes.SetServerUrl;
  payload: string;
}

export interface SetSelectedTrack {
  type: SpotifyActionTypes.SetSelectedTrack;
  payload: SpotifyTrack;
}

export interface SetTrack {
  type: SpotifyActionTypes.SetTracks;
  payload: SpotifyTrack[];
}

export interface SetSelectedArtist {
  type: SpotifyActionTypes.SetSelectedArtist;
  payload: SpotifyArtist;
}

export interface SetPaused {
  type: SpotifyActionTypes.SetPaused;
  payload: boolean;
}

export interface ToggleArtistDataLoading {
  type: SpotifyActionTypes.ToggleArtistDataLoading;
  payload: boolean;
}

export interface SetPlayer {
  type: SpotifyActionTypes.SetPlayer;
  payload: Spotify.Player;
}

export interface SetDeviceId {
  type: SpotifyActionTypes.SetDeviceId;
  payload: string;
}

export interface SetTrackState {
  type: SpotifyActionTypes.SetTrackState;
  payload: TrackState;
}

export type SpotifyActions =
  | SetSpotifyAuth
  | SetServerUrl
  | SetSelectedTrack
  | SetSelectedArtist
  | SetTrack
  | SetPaused
  | ToggleArtistDataLoading
  | SetPlayer
  | SetDeviceId
  | SetTrackState;

export const authReducer = (
  state: SpotifyState,
  action: SpotifyActions
): SpotifyState => {
  switch (action.type) {
    case SpotifyActionTypes.SetSpotifyAuth:
      return action.payload;
    case SpotifyActionTypes.SetServerUrl:
      return { ...state, serverUrl: action.payload };
    case SpotifyActionTypes.SetSelectedTrack:
      return { ...state, selectedTrack: action.payload };
    case SpotifyActionTypes.SetTracks:
      return { ...state, tracks: action.payload };
    case SpotifyActionTypes.SetSelectedArtist:
      return { ...state, selectedArtist: action.payload };
    case SpotifyActionTypes.SetPaused:
      return { ...state, isPaused: action.payload };
    case SpotifyActionTypes.ToggleArtistDataLoading:
      return { ...state, artistDataLoading: action.payload };
    case SpotifyActionTypes.SetPlayer:
      return { ...state, player: action.payload };
    case SpotifyActionTypes.SetDeviceId:
      return { ...state, deviceId: action.payload };
    case SpotifyActionTypes.SetTrackState:
      return { ...state, trackState: action.payload };
    default:
      return state;
  }
};

export const SpotifyContext = createContext<{
  spotifyState: SpotifyState;
  dispatch: Dispatch<SpotifyActions>;
}>({ spotifyState: {}, dispatch: () => null });

type ProviderProps = {
  domain?: string;
  children: React.ReactNode;
};

// TODO: Move to SpotifyActions
export const login = () => {
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

export const SpotifyProvider = ({ children, domain }: ProviderProps) => {
  const [spotifyState, dispatch] = useReducer(authReducer, {
    artistDataLoading: false,
  });

  useEffect(() => {
    const authCookie = Cookies.get("spotifyTokenData");

    if (authCookie) {
      let authData = JSON.parse(authCookie) as SpotifyAuth;

      if (
        new Date().getTime() - new Date(authData.timeOfLastRefresh).getTime() >
        3_600_000
      ) {
        refreshAuthToken(authData.refresh_token)
          .then((newAuthData) => {
            authData = newAuthData;
          })
          .catch((err) => {
            console.log("Error refreshing token: ", err);
          });
      }
      dispatch({
        type: SpotifyActionTypes.SetSpotifyAuth,
        payload: {
          authData,
        },
      });
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: SpotifyActionTypes.SetServerUrl,
      payload: domain ? `https://${domain}` : "http://localhost:8000",
    });
  }, [domain]);

  return (
    <SpotifyContext.Provider value={{ spotifyState, dispatch }}>
      {children}
    </SpotifyContext.Provider>
  );
};
