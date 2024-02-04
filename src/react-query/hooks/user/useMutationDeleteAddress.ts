import { message } from "antd";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const deleteUserAddress = async ({ addressId }: any) => {
  const { data } = await axiosInstance.delete(
    `/api/users/address/${addressId}`,
  );
  return data;
};

export const useMutationDeleteUserAddress = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteUserAddress, {
    onMutate: async ({ addressId }: any) => {
      await queryClient.cancelQueries(queryKeys.getUserData);
      const current = queryClient.getQueryData(queryKeys.getUserData);

      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        const newAddressList = oldUser.addressList.filter((address: any) => {
          return address._id.toString() !== addressId.toString();
        });

        return { ...oldUser, addressList: newAddressList };
      });

      return { current };
    },
    onSuccess: (user: any) => {
      // if (user.token) {
      //    Cookies.set("tokenUser", JSON.stringify(user.token), {
      //       expires: 2,
      //    });
      //    user.token = undefined;
      // }
      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        const { cart } = oldUser;
        return { ...oldUser, ...user, cart };
      });
    },
    onError: (err: any, _, context: any) => {
      console.log(err);
      message.error(`Error ${err.message}`);
      queryClient.setQueryData(queryKeys.getUserData, { ...context.current });
    },
  });
};
