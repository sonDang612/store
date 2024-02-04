import { useQuery } from "react-query";

import { axiosInstance, axiosInstanceAdmin } from "@/src/axiosInstance";
import { ROLE } from "@/src/constant";
import { queryKeys } from "@/src/react-query/constants";

import { useUserAdmin } from "../user/useUserAdmin";
import { useUserData } from "../user/useUserData";

const getOrderDetail = async (query: any, isAdmin: boolean) => {
  const axios = isAdmin ? axiosInstanceAdmin : axiosInstance;
  const { data } = await axios.get(`/api/orders/${query.id}`, {
    params: {
      statusTime: query?.statusTime,
    },
  });
  return data;
};

export const useOrderDetail = (
  id: string,
  isReady: boolean,
  statusTime: any = undefined,
) => {
  const { data: user } = useUserData(false, false);

  const { data: userAdmin } = useUserAdmin(false);

  return useQuery(
    [queryKeys.getOrderDetail, { id, statusTime }],
    () =>
      getOrderDetail(
        { id, statusTime },
        (user || userAdmin)?.role === ROLE.ADMIN,
      ),
    {
      enabled: Boolean(isReady),
    },
  );
};
