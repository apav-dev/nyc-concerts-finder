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
import { ComplexImageType, Image } from "@yext/pages/components";
import ArtistSection from "../components/ArtistSection";
import MusicPlayer from "../components/MusicPlayer";

export const config: TemplateConfig = {
  stream: {
    $id: "concerts",
    fields: [
      "id",
      "name",
      "c_datetimeUtc",
      "c_venue.name",
      "c_venue.address",
      "c_artists.name",
      "c_artists.photoGallery",
      "c_artists.c_spotifyId",
      "slug",
    ],
    filter: {
      entityTypes: ["ce_concert"],
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
  relativePrefixToRoot,
  path,
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

// TODO: strongly type everything
const Concert: Template<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}: TemplateRenderProps) => {
  const { name, _site, c_datetimeUtc } = document;

  const artistImage: ComplexImageType | undefined =
    document.c_artists?.[0].photoGallery?.[0];
  const venue = document.c_venue?.[0];

  // c_datetimeUtc is a string in the format "2023-03-02T01:00:00". Convert to string in the form of "March 2, 2023 at 1:00 AM" but convert from utc to local time
  const formatedDate = new Date(c_datetimeUtc).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });

  return (
    <PageLayout logo={_site.c_logo}>
      {artistImage && (
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <div className="aspect-w-1 aspect-h-1 w-full">
              <Image
                className="h-full w-full object-cover object-center sm:rounded-lg"
                image={artistImage}
              />
            </div>
            <div>
              <div className="mt-10 sm:mt-16 sm:px-0 lg:mt-0">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {name}
                </h1>
              </div>
              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                {/* TODO: Turn into link to location page  */}
                <p className="tracking-tight text-white">{venue?.name}</p>
                <p className="tracking-light text-white">{formatedDate}</p>
              </div>
              {/* divider component */}
              <div className="mt-10">
                <h2 className="text-sm font-medium uppercase tracking-wide text-gray-400">
                  Artists
                </h2>
                {document.c_artists && (
                  <div className="mt-4">
                    <ArtistSection artists={document.c_artists} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <MusicPlayer />
    </PageLayout>
  );
};

export default Concert;
