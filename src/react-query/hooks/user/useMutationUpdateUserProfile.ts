import { message } from "antd";
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance, axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const updateUserProfile = async ({ userUpdate }: any) => {
  const { isAdmin, ...body } = userUpdate;
  let axios = axiosInstance;
  if (isAdmin) axios = axiosInstanceAdmin;
  const { data } = await axios.put(`/api/users/profile`, body);
  return data;
};

export const useMutationUpdateUserProfile = (
  resetFields: () => void,
  isAdmin = false,
) => {
  const queryClient = useQueryClient();
  return useMutation(updateUserProfile, {
    onSuccess: (user) => {
      // message.success(`Update User Profile ${user.name}  Successfully `);
      resetFields();
      if (isAdmin) {
        Cookies.set("tokenAdmin", JSON.stringify(user.token), {
          expires: 7,
        });
        user.token = undefined;
        message.success(`Update user password ${user.name} Successfully `);
        return;
      }
      if (user.token) {
        Cookies.set("tokenUser", JSON.stringify(user.token), {
          expires: 7,
        });
        user.token = undefined;
        message.success(`Update user password ${user.name} Successfully `);
      }
      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        const { cart } = oldUser;
        return { ...oldUser, ...user, cart };
      });
    },
  });
};
