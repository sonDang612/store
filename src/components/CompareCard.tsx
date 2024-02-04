/* eslint-disable @next/next/no-img-element */
import { Rate } from "antd";
import { useRouter } from "next/router";
import React from "react";

const CompareCard = ({ product }: any) => {
  const router = useRouter();
  return (
    <div
      className="p-3 cursor-pointer"
      onClick={() => {
        router.push(`/product/${product._id}?slug=${product.slug}`);
      }}
    >
      <img src={product.image[0]} alt={product.image[0]} width={"40%"} />
      <p>{product.name}</p>
      {product.discount ? (
        <div className="text-red-500">
          <div className="flex items-center">
            <span className="mr-3 font-bold">
              {`$ ${product.currentPrice}`}{" "}
            </span>
            <span className="block px-[1px] mt-[-2px] text-[11px] bg-red-50 border-[1px] border-red-300 border-solid">
              -{product.discount}%
            </span>
          </div>
        </div>
      ) : (
        <div>{`$ ${product.currentPrice}`} </div>
      )}

      <div>
        <Rate
          allowHalf
          value={product.averageRating}
          style={{ fontSize: 15 }}
          disabled
          //  style={{ fontSize: 14, color: "red" }}
        />
      </div>
      <div>Sold: {product.sold}</div>
    </div>
  );
};

export default CompareCard;
