import Cookies from "js-cookie";
import { useQuery, useQueryClient } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";
import { User } from "@/src/types/user";

const getUserData = async (cart: any) => {
  const { data } = await axiosInstance.get(`/api/users/me`, {
    params: { cart: cart || undefined },
  });
  return data;
};
// const pathProtect = ["/cart"];
export const useUserData = (cart = false, enabled = true) => {
  const actions = useActions();
  // const router = useRouter();
  const queryClient = useQueryClient();
  return useQuery<User>(
    queryKeys.getUserData,
    () =>
      getUserData(
        window.location.pathname === "/customer/cart" ||
          window.location.pathname === "/customer/payment" ||
          cart,
      ),
    {
      onSuccess: (user) => {
        // if (isEmpty(user) && window.location.pathname.startsWith("/customer")) {
        //   actions.showModalLogin();
        // }
        // message.success(`Get UserDate ${user.name} Successfully`);
      },
      onError: (error: any) => {
        const { status } = error;

        if (status === 401) {
          if (window.location.pathname.startsWith("/customer")) {
            actions.showModalLogin();
          }
          Cookies.remove("tokenUser");
          queryClient.setQueryData(queryKeys.getUserData, {});
        }
      },

      enabled,
    },
  );
};
