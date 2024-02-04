import { message } from "antd";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const createReview = async (review: any) => {
  const { data } = await axiosInstance.post(`/api/products/review`, review);
  return data;
};

export const useMutationCreateReview = (
  handleCancel: { (): void; (): void; (): void },
  orderId: string | string[],
  productId: { toString: () => any },
  notInOrder = false,
) => {
  const queryClient = useQueryClient();
  return useMutation(createReview, {
    onSuccess: (res) => {
      message.success(res);
      // console.log(orderId, productId, notInOrder);
      if (notInOrder) {
        queryClient.setQueryData(
          queryKeys.getProductToReview,
          (oldProductToReview: any) => {
            const newProductsItemReview = oldProductToReview.products.filter(
              (item: {
                productId: { toString: () => any };
                orderId: { toString: () => any };
              }) =>
                !(
                  item.productId.toString() === productId.toString() &&
                  item.orderId.toString() === orderId.toString()
                ),
            );

            return {
              ...oldProductToReview,
              products: [...newProductsItemReview],
            };
          },
        );
        handleCancel();
        return;
      }
      queryClient.setQueryData(
        [queryKeys.getOrderDetail, { id: orderId }],
        (oldOrder: any) => {
          const newOrderItem = oldOrder.orderItems.map(
            (item: {
              product: { toString: () => any };
              commented: boolean;
            }) => {
              if (item.product.toString() === productId.toString()) {
                item.commented = true;
              }
              return item;
            },
          );

          return { ...oldOrder, orderItems: [...newOrderItem] };
        },
      );
      handleCancel();
    },
  });
};
