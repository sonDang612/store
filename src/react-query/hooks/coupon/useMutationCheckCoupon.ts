import { message } from "antd";
import { useMutation } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { useActions } from "@/src/redux/useActions";

const checkCoupon = async ({ name }: { name: string }) => {
  const { data } = await axiosInstance.post(`/api/coupon`, { name });
  return data;
};

export const useMutationCheckCoupon = () => {
  const actions = useActions();
  return useMutation(checkCoupon, {
    onSuccess: (coupon) => {
      //   console.log(updateUser);
      message.success(`Valid coupon `);
      actions.setCouponReducer(coupon);
    },
  });
};
