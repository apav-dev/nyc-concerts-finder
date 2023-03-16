import {
  GetHeadConfig,
  GetPath,
  HeadConfig,
  Template,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import * as React from "react";
import "../index.css";
import PageLayout from "../layouts/PageLayout";
import { ComplexImageType, Address, Image } from "@yext/pages/components";
import GlowingImage from "../components/GlowingImage";
import ArtistSection from "../components/ArtistSection";
import LabeledDivider from "../components/LabeledDivider";
import { useRef } from "react";

// Graph QL-like interface
export const config: TemplateConfig = {
  stream: {
    $id: "music_festivals",
    fields: [
      "id",
      "name",
      "description",
      "c_primaryPhoto",
      "c_datetimeUtc",
      "slug",
      "c_venue.name",
      "c_venue.address",
      "c_artists.name",
      "c_artists.photoGallery",
      "c_artists.c_spotifyId",
    ],
    filter: {
      entityTypes: ["ce_musicFestival"],
    },
    // The entity language profiles that documents will be generated for.
    localization: {
      locales: ["en"],
      primary: false,
    },
  },
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return document.slug ?? document.name;
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

// export const transformProps: TransformProps<TemplateProps> = async (data) => {
// runs at build time to fetch data from external APIs
// };

const MusicFestival: Template<TemplateRenderProps> = ({
  document,
}: TemplateRenderProps) => {
  const { name, _site, c_datetimeUtc, c_artists, c_primaryPhoto, description } =
    document;

  const artistSectionRef = useRef<HTMLDivElement>(null);

  const mainPhoto: ComplexImageType | undefined =
    c_primaryPhoto || c_artists?.[0].photoGallery?.[0];
  const venue = document.c_venue?.[0];

  // c_datetimeUtc is a string in the format "2023-03-02T01:00:00". Convert to string in the form of "03.02.2023"
  const date = c_datetimeUtc
    ? new Date(c_datetimeUtc)
        .toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
        .replaceAll("/", ".")
    : undefined;

  const handleLineupClick = () => {
    artistSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageLayout logo={_site.c_logo}>
      <div className="pb-20">
        <div className="mx-auto max-w-2xl  px-4 py-4 sm:px-6 sm:pt-8 lg:h-[calc(100vh-80px)] lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {mainPhoto && (
              <div className="place-self-center	">
                <GlowingImage image={mainPhoto} />
              </div>
            )}
            <div>
              <div className="mt-10 sm:mt-16 sm:px-0 lg:mt-0">
                <h1
                  className="font-bowlby font-semibold tracking-tight text-pink-600 "
                  style={{ fontSize: "48px", lineHeight: 1 }}
                >
                  {name}
                </h1>
                <h2
                  className="font-bowlby text-white"
                  style={{ fontSize: "24px", lineHeight: "32px" }}
                >
                  {date}
                </h2>
              </div>
              <div className="mt-6 space-y-8 font-poppins">
                <div>
                  <LabeledDivider label="About" />
                  <p className="px-2 py-2 font-roboto text-white">
                    {description}
                  </p>
                </div>
                <div>
                  <LabeledDivider label="Venue" />
                  <div className="px-2 py-2">
                    <p className="tracking-tight text-white">{venue?.name}</p>
                    <Address
                      className="font-roboto text-white"
                      address={venue?.address}
                      lines={[["line1"], ["city", "region", "postalCode"]]}
                    />
                  </div>
                </div>
                <div>
                  <LabeledDivider label="Headliners" />
                  <div>
                    <ul role="list">
                      {c_artists?.slice(0, 3).map((artist) => (
                        <li
                          key={`featured_artist_${artist.name}`}
                          className="py-2"
                        >
                          <div className="flex space-x-3">
                            {artist.photoGallery?.[0] && (
                              <Image
                                className="h-6 w-6 rounded-full"
                                image={artist.photoGallery[0]}
                                layout="fixed"
                                width={48}
                                height={48}
                              />
                            )}
                            <div className="flex items-center space-y-1">
                              <h3 className="font-poppins text-sm font-medium text-white">
                                {artist.name}
                              </h3>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {/* rounded button that says "Explore the Full Lineup" */}
                    <button
                      className="mt-4 flex justify-center"
                      onClick={handleLineupClick}
                    >
                      <p className="inline-flex items-center rounded-md border border-transparent bg-pink-600 px-4 py-2 font-bowlby text-sm font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                        Explore the Full Lineup
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {c_artists && (
          <div ref={artistSectionRef}>
            <ArtistSection artists={c_artists} festivalName={name} />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MusicFestival;
