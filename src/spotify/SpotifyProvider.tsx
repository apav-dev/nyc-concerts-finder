import * as React from "react";
import { createContext, Dispatch, useEffect, useReducer } from "react";
import { SpotifyAuth } from "../types/auth";
import { SpotifyTrack } from "../types/spotify";

export type SpotifyState = {
  authData?: SpotifyAuth;
  serverUrl?: string;
  timeOfLastRefresh?: string;
  selectedTrack?: SpotifyTrack;
  artistTracks?: Record<string, SpotifyTrack[]>; // artistId: SpotifyTrack[]
};

export enum SpotifyActionTypes {
  SetSpotifyAuth,
  SetServerUrl,
  SetSelectedTrack,
  SetArtistTracks,
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

export interface SetArtistTracks {
  type: SpotifyActionTypes.SetArtistTracks;
  payload: Record<string, SpotifyTrack[]>;
}

export type SpotifyActions =
  | SetSpotifyAuth
  | SetServerUrl
  | SetSelectedTrack
  | SetArtistTracks;

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
    case SpotifyActionTypes.SetArtistTracks:
      return { ...state, artistTracks: action.payload };
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
  const [spotifyState, dispatch] = useReducer(authReducer, {});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenStr = urlParams.get("tokenData");
    if (tokenStr) {
      const tokenData = JSON.parse(tokenStr);
      dispatch({
        type: SpotifyActionTypes.SetSpotifyAuth,
        payload: {
          authData: tokenData,
          timeOfLastRefresh: new Date().toUTCString(),
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

  // TODO: fetch spotify token from cookie or local storage on page load

  return (
    <SpotifyContext.Provider value={{ spotifyState, dispatch }}>
      {children}
    </SpotifyContext.Provider>
  );
};
