import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const deleteWishList = async ({ productId }: { productId: string }) => {
  const { data } = await axiosInstance.delete(
    `/api/products/${productId}/wishlist`,
  );
  return data;
};

export const useMutationDeleteWishList = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation(deleteWishList, {
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.getWishList, (oldWishList: any) => {
        return {
          ...oldWishList,
          products: oldWishList.products.filter(
            (pd: any) => pd._id.toString() !== productId.toString(),
          ),
        };
      });
    },
  });
};
