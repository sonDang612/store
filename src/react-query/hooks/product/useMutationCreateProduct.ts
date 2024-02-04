import { message } from "antd";
import { MutableRefObject } from "react";
import { useMutation } from "react-query";
import SunEditorCore from "suneditor/src/lib/core";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { useActions } from "@/src/redux/useActions";

const createProduct = async ({ product }: any) => {
  const { data } = await axiosInstanceAdmin.post(`/api/products`, product);
  return data;
};

export const useMutationCreateProduct = (
  editor: MutableRefObject<SunEditorCore>,
) => {
  const actions = useActions();
  return useMutation(createProduct, {
    onSuccess: (product) => {
      editor.current.setContents(product.description);
      message.success("Product created");
    },

    onSettled: () => {
      actions.setAdminCreateEditProductState({ spinning: false });
    },
  });
};
