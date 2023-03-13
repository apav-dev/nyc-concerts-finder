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

type ArtistSectionProps = {
  artists: Artist[];
  concertName?: string;
};

const ArtistSection = ({ artists }: ArtistSectionProps) => {
  const spotifyState = useSpotifyState();
  const spotifyActions = useSpotifyActions();

  const artist = spotifyState.selectedArtist;
  const auth = spotifyState.authData;

  const searchActions = useSearchActions();

  const verticalResults = useSearchState((state) => state.vertical.results) as
    | Result<Ce_artist>[]
    | undefined;

  React.useEffect(() => {
    searchActions.setStaticFilters([
      {
        selected: true,
        filter: {
          kind: "fieldValue",
          fieldId: "c_concerts.name",
          value:
            "Governors Ball Music Festival (3 Day Pass) with Lizzo, Odesza, Kendrick Lamar, and more",
          matcher: Matcher.Equals,
        },
      },
    ]);
    searchActions.setVerticalLimit(8);
    searchActions.executeVerticalQuery();
  }, [searchActions]);

  useEffect(() => {
    const firstResult = verticalResults?.[0]?.rawData;
    if (firstResult) {
      firstResult.c_spotifyId &&
        spotifyActions.fetchArtistAndTracks(firstResult.c_spotifyId);
    }
  }, [verticalResults]);

  useEffect(() => {
    spotifyState.tracks &&
      spotifyActions.setSelectedTrack(spotifyState.tracks?.[0]);
  }, [spotifyState.tracks]);

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8 lg:grid lg:h-screen lg:min-h-screen lg:grid-cols-2 lg:px-8">
        <div
          className={`hidden pt-[72px] transition-opacity duration-300 lg:block`}
        >
          <div>
            <div className="aspect-w-1 aspect-h-1 mt-4 w-full">
              <img
                className="h-[400px] w-full rounded-lg object-cover"
                src={spotifyState.selectedArtist?.images?.[0].url ?? ""}
                alt=""
              />
            </div>
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
              <div className="w-96">
                <SearchBar />
              </div>
            </div>
            <div className="px-16">
              <VerticalResults<Ce_artist>
                CardComponent={ArtistCard}
                customCssClasses={{
                  verticalResultsContainer:
                    "grid grid-flow-col grid-cols-2 grid-rows-4 gap-2 sm:h-[calc(100vh-192px)]",
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
