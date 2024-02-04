import { message } from "antd";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const toggleWishList = async ({ productId }: { productId: string }) => {
  const { data } = await axiosInstance.put(
    `/api/products/${productId}/wishlist`,
    {},
  );
  return data;
};

// export const useMutationToggleWishList = (productId, isLiked, isDelete) => {
export const useMutationToggleWishList = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation(toggleWishList, {
    onSuccess: (result) => {
      let newLike = false;
      queryClient.setQueryData(
        [queryKeys.likeProduct, { id: productId }],
        (oldLike: any) => {
          newLike = !oldLike.like;
          // console.log(oldProductDetail);
          return {
            like: newLike,
          };
        },
      );

      if (newLike) message.success("Liked");
      if (!newLike) message.success("Unlike");
      // setVisible(false);
    },
  });
};
