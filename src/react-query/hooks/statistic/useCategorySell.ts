import { useQuery } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getCategorySell = async (query: any) => {
  const { data } = await axiosInstanceAdmin.get(`/api/admin/category`, {
    params: { year: query?.year ? query.year : new Date().getFullYear() },
  });
  return data;
};

export const useCategorySell = (year: number) => {
  return useQuery(
    [queryKeys.getCategorySell, { year }],
    () => getCategorySell({ year }),
    {
      onSuccess: (user) => {
        // message.success(`Get WishList Successfully`);
      },
    },
  );
};
