import { message } from "antd";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { useActions } from "@/src/redux/useActions";
import { triggerRevalidate } from "@/src/utils/triggerRevalidate";
import notEmpty from "@/utils/not-empty";

const updateProduct = async ({ product }: any) => {
  const { data } = await axiosInstanceAdmin.put(
    `/api/products/${product._id}`,
    product,
  );
  return data;
};
type UpdateProduct = {
  isAdmin?: boolean;
  editor?: { current: { setContents: (arg0: any) => void } };
  revalidate?: boolean;
};
export const useMutationUpdateProduct = ({
  isAdmin,
  editor,
  revalidate,
}: UpdateProduct) => {
  const queryClient = useQueryClient();
  const actions = useActions();
  return useMutation(updateProduct, {
    onSuccess: async (product) => {
      if (revalidate) {
        await triggerRevalidate(product._id);
      }
      if (isAdmin) {
        actions.setAdminProductState({ editingKey: "" });
        queryClient.invalidateQueries(queryKeys.getProductsAdmin);

        return;
      }
      queryClient.setQueryData(
        [queryKeys.getProductDetails, { id: product._id }],
        (old: any) => {
          return { ...old, ...product };
        },
      );
      editor?.current?.setContents(product.description);
      actions.setAdminCreateEditProductState({
        fileList: notEmpty(product.image)
          ? product.image.map((img: any) => {
              return {
                uid: img,
                name: img,
                status: "done",
                url: img,
              };
            })
          : [],
      });

      message.success("updated product");
    },
  });
};
