import { useMutation, useQueryClient } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const deleteCoupon = async (couponId: string) => {
  const { data } = await axiosInstanceAdmin.delete(`/api/coupon/${couponId}`);
  return data;
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteCoupon, {
    onSuccess: (coupon) => {
      //  message.success(`Coupon updated`);

      queryClient.invalidateQueries(queryKeys.getCoupons);
    },
  });
};
