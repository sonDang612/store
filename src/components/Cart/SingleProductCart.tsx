/* eslint-disable @next/next/no-img-element */
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Input, message, Modal, Row, Spin } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import slugify from "slugify";

import { useMounted } from "@/hook/useMounted";
import { useMutationDeleteProductCart } from "@/src/react-query/hooks/user/useMutationDeleteProductCart";
import { useMutationUpdateProductCart } from "@/src/react-query/hooks/user/useMutationUpdateProductCart";
import isEmpty from "@/utils/is-empty";

import ImageFallBackImgTag from "../ImageFallBackImgTag";

const ProductCart: React.FC<any> = ({ product }) => {
  const [quantity, setQuantity] = useState(product.quantity);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { hasMounted } = useMounted();
  const router = useRouter();
  const { mutate: deleteProductCart } = useMutationDeleteProductCart();
  const {
    mutate: updateProductToCart,
    // isLoading: isLoadingUpdateProductToCart,
    // isSuccess: isSuccessUpdateProductToCart,
  } = useMutationUpdateProductCart();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    deleteProductCart({
      id: product.product._id,
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onHandleChangeNumeric = (e: any) => {
    const { value } = e.target;

    if (value === "") {
      return setQuantity("");
    }
    if (!Number(value)) {
      return;
    }

    setQuantity(value);
  };
  const onClickHandler = () => {
    const slugProduct = slugify(product.product.name.toLowerCase());

    router.push(`/product/${product.product.id}?slug=${slugProduct}`);
  };

  const handleChangeCheckProduct = () => {
    const productUpdate = {
      product: product.product._id,
      check: !product.check,
    };
    updateProductToCart({
      product: productUpdate,
    });
  };
  useEffect(() => {
    if (!hasMounted) return;
    if (quantity >= product.product.countInStock) {
      setQuantity(product.product.countInStock);
      return message.info(
        `${product.product.name} only have  ${product.product.countInStock} products left `,
      );
    }
    const timer1 = setTimeout(() => {
      const productUpdate = {
        product: product.product._id,
        quantity,
      };

      // message.info(JSON.stringify(productUpdate, null, 2));
      updateProductToCart({
        product: productUpdate,
      });
      console.count("run Trong");
    }, 1000);

    // this will clear Timeout
    // when component unmount like in willComponentUnmount
    // and show will not change to true
    return () => {
      clearTimeout(timer1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity]);

  if (isEmpty(product?.product?._id)) {
    return (
      <div className="flex justify-center items-center h-[85px]">
        <Spin size="small" />
      </div>
    );
  }
  return (
    <div>
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        // centered
      >
        <p>You want to delete this product?</p>
      </Modal>
      <Row align="middle">
        <Col flex="398px">
          <Row align="middle" gutter={[20, 0]}>
            <Col flex="30px">
              {" "}
              <Checkbox
                checked={product.check}
                onChange={handleChangeCheckProduct}
              />
            </Col>
            <Col
              flex="80px"
              className="!p-0 border-[1px] border-gray-100 border-solid"
            >
              <ImageFallBackImgTag
                src={product.product.image[0]}
                alt={product.product.image[0]}
                width={78}
                height={78}
                className="cursor-pointer"
                onClick={onClickHandler}
              />
            </Col>
            <Col flex="260px" className="">
              <div
                className=" text-xs cursor-pointer smallProductCart"
                onClick={onClickHandler}
              >
                {product.product.name}
              </div>
            </Col>
          </Row>
        </Col>
        <Col flex="150px">
          <h2
            className={
              product.product.discount > 0
                ? "font-medium text-red-500"
                : "font-medium"
            }
          >
            $ {product.product.currentPrice?.toFixed(2)}
          </h2>
        </Col>
        <Col flex="160px">
          <div className=" flex items-center -ml-2">
            <Button
              type="default"
              className=" flex justify-center items-center px-1 w-6 h-6 text-center rounded-none"
              // disabled={Number(quantity) === 1}
              onClick={() => {
                if (quantity === 1) {
                  return showModal();
                }
                setQuantity((value: any) => Number(value) - 1);
              }}
            >
              <img src="/images/minus.svg" alt="minus" />
            </Button>

            <Input
              className="w-10 h-6 text-center rounded-none"
              value={quantity}
              onChange={onHandleChangeNumeric}
              onBlur={() => {
                if (quantity === "") setQuantity(1);
                else setQuantity(quantity);
              }}
            />
            <Button
              type="default"
              disabled={quantity >= product.product.countInStock}
              className=" flex justify-center items-center px-1 w-6 h-6 text-center rounded-none"
              onClick={() => setQuantity((value: any) => Number(value) + 1)}
            >
              <img src="/images/plus.svg" alt="plus" />
            </Button>
          </div>
        </Col>
        <Col flex="145px">
          <h2 className="font-medium text-red-500">
            ${" "}
            {(
              Number(product.quantity) * Number(product.product.currentPrice)
            )?.toFixed(2)}
          </h2>
        </Col>
        <Col flex="40px">
          <div className="ml-2 cursor-pointer" onClick={showModal}>
            <DeleteOutlined />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductCart;
