import { useQuery } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getTotalRevenue = async (query: any) => {
  const { data } = await axiosInstanceAdmin.get(`/api/admin/revenue`, {
    params: {
      year: query?.year ? query.year : new Date().getFullYear(),
      month: query?.month ? query.month : new Date().getMonth(),
    },
  });
  return data;
};

export const useTotalRevenue = (year: number, month: number) => {
  return useQuery(
    [queryKeys.getTotalRevenue, { year, month }],
    () => getTotalRevenue({ year, month }),
    {
      onSuccess: (user) => {
        // message.success(`Get WishList Successfully`);
      },
    },
  );
};
