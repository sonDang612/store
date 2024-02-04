import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";

const updateUserAddress = async ({ address }: any) => {
  const { data } = await axiosInstance.patch(
    `/api/users/address/${address._id}`,
    address,
  );
  return data;
};

export const useMutationUpdateUserAddress = () => {
  const actions = useActions();
  const queryClient = useQueryClient();
  return useMutation(updateUserAddress, {
    onSuccess: (user) => {
      if (user.token) {
        Cookies.set("tokenUser", JSON.stringify(user.token), {
          expires: 7,
        });
        user.token = undefined;
      }
      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        const { cart } = oldUser;
        return { ...oldUser, ...user, cart };
      });
      actions.hideModalAddress();
    },
  });
};
