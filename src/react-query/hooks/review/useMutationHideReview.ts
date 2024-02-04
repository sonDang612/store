import { message } from "antd";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const hideReview = async (id: any) => {
  const { data } = await axiosInstanceAdmin.put(`/api/review/${id}/hide`, {});
  return data;
};

export const useMutationHideReview = ({ page, search, rating }: any) => {
  const queryClient = useQueryClient();
  return useMutation(`hideReview`, hideReview, {
    onSuccess: (response) => {
      queryClient.invalidateQueries([
        queryKeys.getListReview,
        { page, rating, search },
      ]);
      message.success(response);
    },
  });
};
