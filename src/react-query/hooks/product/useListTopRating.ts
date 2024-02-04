import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getProductsTopRating = async () => {
  const { data } = await axiosInstance.get(`/api/products/toprating`);
  return data;
};

export const useListTopRating = (enabled: boolean) => {
  return useQuery([queryKeys.getProductsTopRating], getProductsTopRating, {
    onSuccess: (products) => {
      // message.success(`Get List Top Rating Products Successfully`);
    },

    enabled,
  });
};
