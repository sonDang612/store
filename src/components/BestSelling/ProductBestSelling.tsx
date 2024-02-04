/* eslint-disable @next/next/no-img-element */
import { Rate } from "antd";
import React from "react";

import ImageFallBackImgTag from "../ImageFallBackImgTag";

const ProductBestSelling: React.FC<any> = ({ product }) => {
  return (
    <div className=" flex p-2 h-full bg-white rounded-lg border-[1px] border-gray-200 cursor-pointer hoverBestSelling">
      <div className="self-center w-[150px] text-center">
        {/* <img
               src={product.image[0]}
               alt={product.image[0]}
               className="w-[110px]"
            /> */}
        <ImageFallBackImgTag
          src={product.image[0]}
          alt={product.image[0]}
          width={110}
          height={110}
          placeholder="blur"
          blurDataURL="/images/blur.PNG"
        />
      </div>
      <div className=" flex-col justify-between py-3 w-[200px]">
        <h3 className=" text-[13px] text-left nameBestSelling">
          {product.name}
        </h3>
        <div className="flex justify-between pr-5">
          <div>
            <Rate
              allowHalf
              value={product.averageRating}
              disabled
              style={{ fontSize: 10 }}
              //  style={{ fontSize: 14, color: "red" }}
            />
          </div>

          <div className="mt-1 text-[11.5px]">{product.numReviews} Reviews</div>
        </div>
        <div className="flex justify-between items-center">
          <div
            className={
              product.discount > 0
                ? " mt-1 text-lg font-bold text-red-500 flex space-x-2 items-center"
                : " mt-1 text-lg font-bold"
            }
          >
            <span> $ {product.currentPrice}</span>
            {product.discount > 0 && (
              <span className="px-[1px] mt-[-2px] text-[11px] leading-4 bg-red-50 border-[1px] border-red-300 border-solid">
                -{product.discount}%
              </span>
            )}
          </div>
          <div className="mt-1 mr-4 text-[11.5px]">Sold {product.sold}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductBestSelling;
