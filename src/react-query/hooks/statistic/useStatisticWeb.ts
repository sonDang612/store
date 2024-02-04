import { useQuery } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getStatisticWeb = async () => {
  const { data } = await axiosInstanceAdmin.get(`/api/admin/statistic`);
  return data;
};

export const useStatisticWeb = () => {
  return useQuery(queryKeys.getStatisticWeb, getStatisticWeb, {
    onSuccess: (user) => {
      // message.success(`Get WishList Successfully`);
    },

    // enabled: Boolean(router.isReady),
  });
};
