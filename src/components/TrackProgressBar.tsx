import * as React from "react";

type TrackProgressBarProps = {
  position: number;
  duration: number;
};

export const TrackProgressBar = ({
  position,
  duration,
}: TrackProgressBarProps) => {
  return (
    <div className="flex h-1 w-full items-center justify-center">
      {/* div with width that is the % of the position relative to the duration */}
      <div
        // linear-gradient(to right, rgb(233, 213, 255), rgb(192, 132, 252), rgb(107, 33, 168))
        // bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800
        className="h-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400"
        style={{ width: `${(position / duration) * 100}%` }}
      />
      {/* div that is the remaining percentage */}
      <div
        className="h-full w-full bg-gray-300"
        style={{ width: `${((duration - position) / duration) * 100}%` }}
      />
    </div>
  );
};
