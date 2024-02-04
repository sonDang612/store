import { useMutation, useQueryClient } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";

const deleteUserAddressAdmin = async ({ userId, addressId }: any) => {
  const { data } = await axiosInstanceAdmin.delete(
    `/api/admin/users/${userId}/address/${addressId}`,
  );
  return data;
};

export const useMutationDeleteAddressUserAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteUserAddressAdmin, {
    onSuccess: (user) => {
      queryClient.invalidateQueries(queryKeys.getListUser);
    },
  });
};
