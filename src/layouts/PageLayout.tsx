import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComplexImageType } from "@yext/pages/components";
import * as React from "react";
import Header from "../components/Header";
import { AuthProvider } from "../providers/AuthProvider";

type PageLayoutProps = {
  logo?: ComplexImageType;
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const PageLayout = ({ children, logo }: PageLayoutProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900">
          <Header logo={logo} />
          {children}
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default PageLayout;
