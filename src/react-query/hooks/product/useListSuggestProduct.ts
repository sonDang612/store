import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getSuggestProduct = async (query: any) => {
  const { data } = await axiosInstance.get(`/api/products/${query.id}/suggest`);
  return data;
};

export const useListSuggestProduct = (id: string, enabled = false) => {
  return useQuery(
    [queryKeys.getSuggestProduct, { id }],
    () => getSuggestProduct({ id }),
    {
      onSuccess: (products) => {
        // message.success(`Get List New Arrival Product Discount Successfully`);
      },

      enabled: !!id && enabled,
    },
  );
};
