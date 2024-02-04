import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getListNameProducts = async () => {
  const { data } = await axiosInstance.get(`/api/products/names`);
  return data;
};

export const useListNameProducts = () => {
  const router = useRouter();
  return useQuery(queryKeys.getListNameProducts, getListNameProducts, {
    enabled: router.isReady,
  });
};
