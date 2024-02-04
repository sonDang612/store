import { CheckCircleFilled, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Modal, Rate, Row, Tag } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import slugify from "slugify";

import {
  ORDER_STATUS_COLOR,
  QUESTION_PRODUCT,
  REVIEW_PRODUCT_STATUS,
} from "@/src/constant";
import { useMutationCreateReview } from "@/src/react-query/hooks/review/useMutationCreateReview";

import ImageFallBackImgTag from "../ImageFallBackImgTag";

const ReviewProduct: React.FC<any> = ({ product }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setRating(0);
  };
  const { mutate: createReview, isLoading } = useMutationCreateReview(
    handleCancel,
    product.orderId,
    product.productId,
    true,
  );
  const handleReview = () => {
    if (rating === 0) return message.info("Please give your rating");
    createReview({
      product: product.productId,
      rating,
      comment: reviewText,
      orderId: product.orderId,
      possessed: product.orderStatus === "Delivered",
    });
  };

  return (
    <div className="hover:bg-[#f6fcff]">
      <Modal
        // title="Review Product"
        open={isModalVisible}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null}
        centered
        className=" rounded-md"
      >
        <div className="space-y-3">
          <div className=" flex items-center space-x-4">
            <div>
              <ImageFallBackImgTag
                src={product.image}
                alt={product.image}
                width={50}
                height={50}
              ></ImageFallBackImgTag>
            </div>

            <h3 className="text-xs text-gray-600">{product.name}</h3>
          </div>
          <h3 className="text-lg text-center">
            {REVIEW_PRODUCT_STATUS[rating]}
          </h3>
          <div className="text-center">
            <Rate
              value={rating}
              defaultValue={0}
              onChange={(value) => setRating(value)}
              style={{ fontSize: 28 }}
            />
          </div>
          <div>
            <Input.TextArea
              rows={4}
              placeholder={QUESTION_PRODUCT[rating]}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          {reviewText && (
            <div className="flex justify-between items-center">
              <h2 className="text-[13px]" style={{ color: "#0B74E5" }}>
                You're helping people shop better!
              </h2>{" "}
              <div className="">
                <CheckCircleFilled
                  className=" text-xl"
                  style={{ color: "#009900" }}
                />
              </div>
            </div>
          )}
          <Button
            type="primary"
            block
            shape="round"
            onClick={handleReview}
            loading={isLoading}
          >
            Send Review
          </Button>
        </div>
      </Modal>
      <Row className=" py-3 px-4">
        <Col flex="0 0 400px">
          <div className="flex space-x-2">
            <div style={{ flex: "0 0 80px" }}>
              <Image
                src={product.image}
                alt={product.image}
                width={80}
                height={80}
              />
            </div>
            <div className=" flex flex-col mt-1 space-y-2">
              <Link
                href={`/product/${product.productId}?slug=${slugify(
                  product.name.toLowerCase(),
                )}`}
              >
                <a className="text-xs ReviewProduct">{product.name}</a>
              </Link>

              <div>
                {!product?.commented && (
                  <Button
                    type="default"
                    className=" text-[#1a94ff] rounded-md border-[#1a94ff]"
                    onClick={showModal}
                  >
                    Write a review
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Col>
        <Col flex="0 0 170px" className="pl-3">
          <Tag color="geekblue">
            $ {(product.price * product.quantity).toFixed(2)}
          </Tag>
        </Col>
        <Col flex="0 0 155px">
          <Tag
            color={ORDER_STATUS_COLOR[product.orderStatus]}
            className="capitalize"
          >
            <span className=" text-xs">{product.orderStatus}</span>
          </Tag>
        </Col>

        <Col flex="0 0 100px">
          <h2 className=" pr-3 text-[17px] text-right">
            <Link href={`/customer/order/${product.orderId}`} passHref>
              <SearchOutlined style={{ fontSize: "20px", color: "#0b74e5" }} />
            </Link>
          </h2>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewProduct;
