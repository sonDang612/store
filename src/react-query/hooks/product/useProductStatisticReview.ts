import { useQuery } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getProductStatisticReview = async (query: any) => {
  const { data } = await axiosInstanceAdmin.get(
    `/api/products/${query.id}/review/statistic`,
  );

  return data;
};

export const useProductStatisticReview = (id: any, enabled = false) => {
  return useQuery(
    [queryKeys.getProductStatisticReview],
    () => getProductStatisticReview({ id }),
    {
      onSuccess: (review) => {
        // message.success(`Get Product Statistic Review Successfully`);
      },

      enabled: !!id && enabled,
    },
  );
};
