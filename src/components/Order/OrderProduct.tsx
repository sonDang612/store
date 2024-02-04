import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Col, Input, message, Modal, Rate, Row } from "antd";
import { isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import slugify from "slugify";

import { QUESTION_PRODUCT, REVIEW_PRODUCT_STATUS, ROLE } from "@/src/constant";
import { useMutationCreateReview } from "@/src/react-query/hooks/review/useMutationCreateReview";
import { useUserAdmin } from "@/src/react-query/hooks/user/useUserAdmin";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";

import ImageFallBackImgTag from "../ImageFallBackImgTag";

const OrderProduct: React.FC<any> = ({ product, orderId, orderStatus }) => {
  const router = useRouter();
  const { data: user } = useUserData(false, false);
  const { data: userAdmin } = useUserAdmin(false);
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
    router.query.id,
    product.product,
  );
  const handleReview = () => {
    if (rating === 0) return message.info("Please give your rating");
    createReview({
      product: product.product,
      rating,
      comment: reviewText,
      orderId,
      possessed: orderStatus === "Delivered",
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
      <Row className=" py-5 px-4" gutter={[20, 0]}>
        <Col flex="0 0 34%">
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
                href={`/product/${product.product}?slug=${slugify(
                  product.name.toLowerCase(),
                )}`}
              >
                <a className="text-sm ReviewProduct">{product.name}</a>
              </Link>

              <div>
                {isEmpty(userAdmin) &&
                  !product?.commented &&
                  user?.role !== ROLE.ADMIN && (
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
        <Col flex="0 0 19%">
          {" "}
          <span className="text-sm">$ {product.price}</span>
        </Col>
        <Col flex="0 0 19%">
          <span className="pl-6 text-sm">{product.quantity}</span>
        </Col>

        <Col flex="0 0 28%">
          <h2 className=" pr-3 text-[17px] text-right">
            <span className="text-sm">
              {" "}
              $ {(product.price * product.quantity).toFixed(2)}
            </span>
          </h2>
        </Col>
      </Row>
    </div>
  );
};

export default OrderProduct;
