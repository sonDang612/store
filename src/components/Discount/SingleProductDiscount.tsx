/* eslint-disable @next/next/no-img-element */

import React from "react";

import ImageFallBackImgTag from "../ImageFallBackImgTag";
// ₫
const SingleProductDiscount: React.FC<any> = ({ image, price, discount }) => {
  return (
    <div>
      <div className="p-6">
        <ImageFallBackImgTag
          src={image}
          alt={image}
          width={190}
          height={190}
          placeholder="blur"
          blurDataURL="/images/blur.PNG"
        />
      </div>
      <div className="text-red-500">
        <div className="flex items-center">
          <span className="mr-3 font-bold">{`$ ${price}`} </span>
          <span className="block px-[1px] mt-[-2px] text-[11px] bg-red-50 border-[1px] border-red-300 border-solid">
            -{discount}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default SingleProductDiscount;
