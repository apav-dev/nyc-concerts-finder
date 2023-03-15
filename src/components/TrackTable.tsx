import * as React from "react";
import { ClockIcon, MusicalNoteIcon } from "@heroicons/react/24/solid";
import { SpotifyTrack } from "../types/spotify";
import { useSpotifyState } from "../spotify/useSpotifyState";
import { milliToSeconds } from "../utils/milliToSeconds";
import { useSpotifyActions } from "../spotify/useSpotifyActions";
import SpotifyLogin from "../spotify/SpotifyLogin";

const TrackTable = () => {
  const spotifyActions = useSpotifyActions();
  const spotifyState = useSpotifyState();
  const tracks = spotifyState.tracks;
  const selectedTrack = spotifyState.selectedTrack;
  const isPaused = spotifyState.isPaused;
  const authData = spotifyState.authData;

  const getSmallestImage = (
    images: { url: string; height: number; width: number }[]
  ) => {
    let smallestImage = images[0];
    images.forEach((image) => {
      if (image.width < smallestImage.width) {
        smallestImage = image;
      }
    });
    return smallestImage;
  };

  const handleClickTrack = (track: SpotifyTrack) => {
    spotifyActions.setSelectedTrack(track);
  };

  return authData ? (
    <div>
      <div className="mt-4 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table
              className="min-w-full divide-y divide-gray-300"
              style={{ tableLayout: "fixed" }}
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-[5%] py-3.5 pl-1 text-left text-sm font-semibold text-gray-400"
                  >
                    #
                  </th>

                  <th
                    scope="col"
                    className="w-1/2 py-3.5 pl-16 text-left text-sm font-semibold text-gray-400"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="hidden w-1/5 py-3.5 pl-3.5 text-left text-sm font-semibold text-gray-400 2xl:table-cell"
                  >
                    Album
                  </th>
                  <th
                    scope="col"
                    className="w-1/2 py-3.5 pl-16 text-left text-sm font-semibold text-gray-400"
                  >
                    {/* <ClockIcon className="h-4 w-4 text-right text-gray-400" />
                     */}
                    <p className="text-right">Runtime</p>
                  </th>
                </tr>
              </thead>
              <tbody className="h-20 overflow-hidden overflow-y-scroll">
                {tracks?.slice(0, 5).map((track, idx) => (
                  <tr
                    key={track.id}
                    className="group hover:bg-gray-700"
                    onClick={() => handleClickTrack(track)}
                  >
                    <td className="whitespace-nowrap py-4 px-1 text-sm font-medium text-gray-900">
                      {selectedTrack?.id === track.id && isPaused ? (
                        <MusicalNoteIcon className="h-4 animate-pulse text-pink-500" />
                      ) : (
                        <div className="font-poppins font-semibold text-gray-400 group-hover:text-white">
                          {idx + 1}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-4 text-sm text-gray-500">
                      <div className="flex">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={getSmallestImage(track.album.images).url}
                          alt=""
                        />
                        <div className="pl-3.5">
                          <p className="text-sm font-semibold text-white">
                            {track.name}
                          </p>
                          <p className="text-sm text-gray-400 group-hover:text-white">
                            {track.artists[0].name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="relative hidden max-w-[10rem] overflow-hidden truncate whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium 2xl:table-cell">
                      <p className="w-full max-w-full truncate  text-gray-400">
                        {track.album.name}
                      </p>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium ">
                      <p className="text-gray-400">
                        {milliToSeconds(track.duration_ms)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <SpotifyLogin />
  );
};

export default TrackTable;
