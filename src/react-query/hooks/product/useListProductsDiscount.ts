import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getProductsDiscount = async () => {
  const { data } = await axiosInstance.get(`/api/products/discount`);
  return data;
};

export const useListProductsDiscount = () => {
  return useQuery([queryKeys.getProductsDiscount], getProductsDiscount, {
    onSuccess: (products) => {
      // message.success(`Get List Product Discount Successfully`);
    },
  });
};
