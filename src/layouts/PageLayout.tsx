import { ComplexImageType } from "@yext/pages/components";
import * as React from "react";
import Header from "../components/Header";

type PageLayoutProps = {
  logo?: ComplexImageType;
  children: React.ReactNode;
};

const PageLayout = ({ children, logo }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header logo={logo} />
      {children}
    </div>
  );
};

export default PageLayout;
