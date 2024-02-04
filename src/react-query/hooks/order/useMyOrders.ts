import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getMyOrders = async (query: { page: number }) => {
  const { data } = await axiosInstance.get(`/api/orders?page=${query.page}`);
  return data;
};

export const useMyOrders = (isReady: boolean, page = 1) => {
  return useQuery(
    [queryKeys.getMyOrders, { page }],
    () => getMyOrders({ page }),
    {
      onSuccess: (order) => {
        // message.success(`Get MyOrder Successfully`);
      },

      enabled: Boolean(isReady),
    },
  );
};
