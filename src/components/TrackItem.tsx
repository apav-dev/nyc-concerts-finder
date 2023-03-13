import * as React from "react";
import { twMerge } from "tailwind-merge";
import { useSpotifyActions } from "../spotify/useSpotifyActions";
import { useSpotifyState } from "../spotify/useSpotifyState";
import { SpotifyTrack } from "../types/spotify";
import { milliToSeconds } from "../utils/milliToSeconds";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";

type TrackItemProps = {
  track: SpotifyTrack;
  index: number;
};

const TrackItem = ({ track, index }: TrackItemProps) => {
  const spotifyActions = useSpotifyActions();
  const spotifyState = useSpotifyState();

  const selectedTrack = spotifyState.selectedTrack;
  const isPaused = spotifyState.isPaused;

  const getSmallestImage = (
    images: { url: string; height: number; width: number }[]
  ) => {
    let smallestImage = images[0];
    images.forEach((image) => {
      if (image.width < smallestImage.width) {
        smallestImage = image;
      }
    });
    return smallestImage;
  };

  return (
    <div
      className={twMerge(
        "group flex items-center justify-between py-2 px-2 hover:bg-gray-700",
        selectedTrack?.id === track.id && "bg-gray-700"
      )}
      onClick={() => spotifyActions.setSelectedTrack(track)}
    >
      <div className="flex items-center ">
        <div className="flex items-center gap-4">
          {selectedTrack?.id === track.id && isPaused ? (
            <MusicalNoteIcon className="h-4 w-4 animate-pulse text-pink-500" />
          ) : (
            <div className="w-4 font-poppins  font-semibold text-gray-400 group-hover:text-white">
              {index + 1}
            </div>
          )}
          <img
            className="h-12 w-12 rounded-full"
            src={getSmallestImage(track.album.images).url}
            alt=""
          />
        </div>
        <div className=" ml-4">
          <div className="font-poppins text-sm font-semibold text-white">
            {track.name}
          </div>
          <div className="font-poppins text-sm text-gray-400 group-hover:text-white">
            {track.artists[0].name}
          </div>
        </div>
        <div className="pl-48 font-poppins text-sm text-gray-400">
          {track.name}
        </div>
      </div>
      <div className="px-4 text-gray-400">
        {milliToSeconds(track.duration_ms)}
      </div>
    </div>
  );
};

export default TrackItem;
