import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getProductsBestSelling = async () => {
  const { data } = await axiosInstance.get(`/api/products/bestselling`);
  return data;
};

export const useListBestSelling = () => {
  return useQuery([queryKeys.getProductsBestSelling], getProductsBestSelling, {
    onSuccess: (products) => {
      // message.success(`Get List Best Selling Product Discount Successfully`);
    },
  });
};
