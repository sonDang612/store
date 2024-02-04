import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const updateUserProductCart = async ({ product }: any) => {
  const { data } = await axiosInstance.patch(`/api/users/cart`, product);
  return data;
};

export const useMutationUpdateProductCart = () => {
  const queryClient = useQueryClient();
  return useMutation(updateUserProductCart, {
    onSuccess: (cart) => {
      // message.success(`Add Product to cart user Address Successfully `);
      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        return { ...oldUser, cart };
      });
    },
  });
};
