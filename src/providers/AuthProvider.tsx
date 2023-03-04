import * as React from "react";
import { createContext, Dispatch, useEffect, useReducer } from "react";
import { SpotifyAuth } from "../types/auth";
import { fetch } from "@yext/pages/util";

export type AuthState = {
  spotifyAuth?: SpotifyAuth;
  serverUrl?: string;
  timeOfLastRefresh?: string;
};

export enum AuthActionTypes {
  SetSpotifyAuth,
  SetServerUrl,
}

export interface SetSpotifyAuth {
  type: AuthActionTypes.SetSpotifyAuth;
  payload: AuthState;
}
export interface SetServerUrl {
  type: AuthActionTypes.SetServerUrl;
  payload: string;
}

export type AuthActions = SetSpotifyAuth | SetServerUrl;

export const authReducer = (
  state: AuthState,
  action: AuthActions
): AuthState => {
  switch (action.type) {
    case AuthActionTypes.SetSpotifyAuth:
      return action.payload;
    case AuthActionTypes.SetServerUrl:
      return { ...state, serverUrl: action.payload };
    default:
      return state;
  }
};

export const AuthContext = createContext<{
  authState: AuthState;
  dispatch: Dispatch<AuthActions>;
}>({ authState: {}, dispatch: () => null });

type ProviderProps = {
  domain?: string;
  children: React.ReactNode;
};

export const login = () => {
  const currentUrl = new URL(window.location.href);
  window.location.href = `${currentUrl.hostname}/login?state=${currentUrl.pathname}`;
};

export const fetchRefreshToken = async (
  refresh_token: string,
  domain?: string
) => {
  const serverDomain = domain ? `https://${domain}` : "http://localhost:8000";
  const response = await fetch(
    `${serverDomain}/refresh_token?refresh_token=${refresh_token}`
  );
  const data = await response.json();
  return data;
};

export const AuthProvider = ({ children, domain }: ProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, {});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenStr = urlParams.get("tokenData");
    if (tokenStr) {
      const tokenData = JSON.parse(tokenStr);
      dispatch({
        type: AuthActionTypes.SetSpotifyAuth,
        payload: {
          spotifyAuth: tokenData,
          timeOfLastRefresh: new Date().toUTCString(),
        },
      });
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: AuthActionTypes.SetServerUrl,
      payload: domain ? `https://${domain}` : "http://localhost:8000",
    });
  }, [domain]);

  // TODO: fetch spotify token from cookie or local storage on page load

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
