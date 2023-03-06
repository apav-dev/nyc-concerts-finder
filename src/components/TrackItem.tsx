import * as React from "react";
import { useContext } from "react";
import {
  SpotifyContext,
  SpotifyActionTypes,
} from "../providers/SpotifyProvider";
import { SpotifyTrack } from "../types/spotify";

type TrackItemProps = {
  track: SpotifyTrack;
};

const TrackItem = ({ track }: TrackItemProps) => {
  const { dispatch } = useContext(SpotifyContext);

  const handleTrackClick = () => {
    dispatch({ type: SpotifyActionTypes.SetSelectedTrack, payload: track });
  };

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
      className="flex items-center py-2 hover:bg-gray-700"
      onClick={handleTrackClick}
    >
      <div className="flex-shrink-0">
        <img
          className="h-12 w-12 rounded-full"
          src={getSmallestImage(track.album.images).url}
          alt=""
        />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-white">{track.name}</div>
        <div className="text-sm text-gray-300">{track.artists[0].name}</div>
      </div>
    </div>
  );
};

export default TrackItem;
