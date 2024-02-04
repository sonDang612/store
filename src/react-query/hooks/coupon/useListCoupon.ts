import { useQuery } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getCoupons = async ({
  name,
  expiry,
  discount,
  quantity,
  search,
  page,
}: any) => {
  const { data } = await axiosInstanceAdmin.get(`/api/coupon`, {
    params: {
      sort: name || expiry || discount || quantity,
      name: search || null,
      page: page || null,
    },
  });
  return data;
};

export const useListCoupon = ({
  name,
  expiry,
  discount,
  quantity,
  search,
  page,
}: any) => {
  return useQuery(
    [queryKeys.getCoupons, { name, expiry, discount, quantity, search, page }],
    () =>
      getCoupons({
        name,
        expiry,
        discount,
        quantity,
        search,
        page,
      }),
    {
      onSuccess: (products) => {
        // message.success(`Get List Best Selling Product Discount Successfully`);
      },
    },
  );
};
