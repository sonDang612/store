import { message } from "antd";
import { useMutation } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";

const forgotPassowrd = async ({ email }: { email: string }) => {
  const { data } = await axiosInstance.post(`/api/users/forgotPassword`, {
    email,
  });
  return data;
};

export const useMutationForgotPassword = () => {
  return useMutation(forgotPassowrd, {
    onSuccess: (response) => {
      //   console.log(editUser);
      message.success(response.message);
    },
  });
};
