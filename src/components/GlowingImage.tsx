import * as React from "react";
import { ComplexImageType, Image } from "@yext/pages/components";

type GlowingImageProps = {
  image: ComplexImageType;
};

const GlowingImage = ({ image }: GlowingImageProps) => {
  return (
    <div className="relative rounded-xl">
      <Image
        className="border-[inherit] absolute z-0 blur-lg saturate-200 before:inset-0"
        image={image}
      />
      <Image
        className="z-10 h-full w-full scale-[.98] rounded-[inherit] object-cover object-center"
        image={image}
      />
    </div>
  );
};

export default GlowingImage;
