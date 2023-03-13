import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComplexImageType } from "@yext/pages/components";
import {
  provideHeadless,
  SearchHeadlessProvider,
} from "@yext/search-headless-react";
import * as React from "react";
import Header from "../components/Header";
import { SpotifyProvider } from "../spotify/SpotifyProvider";

type PageLayoutProps = {
  logo?: ComplexImageType;
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const searcher = provideHeadless({
  apiKey: YEXT_PUBLIC_SEARCH_API_KEY,
  experienceKey: "search",
  locale: "en",
  verticalKey: "artist",
});

const PageLayout = ({ children, logo }: PageLayoutProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchHeadlessProvider searcher={searcher}>
        <SpotifyProvider>
          <div className="min-h-screen bg-gray-900">
            <Header logo={logo} />
            {children}
          </div>
        </SpotifyProvider>
      </SearchHeadlessProvider>
    </QueryClientProvider>
  );
};

export default PageLayout;
