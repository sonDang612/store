import { Col, Rate, Row } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import slugify from "slugify";

import { useMutationDeleteWishList } from "@/src/react-query/hooks/user/useMutationDeleteWishList";

import ImageFallBackImgTag from "../ImageFallBackImgTag";

const WishListCard: React.FC<any> = ({ product, i }) => {
  const router = useRouter();
  const { mutate: deleteWishList } = useMutationDeleteWishList(product._id);
  const handleDelete = () => {
    deleteWishList({ productId: product._id });
  };
  const handleViewProduct = () => {
    router.push(
      `/product/${product?.id}?slug=${slugify(product?.name.toLowerCase())}`,
    );
  };
  return (
    <div className="pt-4 pr-20 pl-5">
      <Row gutter={[10, 0]}>
        <Col flex="0 0 200px">
          <div
            className="text-center cursor-pointer"
            onClick={handleViewProduct}
          >
            <ImageFallBackImgTag
              src={product.image[0]}
              alt={product.image[0]}
              width={130}
              height={130}
            ></ImageFallBackImgTag>
          </div>
        </Col>
        <Col flex="0 0 450px" className=" space-y-2">
          <div className="mt-3">
            <h2
              className=" hover:text-blue-400 hover:underline cursor-pointer"
              onClick={handleViewProduct}
            >
              {product.name}
            </h2>
          </div>
          <div className="space-x-5">
            <span>
              <Rate
                disabled
                allowHalf
                value={product.averageRating}
                style={{ fontSize: 12 }}
              />
            </span>
            <span>{product.numReviews} comments</span>
          </div>
        </Col>
        <Col flex="1" className=" pr-9 text-right">
          {product.discount > 0 ? (
            <div className=" flex flex-col items-end space-y-3">
              <h4
                className="text-base font-medium"
                style={{ color: "#ff424e" }}
              >
                $ {product.currentPrice.toFixed(2)}
              </h4>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500 line-through">
                  $ {product.price.toFixed(2)}
                </span>
                <span className="inline-block w-[1px] h-3 bg-gray-500"></span>

                <span
                  className=" block px-[1px] mt-[-2px] text-[11px] bg-red-50 border-[1px] border-red-300 border-solid"
                  style={{ color: "#ff424e" }}
                >
                  {`-${product.discount}%`}
                </span>
              </div>
            </div>
          ) : (
            <span className=" text-base font-medium">$ {product.price}</span>
          )}
          <div
            className={
              i === 0
                ? "absolute -top-3 -right-14 text-3xl font-normal text-gray-400 cursor-pointer"
                : "absolute -top-6 -right-14 text-3xl font-normal text-gray-400 cursor-pointer"
            }
            onClick={handleDelete}
          >
            ×
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default WishListCard;
