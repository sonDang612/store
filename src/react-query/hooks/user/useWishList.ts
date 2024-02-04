import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getWishList = async () => {
  const { data } = await axiosInstance.get(`/api/users/wishlist`);
  return data;
};

export const useWishList = () => {
  return useQuery(queryKeys.getWishList, getWishList, {
    onSuccess: (user) => {
      // message.success(`Get WishList Successfully`);
    },
  });
};
