import * as React from "react";
import { ComplexImageType, Image } from "@yext/pages/components";
import { useEffect } from "react";
import { fetch } from "@yext/pages/util";

type HeaderProps = {
  logo?: ComplexImageType;
};

const Header = ({ logo }: HeaderProps) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("tokenData")) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      console.log("tokenData: ", JSON.parse(urlParams.get("tokenData")!));
    }
  }, []);

  const handleLogin = () => {
    const currentUrl = window.location.href.split("?")[0];
    // console.log("currentUrl: ", currentUrl);
    // window.location.href = `http://localhost:8000/login?state=${currentUrl}`;
    fetch(`/login?state=${currentUrl}`);
  };

  return (
    <header className="">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          {logo && (
            <button onClick={handleLogin} className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image className="h-8 w-auto" image={logo} />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
