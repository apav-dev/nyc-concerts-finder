import { CardProps } from "@yext/search-ui-react";
import * as React from "react";
import Ce_artist from "../types/search/artist";
import { twMerge } from "tailwind-merge";
import { useSpotifyActions } from "../spotify/useSpotifyActions";
import { Image } from "@yext/pages/components";
import { useState, useEffect } from "react";
import { useSpotifyState } from "../spotify/useSpotifyState";

const gridItemStyles = [
  "row-span-2 w-full",
  "col-span-2 row-span-2 w-full",
  "w-full",
  "w-full",
];

const ArtistCard = ({ result }: CardProps<Ce_artist>) => {
  const artist = result.rawData;
  const image = artist.photoGallery?.[0];

  const [hasFetchedWaveforms, setHasFetchedWaveforms] = useState(true);

  const spotifyActions = useSpotifyActions();

  const tracks = useSpotifyState((state) => state.tracks) ?? [];

  const handleArtistItemClick = async () => {
    artist.c_spotifyId &&
      (await spotifyActions.fetchArtistAndTracks(artist.c_spotifyId));
    setHasFetchedWaveforms(false);
  };

  useEffect(() => {
    if (!hasFetchedWaveforms && tracks.length > 0) {
      spotifyActions.fetchWaveformsForTracksInState(tracks);
      setHasFetchedWaveforms(true);
    }
  }, [tracks, hasFetchedWaveforms]);

  return (
    <div
      key={artist.name}
      className={twMerge(
        result.index ? gridItemStyles[result.index - 1] : "",
        "relative"
      )}
      onClick={handleArtistItemClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-600/30 opacity-0 transition-opacity duration-300 hover:opacity-100">
        <p className="p-4 font-poppins text-4xl font-semibold text-white opacity-100">
          {artist.name}
        </p>
      </div>
      <div className="aspect-w-1 aspect-h-1 h-full w-full">
        {image && (
          <Image
            className="inset-0 h-full w-full rounded object-cover object-center opacity-100 hover:opacity-75"
            image={image}
          />
        )}
      </div>
    </div>
  );
};

export default ArtistCard;
