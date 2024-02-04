import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getUserLikeProduct = async (query: any) => {
  const { data } = await axiosInstance.get(`/api/users/likeProduct`, {
    params: { id: query.id },
  });
  return data;
};

export const useUserLikeProduct = (id: any) => {
  return useQuery(
    [queryKeys.likeProduct, { id }],
    () => getUserLikeProduct({ id }),
    // {
    //   onSuccess: (response) => {
    //     if (response.like) message.success("Liked");
    //     if (!response.like) message.success("Unlike");
    //   },
    // },
  );
};
