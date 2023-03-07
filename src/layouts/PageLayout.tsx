import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComplexImageType } from "@yext/pages/components";
import * as React from "react";
import Header from "../components/Header";
import { SpotifyProvider } from "../spotify/SpotifyProvider";

type PageLayoutProps = {
  logo?: ComplexImageType;
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const PageLayout = ({ children, logo }: PageLayoutProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SpotifyProvider>
        <div className="min-h-screen bg-gray-900">
          <Header logo={logo} />
          {children}
        </div>
      </SpotifyProvider>
    </QueryClientProvider>
  );
};

export default PageLayout;
