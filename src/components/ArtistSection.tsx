import * as React from "react";
import { Artist } from "../spotify/SpotifyProvider";
import { useSpotifyState } from "../spotify/useSpotifyState";
import ArtistGrid from "./ArtistGrid";
import MusicPlayer from "./MusicPlayer";
import TrackTable from "./TrackTable";

type ArtistSectionProps = {
  artists: Artist[];
};

const ArtistSection = ({ artists }: ArtistSectionProps) => {
  const spotifyState = useSpotifyState();
  const artist = spotifyState.selectedArtist;
  const auth = spotifyState.authData;

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8 lg:grid lg:h-screen lg:min-h-screen lg:grid-cols-2 lg:px-8">
        <div className={`hidden transition-opacity duration-300 lg:block`}>
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
            <ArtistGrid artists={artists} />
          </div>
        )}
      </div>
      {auth?.access_token && <MusicPlayer token={auth.access_token} />}
    </>
  );
};

export default ArtistSection;
