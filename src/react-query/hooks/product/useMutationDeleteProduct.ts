import { message } from "antd";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { triggerRevalidate } from "@/src/utils/triggerRevalidate";

const deleteProduct = async ({ product }: any) => {
  const { data } = await axiosInstanceAdmin.delete(
    `/api/products/${product._id}`,
  );
  return data;
};

export const useMutationDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteProduct, {
    onSuccess: async (response) => {
      if (response?.product) {
        await triggerRevalidate(response?.product?._id);
      }
      queryClient.invalidateQueries(queryKeys.getProductsAdmin);

      message.success(response.message);
    },
  });
};
