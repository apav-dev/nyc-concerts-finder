import * as React from "react";
import "../index.css";
import {
  Template,
  GetPath,
  GetHeadConfig,
  HeadConfig,
  TemplateRenderProps,
} from "@yext/pages";
import SpotifyLogin from "../spotify/SpotifyLogin";
import PageLayout from "../layouts/PageLayout";

export const getPath: GetPath<TemplateRenderProps> = () => {
  return `index.html`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Festivals Home",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

/**
 * This is the main template. It can have any name as long as it's the default export.
 * The props passed in here are the direct result from `transformProps`.
 */
const Home: Template<TemplateRenderProps> = () => {
  return (
    <PageLayout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <SpotifyLogin />
      </div>
    </PageLayout>
  );
};

export default Home;
