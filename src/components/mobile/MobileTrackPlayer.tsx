import { Dialog, Transition } from "@headlessui/react";
import * as React from "react";
import { Fragment } from "react";
import { useContext } from "react";
import { SpotifyContext } from "../../spotify/SpotifyProvider";
import { TrackState } from "../MusicPlayer";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Waveform from "../Waveform";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";

type MobileTrackPlayerProps = {
  trackState: TrackState;
  open: boolean;
  setOpen: (open: boolean) => void;
  paused: boolean;
  onPlayPauseClick: () => void;
};

export const MobileTrackPlayer = ({
  open,
  setOpen,
  paused,
  onPlayPauseClick,
}: MobileTrackPlayerProps) => {
  const { spotifyState } = useContext(SpotifyContext);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10 lg:hidden" onClose={setOpen}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0  right-0 left-0 flex max-w-full ">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 "
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in-out duration-300 "
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen">
                  {/* absolute chevron down icon that closes the mobile track player*/}

                  <div className="relative flex h-full flex-col overflow-y-scroll bg-gray-900 py-6 shadow-xl">
                    <div className="absolute top-4 left-4 -mr-12 pt-2">
                      <button
                        type="button"
                        className="rounded-md  text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <ChevronDownIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <div className="px-4 pt-20">
                      <div className="aspect-w-1 aspect-h-1 w-full">
                        <img
                          className="h-full max-h-[618px] w-full rounded-lg object-contain"
                          src={spotifyState.selectedTrack?.album.images[0].url}
                          alt=""
                        />
                      </div>
                      <div className="mt-4">
                        <div className="text-center text-2xl font-medium text-white">
                          {spotifyState.selectedTrack?.name}
                        </div>
                        <div className="text-center text-sm text-gray-300">
                          {spotifyState.selectedTrack?.artists[0].name}
                        </div>
                      </div>
                    </div>
                    <Waveform />
                    <div>
                      <div className="my-6 flex justify-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          <BiSkipPrevious className="h-full w-full text-white" />
                        </div>
                        <div className="h-16 w-16 flex-shrink-0">
                          <button onClick={onPlayPauseClick}>
                            {paused ? (
                              <PlayIcon className="h-full w-full text-white" />
                            ) : (
                              <PauseIcon className="h-full w-full text-white" />
                            )}
                          </button>
                        </div>
                        <div className="h-16 w-16 flex-shrink-0">
                          <BiSkipNext className="h-full w-full text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
