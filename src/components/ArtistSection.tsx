import {
  Matcher,
  Result,
  useSearchActions,
  useSearchState,
} from "@yext/search-headless-react";
import { useEffect } from "react";
import { SearchBar, VerticalResults } from "@yext/search-ui-react";
import * as React from "react";
import { Artist } from "../spotify/SpotifyProvider";
import { useSpotifyState } from "../spotify/useSpotifyState";
import MusicPlayer from "./MusicPlayer";
import TrackTable from "./TrackTable";
import { useSpotifyActions } from "../spotify/useSpotifyActions";
import Ce_artist from "../types/search/artist";
import ArtistCard from "./ArtistCard";
import { Image, ComplexImageType } from "@yext/pages/components";

type ArtistSectionProps = {
  artists: Artist[];
  festivalName?: string;
};

const ArtistSection = ({ artists, festivalName }: ArtistSectionProps) => {
  const [artistImage, setArtistImage] = React.useState<
    ComplexImageType | undefined
  >();

  const spotifyActions = useSpotifyActions();

  const artist = useSpotifyState((state) => state.selectedArtist);
  const auth = useSpotifyState((state) => state.authData);

  const searchActions = useSearchActions();

  const verticalResults = useSearchState((state) => state.vertical.results) as
    | Result<Ce_artist>[]
    | undefined;

  useEffect(() => {
    if (festivalName) {
      searchActions.setStaticFilters([
        {
          selected: true,
          filter: {
            kind: "fieldValue",
            fieldId: "c_festivals.name",
            value: festivalName,
            matcher: Matcher.Equals,
          },
        },
      ]);
      searchActions.setVerticalLimit(8);
      searchActions.executeVerticalQuery();
    }
  }, [searchActions]);

  useEffect(() => {
    const firstResult = verticalResults?.[0]?.rawData;
    if (firstResult) {
      firstResult.c_spotifyId &&
        spotifyActions.fetchArtistAndTracks(firstResult.c_spotifyId);
    }
    setArtistImage(firstResult?.photoGallery?.[0]);
  }, [verticalResults]);

  // when the artist changes, find the image in the vertical results and set it
  useEffect(() => {
    if (artist) {
      const artistResult = verticalResults?.find(
        (result) => result.rawData.c_spotifyId?.split(":")[2] === artist.id
      );
      setArtistImage(artistResult?.rawData?.photoGallery?.[0]);
    }
  }, [artist]);

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
        <div className={`hidden pt-2 transition-opacity duration-300 lg:block`}>
          <h2
            className="pt-2 font-bowlby text-3xl font-bold text-pink-600"
            style={{ fontSize: "48px", lineHeight: 1 }}
          >
            Lineup
          </h2>
          <div>
            {artistImage && (
              <div className="aspect-w-1 aspect-h-1 mt-4 w-full">
                <Image
                  className=" rounded-lg object-cover"
                  image={artistImage}
                  layout="fixed"
                  width={736}
                  height={400}
                />
              </div>
            )}
            <div className="py-4">
              <h3 className="font-poppins text-4xl font-semibold text-white">
                {artist?.name}
              </h3>
            </div>
            <TrackTable />
          </div>
        </div>
        {artists && (
          <div className="mt-4">
            <div className="flex justify-end px-16">
              <div className="w-96 pt-2">
                <SearchBar />
              </div>
            </div>
            <div className="h-full px-16">
              <VerticalResults<Ce_artist>
                CardComponent={ArtistCard}
                customCssClasses={{
                  verticalResultsContainer:
                    "grid grid-flow-col grid-cols-2 grid-rows-4 gap-2 h-[937px] overflow-hidden",
                }}
              />
            </div>
          </div>
        )}
      </div>
      {auth?.access_token && <MusicPlayer token={auth.access_token} />}
    </>
  );
};

export default ArtistSection;
