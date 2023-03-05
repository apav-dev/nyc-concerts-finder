import { useQueries } from "@tanstack/react-query";
import { ComplexImageType } from "@yext/pages/components";
import * as React from "react";
import { useContext } from "react";
import { getTopTracks } from "../api/spotify";
import { AuthContext } from "../providers/AuthProvider";
import ArtistItem from "./ArtistItem";

type ArtistSectionProps = {
  artists: {
    name: string;
    photoGallery: ComplexImageType[];
    description?: string;
    c_spotifyId?: string;
  }[];
};

const ArtistSection = ({ artists }: ArtistSectionProps) => {
  const { authState } = useContext(AuthContext);
  const [openArtistItem, setOpenArtistItem] = React.useState(-1);

  const artistTracks = useQueries({
    queries: artists.slice(0, 5).map((artist) => ({
      queryKey: ["artistTracks", artist.c_spotifyId],
      queryFn: () =>
        getTopTracks(
          authState.spotifyAuth?.access_token || "",
          artist.c_spotifyId?.split(":")[2] || ""
        ),
      enabled: !!authState.spotifyAuth?.access_token && !!artist.c_spotifyId,
    })),
  });

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
          tracks={artistTracks[idx]?.data?.slice(0, 5)}
        />
      ))}
    </>
  );
};

export default ArtistSection;
