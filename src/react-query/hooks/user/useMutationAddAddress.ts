import { message } from "antd";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";

const addUserAddress = async ({ address }: any) => {
  const { data } = await axiosInstance.post(`/api/users/address`, address);
  return data;
};

export const useMutationAddUserAddress = () => {
  const queryClient = useQueryClient();
  const actions = useActions();
  return useMutation(addUserAddress, {
    onMutate: async ({ address }) => {
      await queryClient.cancelQueries(queryKeys.getUserData);
      const current = queryClient.getQueryData(queryKeys.getUserData);

      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        let newAddressList;
        if (address.defaultAddress) {
          newAddressList = [
            { ...address, _id: Date.now().toString() },
            ...oldUser.addressList,
          ];
        } else {
          newAddressList = [
            ...oldUser.addressList,
            { ...address, _id: Date.now().toString() },
          ];
        }

        return { ...oldUser, addressList: newAddressList };
      });
      actions.hideModalAddress();
      return { current };
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        const { cart } = oldUser;
        return { ...oldUser, ...user, cart };
      });
    },
    onError: (err: any, _, context: any) => {
      message.error(`Error ${err.message}`);
      queryClient.setQueryData(queryKeys.getUserData, { ...context.current });
    },
  });
};
