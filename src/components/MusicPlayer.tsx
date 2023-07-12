import * as React from "react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
} from "@heroicons/react/24/solid";
import { playTrack } from "../api/spotify";
import { TrackProgressBar } from "./TrackProgressBar";
import { MobileTrackPlayer } from "./mobile/MobileTrackPlayer";
import { useSpotifyActions } from "../spotify/useSpotifyActions";
import { useSpotifyState } from "../spotify/useSpotifyState";
import Waveform from "./Waveform";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";

export type TrackState = {
  paused: boolean;
  position: number;
  duration: number;
  updateTime: number;
};

type MusicPlayerProps = {
  token: string;
};

const MusicPlayer = ({ token }: MusicPlayerProps) => {
  const spotifyActions = useSpotifyActions();
  const spotifyState = useSpotifyState();
  const player = spotifyState.player;
  const deviceId = spotifyState.deviceId;
  const trackState = spotifyState.trackState;
  const selectedTrack = spotifyState.selectedTrack;
  const [mobilePlayerOpen, setMobilePlayerOpen] = useState(false);

  useEffect(() => {
    spotifyActions.setTrackState({
      paused: true,
      position: 0,
      duration: selectedTrack?.duration_ms || 0,
      updateTime: 0,
    });
  }, [selectedTrack]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "NYC Concert Finder",
        getOAuthToken: (cb) => {
          // TODO: add refresh token logic
          return cb(token);
        },
        volume: 0.5,
      });

      spotifyActions.setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        spotifyActions.setDeviceId(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        spotifyActions.setTrackState({
          paused: state.paused,
          position: state.position,
          duration: state.duration,
          updateTime: state.timestamp,
        });
      });

      player.connect();
    };
  }, []);

  const handlePlayPauseClick = async () => {
    spotifyActions.togglePlayPaused();
    if (selectedTrack && deviceId && trackState) {
      if (trackState?.paused) {
        playTrack(token, deviceId, selectedTrack.uri, trackState.position);
      } else {
        spotifyState.player?.pause();
      }
    }
  };

  useEffect(() => {
    selectedTrack && spotifyActions.fetchWaveformForTrack(selectedTrack?.id);
  }, [spotifyState.selectedTrack?.id]);

  return (
    <div
      className={twMerge(
        `fixed bottom-0 left-0 h-0 w-full overflow-hidden bg-gradient-to-r from-gray-900 to-gray-600 shadow-2xl shadow-white transition-all duration-300`,
        spotifyState.selectedTrack && "h-16 lg:h-[72px]"
      )}
    >
      {trackState && <TrackProgressBar />}

      <div className="mx-auto flex max-w-7xl items-center px-4 py-2 sm:px-6 lg:py-0 lg:px-8">
        <div
          className="flex flex-auto"
          onClick={() => setMobilePlayerOpen(true)}
        >
          <div className="flex-shrink-0">
            <img
              className="h-12 w-12 rounded-full"
              src={selectedTrack?.album.images[0].url}
              alt=""
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">
              {selectedTrack?.name}
            </div>
            <div className="text-sm text-gray-300">
              {selectedTrack?.artists[0].name}
            </div>
          </div>
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          <Waveform />
          <div>
            <div className="my-6 flex justify-center">
              <div className="h-8 w-8 flex-shrink-0">
                <BiSkipPrevious className="h-full w-full text-white" />
              </div>
              <div className="h-8 w-8 flex-shrink-0">
                <button onClick={handlePlayPauseClick}>
                  {trackState?.paused ? (
                    <PlayIcon className="h-full w-full text-white" />
                  ) : (
                    <PauseIcon className="h-full w-full text-white" />
                  )}
                </button>
              </div>
              <div className="h-8 w-8 flex-shrink-0">
                <BiSkipNext className="h-full w-full text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {trackState && (
        <MobileTrackPlayer
          trackState={trackState}
          open={mobilePlayerOpen}
          setOpen={setMobilePlayerOpen}
          paused={trackState.paused}
          onPlayPauseClick={handlePlayPauseClick}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
