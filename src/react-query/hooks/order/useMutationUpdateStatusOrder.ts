import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstance, axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";

const updateStatusOrder = async ({ orderId, status, isAdmin = true }: any) => {
  const axios = isAdmin ? axiosInstanceAdmin : axiosInstance;
  const { data } = await axios.put(`/api/admin/orders/${orderId}`, { status });
  return data;
};

export const useMutationUpdateStatusOrder = (isAdmin = false) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const actions = useActions();
  return useMutation(updateStatusOrder, {
    onSuccess: (order) => {
      if (isAdmin) {
        queryClient.invalidateQueries(queryKeys.getListOrder);
        actions.setAdminOrderState({ editingKey: "" });
      } else {
        queryClient.setQueryData(
          [queryKeys.getOrderDetail, { id: router.query.id }],
          (old) => {
            return {
              ...order,
            };
          },
        );
      }
    },
  });
};
