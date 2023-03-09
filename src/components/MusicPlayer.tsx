import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { SpotifyContext } from "../spotify/SpotifyProvider";
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
} from "@heroicons/react/24/solid";
import { playTrack } from "../api/spotify";
import { TrackProgressBar } from "./TrackProgressBar";
import { MobileTrackPlayer } from "./mobile/MobileTrackPlayer";

export type TrackState = {
  paused: boolean;
  position: number;
  duration: number;
  updateTime: number;
};

const MusicPlayer = () => {
  const { spotifyState } = useContext(SpotifyContext);
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [deviceId, setDeviceId] = useState("");
  const [trackState, setTrackState] = useState<TrackState>({
    paused: true,
    position: 0,
    duration: 0,
    updateTime: 0,
  });
  const [mobilePlayerOpen, setMobilePlayerOpen] = useState(false);

  useEffect(() => {
    setTrackState({
      paused: true,
      position: 0,
      duration: 0,
      updateTime: 0,
    });
  }, [spotifyState.selectedTrack]);

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
          setTrackState({
            paused: state.paused,
            position: state.position,
            duration: state.duration,
            updateTime: state.timestamp,
          });
        });

        player.connect();

        localStorage.setItem("spotifyPlayer", JSON.stringify(player));
      };
    }
  }, []);

  const handlePlayPauseClick = () => {
    if (spotifyState.selectedTrack && spotifyState.authData?.access_token) {
      debugger;
      trackState.paused
        ? playTrack(
            spotifyState.authData?.access_token,
            deviceId,
            spotifyState.selectedTrack.uri,
            trackState.position
          )
        : player?.pause();
    }
    // player?.togglePlay();
  };

  // function that runs every 300 ms to update the position of the track
  useEffect(() => {
    const interval = setInterval(() => {
      if (!trackState.paused) {
        setTrackState((prevState) => ({
          ...prevState,
          position: prevState.position + 300,
        }));
      }
    }, 300);
    return () => clearInterval(interval);
  }, [trackState.paused]);

  return (
    // div that is fixed to the bottom of the screen and takes up the full width. Only appears when spotifyState.currentTrack is not null
    <div
      className={twMerge(
        `fixed bottom-0 left-0 h-0 w-full overflow-hidden bg-gradient-to-r from-gray-900 to-gray-600 shadow-2xl shadow-white transition-all duration-300`,
        spotifyState.selectedTrack && "h-[68px]"
      )}
      // onClick={() => setMobilePlayerOpen(true)}
    >
      <TrackProgressBar
        position={trackState.position}
        duration={trackState.duration}
      />
      <div className="mx-auto flex max-w-7xl items-center py-2 px-4 sm:px-6 lg:px-8">
        <div
          className="flex flex-auto"
          onClick={() => setMobilePlayerOpen(true)}
        >
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
        <div className="h-8 w-8 flex-shrink-0">
          <button onClick={handlePlayPauseClick}>
            {trackState.paused ? (
              <PlayIcon className="h-full w-full text-white" />
            ) : (
              <PauseIcon className="h-full w-full text-white" />
            )}
          </button>
        </div>
      </div>
      <MobileTrackPlayer
        trackState={trackState}
        open={mobilePlayerOpen}
        setOpen={setMobilePlayerOpen}
        paused={trackState.paused}
        onPlayPauseClick={handlePlayPauseClick}
      />
    </div>
  );
};

export default MusicPlayer;
