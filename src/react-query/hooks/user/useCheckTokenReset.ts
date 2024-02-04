import { SetStateAction } from "react";
import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const checkTokenReset = async (query: any) => {
  const { data } = await axiosInstance.get(`/api/users/${query.token}`);
  return data;
};

export const useCheckTokenReset = (
  token: string | string[],
  setShow: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
) => {
  return useQuery(
    [queryKeys.checkTokenReset, { token }],
    () => checkTokenReset({ token }),
    {
      onSuccess: ({ message }) => {
        if (message === "ok") {
          setShow(true);
        }
      },

      enabled: Boolean(token),
    },
  );
};
