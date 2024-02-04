import { FormInstance, message } from "antd";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const createCoupon = async (coupon: any) => {
  const { data } = await axiosInstanceAdmin.post(`/api/admin/coupon`, coupon);
  return data;
};

export const useCreateCoupon = (form: FormInstance<any>) => {
  const queryClient = useQueryClient();
  return useMutation(createCoupon, {
    onSuccess: (coupon) => {
      //  message.success(`Coupon updated`);
      queryClient.invalidateQueries(queryKeys.getCoupons);

      form.setFieldsValue({
        ...form.getFieldsValue(),
        quantity: "",
        discount: "",
        couponName: "",
        expiry: "",
      });
    },
  });
};
