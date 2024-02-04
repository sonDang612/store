/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Image, { ImageProps } from "next/image";
import React from "react";

const ImageFallBackImgTag: React.FC<ImageProps> = ({
  blurDataURL,
  ...props
}) => {
  const isImageConfig =
    (props.src as string).startsWith("http://res.cloudinary.com") ||
    (props.src as string).startsWith("/images/");
  return isImageConfig ? (
    <Image {...props} blurDataURL={blurDataURL}></Image>
  ) : (
    <img {...(props as any)} />
  );
};

export default ImageFallBackImgTag;
