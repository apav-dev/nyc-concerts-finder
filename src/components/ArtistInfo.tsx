import * as React from "react";
import { useSpotifyState } from "../spotify/useSpotifyState";
import TrackTable from "./TrackTable";

const ArtistInfo = () => {
  const spotifyState = useSpotifyState();
  const artist = spotifyState.selectedArtist;

  return (
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
  );
};

export default ArtistInfo;
