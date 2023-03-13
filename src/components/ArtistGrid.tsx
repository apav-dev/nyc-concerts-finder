import * as React from "react";
import { Image } from "@yext/pages/components";
import { useSpotifyState } from "../spotify/useSpotifyState";
import { useSpotifyActions } from "../spotify/useSpotifyActions";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Artist } from "../spotify/SpotifyProvider";

type ArtistGridProps = {
  artists: Artist[];
};

const gridItemStyles = [
  "row-span-2 w-full",
  "col-span-2 row-span-2 w-full",
  "w-full",
  "w-full",
];

const ArtistGrid = ({ artists }: ArtistGridProps) => {
  const spotifyActions = useSpotifyActions();
  const spotfiyState = useSpotifyState();

  const handleArtistItemClick = (artist: Artist) => {
    artist.c_spotifyId &&
      spotifyActions.fetchArtistAndTracks(artist.c_spotifyId);
  };

  useEffect(() => {
    if (artists[0]) {
      handleArtistItemClick(artists[0]);
    }
  }, [spotfiyState.authData?.access_token]);

  useEffect(() => {
    spotfiyState.tracks &&
      spotifyActions.setSelectedTrack(spotfiyState.tracks?.[0]);
  }, [spotfiyState.tracks]);

  return (
    <div className="px-16">
      <div className="grid grid-flow-col grid-cols-2 grid-rows-4 gap-2 sm:h-[calc(100vh-144px)]">
        {artists.slice(0, 8).map((artist, idx) => (
          <div
            key={artist.name}
            className={twMerge(gridItemStyles[idx], "relative")}
            onClick={() => handleArtistItemClick(artist)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-600/30 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <p className="p-4 font-poppins text-4xl font-semibold text-white opacity-100">
                {artist.name}
              </p>
            </div>
            <div className="aspect-w-1 aspect-h-1 h-full w-full">
              <Image
                className="inset-0 h-full w-full rounded object-cover object-center opacity-100 hover:opacity-75"
                image={artist.photoGallery[0]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistGrid;
