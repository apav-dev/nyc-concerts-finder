import * as React from "react";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";

type ArtistSectionProps = {
  artistIds: string[];
};

const ArtistSection = ({ artistIds }: ArtistSectionProps) => {
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    console.log(authState);
    console.log(artistIds);
  }, [authState, artistIds]);

  return <></>;
};

export default ArtistSection;
