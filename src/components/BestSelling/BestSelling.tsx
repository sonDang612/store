/* eslint-disable @next/next/no-img-element */
import { Rate, Spin } from "antd";
import React from "react";

import { useNextQueryParams } from "@/hook/useNextQueryParams";
import { useListBestSelling } from "@/src/react-query/hooks/product/useListBestSelling";

import ImageFallBackImgTag from "../ImageFallBackImgTag";
import ProductBestSelling from "./ProductBestSelling";

const BestSelling = () => {
  const { data: bestSellProductData, isLoading } = useListBestSelling();
  const router = useNextQueryParams();

  const onClickHandler = (product: any) => {
    router.push(`/product/${product.id}?slug=${product.slug}`);
  };

  return (
    <div className="">
      <h3 className="mt-10 ml-2 text-2xl font-semibold">
        Best Selling Products
      </h3>
      <Spin tip="Loading..." spinning={isLoading}>
        <div className="overflow-hidden p-2 mt-3 min-h-[500px]">
          <div className=" grid grid-cols-3 grid-rows-3 grid-flow-col gap-x-7 gap-y-[19px]">
            {!isLoading &&
              bestSellProductData?.map((product: any, i: any) => {
                if (i === 0) {
                  return (
                    <div
                      key={i}
                      className=" row-span-3"
                      onClick={() => onClickHandler(product)}
                    >
                      <div className="px-8 bg-white rounded-lg border-[1px] border-gray-200 cursor-pointer hoverBestSelling">
                        <div className="text-center">
                          <ImageFallBackImgTag
                            src={product.image[0]}
                            alt={product.image[0]}
                            width={300}
                            height={300}
                            placeholder="blur"
                            blurDataURL="/images/blur.PNG"
                          />
                        </div>
                        <div className="p-4 mt-0">
                          <div className=" text-xs text-gray-400 uppercase">
                            {product.category}
                          </div>

                          <h3 className=" min-h-[59.2px] text-[20px] text-left nameBestSelling">
                            {product.name}
                          </h3>

                          <div className=" flex justify-between">
                            <div>
                              <Rate
                                allowHalf
                                value={product.averageRating}
                                disabled
                                style={{ fontSize: 15 }}
                                //  style={{ fontSize: 14, color: "red" }}
                              />
                            </div>

                            <div> {product.numReviews} Reviews</div>
                          </div>
                          <div className=" flex justify-between mt-1">
                            <div
                              // className=" flex items-center space-x-3 text-lg font-bold"
                              className={
                                product.discount > 0
                                  ? " flex items-center space-x-3 text-lg font-bold text-red-500"
                                  : " flex items-center space-x-3 text-lg font-bold"
                              }
                            >
                              <div> $ {product.currentPrice}</div>
                              {product.discount > 0 && (
                                // <Tag color="red">
                                //    -{product.discount}%
                                // </Tag>
                                <span className="px-[1px] mt-[-2px] text-[11px] leading-4 bg-red-50 border-[1px] border-red-300 border-solid">
                                  -{product.discount}%
                                </span>
                              )}
                            </div>
                            <div> Sold {product.sold}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={i} onClick={() => onClickHandler(product)}>
                    <ProductBestSelling product={product} />
                  </div>
                );
              })}
          </div>{" "}
        </div>
      </Spin>
    </div>
  );
};

export default BestSelling;
