/* eslint-disable @next/next/no-img-element */
import { Rate } from "antd";
import { useRouter } from "next/router";
import React from "react";

import ImageFallBackImgTag from "../ImageFallBackImgTag";
// import { blurImage } from "@/utils/blurImage";

const Product: React.FC<any> = ({ product }) => {
  const router = useRouter();
  const onClickHandler = () => {
    router.push(`/product/${product.id}?slug=${product.slug}`);
  };

  return (
    <div
      className="bg-white rounded-lg cursor-pointer featuredProductHover"
      onClick={onClickHandler}
    >
      <div className=" px-4">
        <div className="text-center">
          <ImageFallBackImgTag
            src={product?.image[0]}
            alt={product?.image[0]}
            width={170}
            height={170}
            placeholder="blur"
            blurDataURL="/images/blur.PNG"
            // blurDataURL={blurImage}
          />
        </div>
        <div>
          <div className=" flex-col justify-between py-3">
            <h3 className=" min-h-[43.2px] text-[15px] text-left featureProduct">
              {product.name}
            </h3>

            <div className=" flex justify-between pr-5">
              <div>
                <Rate
                  allowHalf
                  value={product.averageRating}
                  disabled
                  style={{ fontSize: 12 }}
                />
              </div>

              <div className="mt-1 text-[11px] text-gray-500">
                {product.numReviews} Reviews
              </div>
            </div>
            {product.discount ? (
              <div className=" flex justify-between items-center pr-5">
                <div>
                  <div className="mt-1 text-red-500">
                    <div className="flex items-center">
                      <span className="mr-3 font-bold">
                        {`$ ${product.currentPrice}`}{" "}
                      </span>

                      <span className="block px-[1px] mt-[-2px] text-[11px] bg-red-50 border-[1px] border-red-300 border-solid">
                        -{product.discount}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-1 text-[11px] text-gray-500">
                  sold {product.sold}
                </div>
              </div>
            ) : (
              <div className=" flex justify-between items-center pr-5">
                <div>
                  <div className="mt-1 text-base font-bold">
                    $ {product.currentPrice}
                  </div>
                </div>

                <div className="mt-1 text-[11px] text-gray-500">
                  sold {product.sold}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
