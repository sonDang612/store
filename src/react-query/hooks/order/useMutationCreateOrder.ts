import { message } from "antd";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";

const createOrder = async ({ order }: { order: any }) => {
  const { data } = await axiosInstance.post(`/api/orders`, order);
  return data;
};

export const useMutationCreateOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const actions = useActions();
  return useMutation(createOrder, {
    onSuccess: (order) => {
      message.success(`Create order Successfully `);
      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        const cart = oldUser.cart.filter((product: any) => !product.check);
        return { ...oldUser, cart };
      });
      actions.setCouponReducer({});

      router.replace(`/customer/order/success?id=${order._id}`);
    },
  });
};
