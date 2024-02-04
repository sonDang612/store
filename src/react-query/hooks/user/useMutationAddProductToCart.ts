import { message } from "antd";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const addUserProductCart = async ({ product }: any) => {
  const { data } = await axiosInstance.post(`/api/users/cart`, product);
  return data;
};

export const useMutationAddProductToCart = () => {
  const queryClient = useQueryClient();
  return useMutation(addUserProductCart, {
    onSuccess: (cart) => {
      // message.success(`Add Product to cart user Address Successfully `);
      message.success("Add to cart successfully!");

      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        return { ...oldUser, cart };
      });
    },
    onError(e: any) {
      if (e?.message.includes("only have")) {
        message.info(e?.message);
      }
    },
  });
};
