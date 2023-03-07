import { useContext } from "react";
import { SpotifyContext, SpotifyState } from "./SpotifyProvider";

export const useSpotifyState = (): SpotifyState => {
  const { spotifyState } = useContext(SpotifyContext);
  return spotifyState;
};
