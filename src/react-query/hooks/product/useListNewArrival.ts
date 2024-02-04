import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getProductsNewArrival = async () => {
  const { data } = await axiosInstance.get(`/api/products/new`);
  return data;
};

export const useListNewArrival = (enabled: boolean) => {
  return useQuery([queryKeys.getProductsNewArrival], getProductsNewArrival, {
    onSuccess: (products) => {
      // message.success(`Get List New Arrival Product Discount Successfully`);
    },

    enabled,
  });
};
