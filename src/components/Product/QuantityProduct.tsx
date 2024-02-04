import {
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useMutationAddProductToCart } from "@/src/react-query/hooks/user/useMutationAddProductToCart";
import { useMutationToggleWishList } from "@/src/react-query/hooks/user/useMutationToggleWishList";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { useUserLikeProduct } from "@/src/react-query/hooks/user/useUserLikeProduct";
import { useActions } from "@/src/redux/useActions";
import isEmpty from "@/utils/is-empty";

const QuantityProduct: React.FC<any> = ({ product }) => {
  const actions = useActions();
  const [quantity, setQuantity] = useState(1);

  const { data: user } = useUserData(false, false);
  const { data: productLiked } = useUserLikeProduct(product.id as string);
  const { mutate: addProductToCart, isLoading: isLoadingAddProductToCart } =
    useMutationAddProductToCart();
  const { mutate: toggleWishList, isLoading: isLoadingToggleWishList } =
    useMutationToggleWishList(product.id as string);
  const onHandleChangeNumeric = (e: any) => {
    const { value } = e.target;

    if (!Number(value)) {
      return;
    }

    setQuantity(Number(value));
  };
  const handleAddToCart = () => {
    // if (isEmpty(queryClient.getQueryData(queryKeys.getUserData))) {
    if (isEmpty(user)) {
      actions.showModalLogin();
      return;
    }

    if (quantity > product.countInStock) {
      message.info(
        `${product.name} only have ${product.countInStock} products left `,
      );
      return;
    }
    const productAdd = {
      // productId: product._id
      product: product._id,
      errorMessage: `${product.name} only have ${product.countInStock} products left `,
      countInStock: product.countInStock,
      quantity,
    };
    // message.info(JSON.stringify(productAdd, null, 2));
    addProductToCart({
      product: productAdd,
    });
  };
  return (
    <>
      {product.countInStock > 0 && (
        <>
          <h3 className=" !mt-2 text-base">Quantity</h3>
          <div className="flex items-center !mt-2">
            <Button
              type="default"
              className=" flex justify-center items-center px-2 text-center rounded-none"
              disabled={quantity === 1}
              onClick={() => setQuantity((value) => value - 1)}
            >
              <img src="/images/minus.svg" alt="minus" />
            </Button>

            <Input
              className="w-11 h-[32px] text-center rounded-none"
              value={quantity}
              onChange={onHandleChangeNumeric}
            />
            <Button
              type="default"
              className="flex justify-center items-center px-2 text-center rounded-none"
              onClick={() => setQuantity((value) => value + 1)}
            >
              <img src="/images/plus.svg" alt="plus" />
            </Button>
          </div>
          <div className="flex">
            <Button
              danger
              type="primary"
              className="flex items-center rounded-sm"
              size="large"
              disabled={isLoadingAddProductToCart}
              icon={<ShoppingCartOutlined style={{ fontSize: 21 }} />}
              onClick={handleAddToCart}
            >
              Add to card
            </Button>
            <Button
              //    type="text"
              type="text"
              danger={productLiked?.like || false}
              className="flex items-center space-x-2 rounded-sm"
              size="large"
              disabled={isLoadingToggleWishList}
              onClick={() => {
                if (isEmpty(user)) {
                  actions.showModalLogin();
                  return;
                }
                toggleWishList({
                  productId: product.id as string,
                });
              }}
            >
              {productLiked?.like ? (
                <HeartFilled
                  style={{
                    fontSize: 21,
                    color: "#ff4d4f",
                  }}
                />
              ) : (
                <HeartOutlined style={{ fontSize: 21 }} />
              )}
              <div className="-mt-[2px]"> Like</div>
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default QuantityProduct;
