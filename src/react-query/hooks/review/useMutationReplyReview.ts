import { useMutation, useQueryClient } from "react-query";

import { axiosInstance, axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";

const replyReview = async ({ id, comment, isAdmin }: any) => {
  const axios = isAdmin ? axiosInstanceAdmin : axiosInstance;

  const { data } = await axios.put(`/api/review/${id}/reply`, {
    comment,
  });
  return data;
};

export const useMutationReplyReview = (
  productId: any,
  reviewId: any,
  page: any,
  limit: any,
  rating: any,
  isAdmin: boolean = false,
) => {
  const queryClient = useQueryClient();
  const actions = useActions();
  return useMutation(`replyReview`, replyReview, {
    onSuccess: (review) => {
      // message.success(`Like Review Successfully`);

      if (isAdmin) {
        actions.setAdminReviewState({
          responseText: "",
          isModalVisible: false,
        });
        return;
      }
      queryClient.setQueryData(
        [queryKeys.getProductReview, { id: productId, page, limit, rating }],
        (oldReviews: any) => {
          const newReviews = oldReviews.reviews.map(
            (rv: { _id: { toString: () => any }; responseReview: any[] }) => {
              if (rv._id.toString() === reviewId.toString()) {
                rv.responseReview = [
                  { ...review, active: true },
                  ...rv.responseReview,
                ];
                // rv.responseReview = [...rv.responseReview, review];
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
