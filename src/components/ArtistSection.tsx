import * as React from "react";
import { ComplexImageType, Image } from "@yext/pages/components";
import { useSpotifyState } from "../spotify/useSpotifyState";
import { useSpotifyActions } from "../spotify/useSpotifyActions";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

type ArtistSectionProps = {
  artists: {
    name: string;
    photoGallery: ComplexImageType[];
    description?: string;
    c_spotifyId?: string;
  }[];
};

const gridItemStyles = [
  "row-span-2 w-full",
  "col-span-2 row-span-2 w-full",
  "w-full",
  "w-full",
];

const ArtistSection = ({ artists }: ArtistSectionProps) => {
  const spotifyState = useSpotifyState();
  const spotifyActions = useSpotifyActions();
  const [openArtistItem, setOpenArtistItem] = React.useState(-1);

  useEffect(() => {
    if (spotifyState.authData?.access_token) {
      spotifyActions.fetchTracksForArtists(
        artists
          .slice(0, 5)
          .filter((artist) => artist.c_spotifyId)
          .map((artist) => artist.c_spotifyId as string)
      );
    }
  }, [spotifyState.authData?.access_token]);

  const artistTracks = spotifyState.artistTracks || {};

  const handleArtistItemClick = (idx: number) => {
    if (openArtistItem === idx) {
      setOpenArtistItem(-1);
    } else {
      setOpenArtistItem(idx);
    }
  };

  return (
    <div className=" px-4 py-8 ">
      <div className="grid grid-flow-col grid-cols-2 grid-rows-4 gap-2">
        {artists.slice(0, 4).map((artist, idx) => (
          <div
            key={artist.name}
            className={twMerge(gridItemStyles[idx], "relative")}
            onClick={() =>
              spotifyActions.setSelectedTrack(
                artistTracks[artist.c_spotifyId as string]?.[0]
              )
            }
          >
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-600/30 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <p className="p-4 font-poppins text-4xl font-semibold text-white opacity-100">
                {artist.name}
              </p>
            </div>
            <Image
              className="inset-0 h-full w-full rounded object-cover object-center opacity-100 hover:opacity-75"
              image={artist.photoGallery[0]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistSection;
