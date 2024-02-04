import { useQuery } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const getLatestComment = async () => {
  const { data } = await axiosInstanceAdmin.get(`/api/admin/reviews/latest`);
  return data;
};

export const useLatestComment = () => {
  return useQuery(queryKeys.getLatestComment, getLatestComment, {
    onSuccess: (order) => {
      // message.success(`Get MyOrder Successfully`);
    },
  });
};
