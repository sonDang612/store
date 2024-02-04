import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getProductToReview = async () => {
  const { data } = await axiosInstance.get(`/api/users/reviews`);
  return data;
};

export const useProductsToReview = () => {
  return useQuery(
    queryKeys.getProductToReview,

    getProductToReview,
    {
      onSuccess: (user) => {
        // message.success(`Get UserDate ${user.name} Successfully`);
      },
    },
  );
};
