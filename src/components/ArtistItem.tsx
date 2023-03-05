import * as React from "react";
import { ComplexImageType, Image } from "@yext/pages/components";
import { twMerge } from "tailwind-merge";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import TrackItem from "./TrackItem";
import { mockSpotifyTrack, SpotifyTrack } from "../types/spotify";

type ArtistItemProps = {
  artist: {
    name: string;
    photoGallery: ComplexImageType[];
    description?: string;
  };
  open?: boolean;
  onClick?: () => void;
  tracks?: SpotifyTrack[];
};

const ArtistItem = ({ artist, open, onClick, tracks }: ArtistItemProps) => {
  // TODO: Only make expandable if there are tracks
  return (
    <div className="relative">
      <div
        className={`${
          open ? "h-96 sm:h-[448px]" : "h-16"
        } overflow-hidden transition-all duration-300`}
      >
        <div className="ml-4">
          <div className="flex items-center">
            {artist.photoGallery?.[0] && (
              <div
                className={twMerge(
                  "h-12 w-16 overflow-hidden transition-all duration-300",
                  open && "sm:h-24 sm:w-32"
                )}
              >
                <Image
                  className="h-full w-full rounded-lg object-cover"
                  image={artist.photoGallery[0]}
                />
              </div>
            )}
            <div className="ml-4">
              <h3 className="text-base font-semibold leading-6 text-white">
                {artist.name}
              </h3>
            </div>
          </div>
        </div>
        <div className="px-8 py-4">
          {tracks?.map((track) => (
            <TrackItem key={track.id} track={track} />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="absolute top-0 right-0 mt-4 transform transition-all duration-300 focus:outline-none"
        onClick={onClick}
      >
        <ArrowUpCircleIcon
          // animate the icon to rotate 180 degrees when the description is expanded
          className={` h-6 w-6 text-white transition-all duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default ArtistItem;
