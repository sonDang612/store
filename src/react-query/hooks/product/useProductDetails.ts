import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getProductDetails = async (query: any) => {
  const { data } = await axiosInstance.get(`/api/products/${query.id}`);

  return data;
};

export const useProductDetails = (
  id: string,
  enabled = true,
  // initialData = {},
) => {
  return useQuery(
    [queryKeys.getProductDetails, { id }],
    () => getProductDetails({ id }),
    {
      // initialData,
      enabled: Boolean(id) && enabled,
    },
  );
};
