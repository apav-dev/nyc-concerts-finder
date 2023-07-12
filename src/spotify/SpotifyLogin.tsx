import * as React from "react";
import { useSpotifyActions } from "./useSpotifyActions";

const SpotifyLogin = () => {
  const spotifyActions = useSpotifyActions();

  const handleLoginClick = () => {
    spotifyActions.login();
  };

  return (
    <div className="h-96 w-full rounded-xl bg-white opacity-90">
      <div className="bg-backgroundGray flex flex-col items-center p-20">
        <div className="rounded-3xl bg-[#44c767] p-4">
          <button className="text-white " onClick={() => handleLoginClick()}>
            Login with Spotify
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpotifyLogin;
