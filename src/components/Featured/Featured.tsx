import { Col, Divider, Row, Spin } from "antd";
import React, { useState } from "react";

import { useListNewArrival } from "@/src/react-query/hooks/product/useListNewArrival";
import { useListTopRating } from "@/src/react-query/hooks/product/useListTopRating";

import Product from "../ProductCard/Product";

const nomalStyle =
  "inline-block text-2xl hover:text-[#1a94ff] text-gray-500 transition-colors cursor-pointer";
const clickStyle =
  "inline-block text-2xl font-bold text-gray-800 transition-colors cursor-pointer";
const Featured: React.FC<any> = ({ newArrivalRef }) => {
  const [bold, setBold] = useState(1);
  const { data: productNewArrival, isLoading: isLoadingProductNewArrival } =
    useListNewArrival(bold === 1);
  const { data: productTopRating, isLoading: isLoadingProductTopRating } =
    useListTopRating(bold === 2);

  if (isLoadingProductNewArrival || isLoadingProductTopRating) {
    return (
      <div className=" flex justify-center items-center min-h-[600px]">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="p-2" ref={newArrivalRef}>
      <div className=" ml-2">
        <h3
          className={bold === 1 ? clickStyle : nomalStyle}
          onClick={() => setBold(1)}
        >
          New Arrivals
        </h3>
        <Divider
          type="vertical"
          className=" py-3 mx-6 -mt-2 w-[0.5px] bg-gray-400"
        />
        <h3
          className={bold === 2 ? clickStyle : nomalStyle}
          onClick={() => setBold(2)}
        >
          Top Rating
        </h3>
      </div>
      <div className=" mt-10">
        <Row gutter={[10, 10]}>
          {/* {(bold === 1 ? productNewArrival : productTopRating).map( */}
          {(bold === 1 ? productNewArrival : productTopRating)?.map(
            (product: any) => {
              return (
                <Col span={4} className=" px-2" key={product._id}>
                  <Product product={product} />
                </Col>
              );
            },
          )}
        </Row>
      </div>
    </div>
  );
};

export default Featured;
