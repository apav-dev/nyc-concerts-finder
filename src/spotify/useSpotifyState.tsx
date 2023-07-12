import { useContext } from "react";
import { SpotifyContext, SpotifyState } from "./SpotifyProvider";

type Selector<TState, TResult> = (state: TState) => TResult;

export const useSpotifyState = <TResult,>(
  selector: Selector<SpotifyState, TResult>
) => {
  const context = useContext(SpotifyContext);
  return selector(context.spotifyState);
};
