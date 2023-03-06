import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { SpotifyContext } from "../providers/SpotifyProvider";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { playTrack } from "../api/spotify";

const MusicPlayer = () => {
  const { spotifyState } = useContext(SpotifyContext);
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [isPaused, setPaused] = useState(true);
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    if (spotifyState.authData?.access_token) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "NYC Concert Finder",
          getOAuthToken: (cb) => {
            // TODO: add refresh token logic
            return cb(spotifyState.authData?.access_token || "");
          },
          volume: 0.5,
        });

        setPlayer(player);

        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
          localStorage.setItem("deviceId", device_id);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("player_state_changed", (state) => {
          console.log("Player State Changed");
          if (!state) {
            return;
          }

          // setCurrentTrack(state.track_window.current_track);
          setPaused(state.paused);
        });

        player.connect();

        localStorage.setItem("spotifyPlayer", JSON.stringify(player));
      };
    }
  }, [spotifyState.authData?.access_token]);

  const handlePlayPauseClick = () => {
    if (spotifyState.selectedTrack && spotifyState.authData?.access_token) {
      isPaused
        ? playTrack(
            spotifyState.authData?.access_token,
            deviceId,
            spotifyState.selectedTrack.uri
          )
        : player?.pause();
    }
  };

  return (
    // div that is fixed to the bottom of the screen and takes up the full width. Only appears when spotifyState.currentTrack is not null
    <div
      className={twMerge(
        `fixed bottom-0 left-0 h-0 w-full overflow-hidden bg-gray-900 transition-all duration-300`,
        spotifyState.selectedTrack && "h-16"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <img
              className="h-12 w-12 rounded-full"
              src={spotifyState.selectedTrack?.album.images[0].url}
              alt=""
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">
              {spotifyState.selectedTrack?.name}
            </div>
            <div className="text-sm text-gray-300">
              {spotifyState.selectedTrack?.artists[0].name}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <button onClick={handlePlayPauseClick}>
            {isPaused ? (
              <PlayIcon className="h-6 w-6 text-white" />
            ) : (
              <PauseIcon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
