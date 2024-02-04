import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getLatestOrders = async () => {
  const { data } = await axiosInstance.get(`/api/admin/orders/latest`);
  return data;
};

export const useLatestOrder = () => {
  return useQuery(queryKeys.getLatestOrders, getLatestOrders, {
    onSuccess: (order) => {
      // message.success(`Get MyOrder Successfully`);
    },
  });
};
