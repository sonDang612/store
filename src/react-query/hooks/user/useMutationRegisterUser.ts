import { message } from "antd";
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";

export const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data } = await axiosInstance.post("/api/users", { email, password });

  return data;
};
export const useMutationRegisterUser = (form: { resetFields: () => void }) => {
  const queryClient = useQueryClient();
  const actions = useActions();
  return useMutation(register, {
    onSuccess: (user) => {
      //   console.log(user);

      message.success(`Register Successfully ${user.name}`);
      Cookies.set("tokenUser", JSON.stringify(user.token), { expires: 7 });
      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        return { ...oldUser, ...user };
      });
      actions.handleCancel();

      form?.resetFields();
    },
  });
};
