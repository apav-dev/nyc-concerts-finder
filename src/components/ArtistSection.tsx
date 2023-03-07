import * as React from "react";
import { ComplexImageType } from "@yext/pages/components";
import ArtistItem from "./ArtistItem";
import { useSpotifyState } from "../spotify/useSpotifyState";
import { useSpotifyActions } from "../spotify/useSpotifyActions";
import { useEffect } from "react";

type ArtistSectionProps = {
  artists: {
    name: string;
    photoGallery: ComplexImageType[];
    description?: string;
    c_spotifyId?: string;
  }[];
};

const ArtistSection = ({ artists }: ArtistSectionProps) => {
  const spotifyState = useSpotifyState();
  const spotifyActions = useSpotifyActions();
  const [openArtistItem, setOpenArtistItem] = React.useState(-1);

  useEffect(() => {
    console.log("state: ", spotifyState);
  }, [spotifyState]);

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
    <>
      {artists.map((artist, idx) => (
        <ArtistItem
          key={idx}
          artist={artist}
          open={openArtistItem === idx}
          onClick={() => handleArtistItemClick(idx)}
          tracks={artist.c_spotifyId ? artistTracks[artist.c_spotifyId] : []}
        />
      ))}
    </>
  );
};

export default ArtistSection;
