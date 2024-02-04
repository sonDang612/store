import { message } from "antd";
import { NextRouter } from "next/router";
import { useMutation } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";

const resetPassowrd = async ({
  password,
  token,
}: {
  password: string;
  token: string;
}) => {
  const { data } = await axiosInstance.patch(
    `/api/users/resetPassword/${token}`,
    {
      password,
    },
  );
  return data;
};

export const useMutationResetPassword = (router: NextRouter) => {
  return useMutation(resetPassowrd, {
    onSuccess: (response) => {
      message.success(response.message);
      router.push("/");
    },
  });
};
