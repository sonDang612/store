import { Col, Row, Spin } from "antd";
import Image from "next/image";
import React from "react";

import isEmpty from "@/utils/is-empty";

import ImageFallBackImgTag from "../ImageFallBackImgTag";

const ProductPayment: React.FC<any> = ({ product }) => {
  if (isEmpty(product?.product?._id)) {
    return (
      <div className="flex justify-center items-center h-[85px]">
        <Spin size="small" />
      </div>
    );
  }
  return (
    <div className=" p-3">
      <Row
        align="middle"
        gutter={[10, 0]}
        justify="space-between"
        className="px-2 rounded-sm border-[1px] border-gray-200 border-solid"
      >
        <Col
          flex="100px"
          className="!p-0 border-[1px] border-gray-100 border-solid"
        >
          <ImageFallBackImgTag
            src={product.product.image[0]}
            alt={product.product.image[0]}
            width={80}
            height={80}
          />
        </Col>
        <Col flex="450px" className="">
          <div className=" text-sm smallProductCart">
            {product.product.name}
          </div>
        </Col>
        <Col flex="70px" className="">
          <div className=" text-sm">x{product.quantity}</div>
        </Col>
        <Col flex="180px" className="">
          <div className=" mr-4 text-base font-medium text-right">
            $ {(product.product.currentPrice * product.quantity).toFixed(2)}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPayment;
