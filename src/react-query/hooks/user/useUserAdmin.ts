import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { ROLE } from "@/src/constant";
import { queryKeys } from "@/src/react-query/constants";

const getAdminData = async () => {
  const { data } = await axiosInstanceAdmin.get(`/api/users/admin`);
  return data;
};
// const pathProtect = ["/cart"];
export const useUserAdmin = (enabled = true) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useQuery(queryKeys.getAdminData, getAdminData, {
    onSuccess: (user) => {
      if (user?.role === ROLE.ADMIN && router.asPath.includes("/admin/login")) {
        const redirect =
          Object.keys(router.query).length !== 0
            ? router.asPath.split("=")[1]
            : "/admin/dashboard";
        router.replace(redirect);
      }
    },

    onError: (error: any) => {
      const { status } = error;

      if (status === 401) {
        router.replace(`/admin/login?redirect=${router.asPath}`);
        Cookies.remove("tokenAdmin");
        queryClient.setQueryData(queryKeys.getAdminData, {});
      }
    },

    enabled,
  });
};
