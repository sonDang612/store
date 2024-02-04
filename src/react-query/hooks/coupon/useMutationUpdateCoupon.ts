import { SetStateAction } from "react";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const updateCoupon = async ({ coupon }: any) => {
  const { data } = await axiosInstanceAdmin.put(
    `/api/coupon/${coupon._id}`,
    coupon,
  );
  return data;
};

export const useMutationUpdateCoupon = (setEditingKey: {
  (value: SetStateAction<string>): void;
  (arg0: string): void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(updateCoupon, {
    onSuccess: (coupon) => {
      //  message.success(`Coupon updated`);
      if (setEditingKey) {
        setEditingKey("");
        queryClient.invalidateQueries(queryKeys.getCoupons);
      }
    },
  });
};
