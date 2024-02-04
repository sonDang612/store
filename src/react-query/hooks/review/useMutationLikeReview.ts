import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const likeReview = async (id: any) => {
  const { data } = await axiosInstance.put(`/api/review/${id}/like`, {});
  return data;
};

export const useMutationLikeReview = (
  productId: any,
  page: any,
  limit: any,
  rating: any,
) => {
  const queryClient = useQueryClient();
  return useMutation(`likeReview`, likeReview, {
    onSuccess: (review) => {
      // message.success(`Like Review Successfully`);
      queryClient.setQueryData(
        [queryKeys.getProductReview, { id: productId, page, limit, rating }],
        (oldReviews: any) => {
          // console.log("neee", oldReviews, review);
          const newReviews = oldReviews.reviews.map(
            (rv: {
              _id: { toString: () => any };
              userLiked: any[];
              numLike: any;
            }) => {
              if (rv._id.toString() === review._id.toString()) {
                rv.userLiked = [...review.userLiked];
                rv.numLike = review.numLike;
              }
              return rv;
            },
          );

          return { ...oldReviews, reviews: [...newReviews] };
        },
      );
    },
  });
};
