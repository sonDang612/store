import { message } from "antd";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import isEmpty from "@/utils/is-empty";

const deleteUserProductCart = async ({ id }: any) => {
  const { data } = await axiosInstance.delete(`/api/users/cart/${id}`);
  return data;
};

export const useMutationDeleteProductCart = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteUserProductCart, {
    onMutate: async (data) => {
      await queryClient.cancelQueries(queryKeys.getUserData);
      const current = queryClient.getQueryData(queryKeys.getUserData);

      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        let newCart;
        if (isEmpty(data.id)) {
          newCart = oldUser.cart.filter((product: any) => !product.check);
        } else {
          newCart = oldUser.cart.filter(
            (product: any) =>
              product.product._id.toString() !== data.id.toString(),
          );
        }
        return { ...oldUser, cart: newCart };
      });

      return { current };
    },
    onSuccess: (cart) => {
      // message.success(`Delete Product in cart user Address Successfully `);
      // queryClient.setQueryData(queryKeys.getUserData, (oldUser) => {
      //    return { ...oldUser, cart };
      // });
    },
    onError: (err: any, _, context: any) => {
      message.error(`Error ${err.message}`);
      queryClient.setQueryData(queryKeys.getUserData, { ...context.current });
    },
  });
};
