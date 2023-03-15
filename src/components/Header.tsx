import * as React from "react";
import { ComplexImageType, Image } from "@yext/pages/components";

type HeaderProps = {
  logo?: ComplexImageType;
};

const Header = ({ logo }: HeaderProps) => {
  return (
    <header className="">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          {logo && (
            <div className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image className="h-8 w-auto" image={logo} />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
