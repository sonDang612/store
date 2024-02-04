import { useMutation, useQueryClient } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";

const deleteUserAdmin = async ({ userId }: any) => {
  const userId2 = typeof userId === "string" ? userId : userId.join(",");
  const { data } = await axiosInstanceAdmin.delete(
    `/api/admin/users/${userId2}`,
  );
  return data;
};

export const useMutationDeleteUserAdmin = (callback?: () => void) => {
  const queryClient = useQueryClient();
  const actions = useActions();
  return useMutation(deleteUserAdmin, {
    onSuccess: (user) => {
      // if (setRemove) setRemove([]);
      if (callback) {
        callback();
      }
      queryClient.invalidateQueries(queryKeys.getListUser);
    },
  });
};
