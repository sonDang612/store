import { FormInstance } from "antd";
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { ROLE } from "@/src/constant";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data } = await axiosInstance.post("/api/users/login", {
    email,
    password,
  });
  return data;
};

export const useMutationLoginUser = (form: FormInstance<any>) => {
  const queryClient = useQueryClient();

  const actions = useActions();
  // const router = useRouter();
  return useMutation(login, {
    onSuccess: (user) => {
      // message.success(`Login Successfully ${user.name}`);
      if (user.role === ROLE.ADMIN) {
        Cookies.set("tokenAdmin", JSON.stringify(user.token), {
          expires: 7,
        });
        queryClient.setQueryData(queryKeys.getAdminData, (oldUser) => {
          return user;
        });
        // router.push("/admin/dashboard");
        return;
      }
      actions.handleOk();

      Cookies.set("tokenUser", JSON.stringify(user.token), { expires: 7 });
      queryClient.setQueryData(queryKeys.getUserData, (oldUser: any) => {
        return { ...oldUser, ...user };
      });
      form?.resetFields();
      // if (notEmpty(user)) router.push("/customer/account");
    },
  });
};
