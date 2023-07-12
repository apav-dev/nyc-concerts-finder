import * as React from "react";
import { useEffect, useState } from "react";
import { useSpotifyState } from "../spotify/useSpotifyState";

export const TrackProgressBar = () => {
  const [position, setPosition] = useState(0);

  const trackState = useSpotifyState((state) => state.trackState);
  const duration = trackState?.duration || 0;

  useEffect(() => {
    if (trackState) {
      setPosition(trackState.position);
    }
  }, [trackState?.position]);

  // function that runs every 300 ms to update the position of the track
  useEffect(() => {
    const interval = setInterval(() => {
      if (!trackState?.paused) {
        setPosition((prevState) => prevState + 300);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [trackState?.paused]);

  return (
    <div className="flex h-1 w-full items-center justify-center lg:hidden">
      <div
        className="h-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400"
        style={{ width: `${(position / duration) * 100}%` }}
      />
      <div
        className="h-full w-full bg-gray-300"
        style={{ width: `${((duration - position) / duration) * 100}%` }}
      />
    </div>
  );
};
