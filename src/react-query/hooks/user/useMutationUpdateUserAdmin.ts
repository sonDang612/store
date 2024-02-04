import { SetStateAction } from "react";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";
import notEmpty from "@/utils/not-empty";

const updateUserAdmin = async ({ userUpdate }: any) => {
  const userId = typeof userUpdate === "object" ? userUpdate._id : "";
  const { data } = await axiosInstanceAdmin.put(
    `/api/admin/users/${userId}`,
    userUpdate,
  );
  return data;
};

export const useMutationUpdateUserAdmin = (setEditingKey?: {
  (value: SetStateAction<string>): void;
  (arg0: string): void;
}) => {
  const queryClient = useQueryClient();
  const actions = useActions();
  return useMutation(updateUserAdmin, {
    onSuccess: (user) => {
      actions.hideModalUserAdmin();
      if (notEmpty(setEditingKey)) setEditingKey("");
      queryClient.invalidateQueries(queryKeys.getListUser);
    },
  });
};
