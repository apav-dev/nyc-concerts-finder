import * as React from "react";
import { ComplexImageType, Image } from "@yext/pages/components";
import { twMerge } from "tailwind-merge";

import { useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

type ArtistItemProps = {
  artist: {
    name: string;
    photoGallery: ComplexImageType[];
    description?: string;
  };
};

const ArtistItem = ({ artist }: ArtistItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className="relative">
      <div
        className={`${
          isExpanded ? "h-48" : "h-16"
        } overflow-hidden transition-all duration-300`}
      >
        <div className="ml-4">
          <div className="flex items-center">
            {artist.photoGallery?.[0] && (
              <div
                className={twMerge(
                  "overflow-hidden transition-all duration-300",
                  isExpanded ? "h-24 w-32" : "h-12 w-16"
                )}
              >
                <Image
                  className="h-full w-full rounded-lg object-cover"
                  image={artist.photoGallery[0]}
                />
              </div>
            )}
            <div className="ml-4">
              <h3 className="text-base font-semibold leading-6 text-white">
                {artist.name}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="absolute top-0 right-0 mt-4 transform transition-all duration-300 focus:outline-none"
        onClick={toggleExpansion}
      >
        <ArrowUpCircleIcon
          // animate the icon to rotate 180 degrees when the description is expanded
          className={` h-6 w-6 text-white transition-all duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default ArtistItem;
