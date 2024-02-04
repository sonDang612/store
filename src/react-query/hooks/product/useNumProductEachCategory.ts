import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getNumProductEachCategory = async () => {
  const { data } = await axiosInstance.get(`/api/category`);
  return data;
};

export const useNumProductEachCategory = () => {
  return useQuery(
    [queryKeys.getNumProductEachCategory],
    getNumProductEachCategory,
    {
      onSuccess: (products) => {
        // message.success(`Get number of product each category Successfully`);
      },
    },
  );
};
