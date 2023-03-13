import { ComplexImageType } from "@yext/pages/components";
import * as React from "react";
import { createContext, Dispatch, useEffect, useReducer } from "react";
import { refreshAuthToken } from "../api/spotify";
import { SpotifyAuth } from "../types/auth";
import { SpotifyArtist, SpotifyTrack } from "../types/spotify";

export type Artist = {
  name: string;
  photoGallery: ComplexImageType[];
  description?: string;
  c_spotifyId?: string;
};

export type SpotifyState = {
  authData?: SpotifyAuth;
  serverUrl?: string;
  selectedTrack?: SpotifyTrack;
  selectedArtist?: SpotifyArtist;
  tracks?: SpotifyTrack[]; // artistId: SpotifyTrack[]
  isPaused?: boolean;
  artistDataLoading?: boolean;
};

export enum SpotifyActionTypes {
  SetSpotifyAuth,
  SetServerUrl,
  SetSelectedTrack,
  SetSelectedArtist,
  SetTracks,
  SetPaused,
  ToggleArtistDataLoading,
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

export type SpotifyActions =
  | SetSpotifyAuth
  | SetServerUrl
  | SetSelectedTrack
  | SetSelectedArtist
  | SetTrack
  | SetPaused
  | ToggleArtistDataLoading;

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
  const [spotifyState, dispatch] = useReducer(authReducer, {
    artistDataLoading: false,
  });

  // TODO: save authData to HttpOnly cookie instead of local storage
  useEffect(() => {
    let tokenStr = localStorage.getItem("tokenData");
    let authData = null;
    if (!tokenStr) {
      const urlParams = new URLSearchParams(window.location.search);
      tokenStr = urlParams.get("tokenData");
      if (tokenStr) {
        authData = {
          ...JSON.parse(tokenStr),
          timeOfLastRefresh: new Date().toUTCString(),
        };
        localStorage.setItem("tokenData", JSON.stringify(authData));
      }
    } else {
      authData = JSON.parse(tokenStr) as SpotifyAuth;
      // if it has been more than 60 minutes since the last refresh, refresh the token
      if (new Date().getTime() - authData.expires_in > 60 * 60 * 1000) {
        console.log("refreshing token");
        refreshAuthToken(authData.refresh_token).then((newAuthData) => {
          authData = {
            ...newAuthData,
            timeOfLastRefresh: new Date().toUTCString(),
          };
          localStorage.setItem("tokenData", JSON.stringify(authData));
        });
      }
    }

    dispatch({
      type: SpotifyActionTypes.SetSpotifyAuth,
      payload: {
        authData,
      },
    });
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
