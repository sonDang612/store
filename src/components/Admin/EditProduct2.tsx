import "suneditor/dist/css/suneditor.min.css";

import { Button, FormInstance } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { MutableRefObject } from "react";
import { useSelector } from "react-redux";
import SunEditorCore from "suneditor/src/lib/core";

import { useMutationCreateProduct } from "@/src/react-query/hooks/product/useMutationCreateProduct";
import { useMutationUpdateProduct } from "@/src/react-query/hooks/product/useMutationUpdateProduct";
import { useProductDetails } from "@/src/react-query/hooks/product/useProductDetails";
import { AdminCreateEditProductType } from "@/src/redux/reducers/adminCreateEditProductReducer";
import { RootState } from "@/src/redux/store";
import { getImages } from "@/utils/getImages";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
let refDescription = "";
let refIsCloud: any;
const EditProduct2: React.FC<{
  editor?: MutableRefObject<SunEditorCore>;
  create?: boolean;
  form: FormInstance<any>;
}> = ({ editor, form, create = false }) => {
  const isCloud = useSelector<RootState, AdminCreateEditProductType["isCloud"]>(
    (state) => state.adminCreateEditProduct.isCloud,
  );
  const fileList = useSelector<
    RootState,
    AdminCreateEditProductType["fileList"]
  >((state) => state.adminCreateEditProduct.fileList);

  const router = useRouter();
  const { mutate: updateProduct } = useMutationUpdateProduct({
    isAdmin: false,
    editor,
    revalidate: true,
  });
  const { data: product } = useProductDetails(router.query.id as string);
  const { mutate: createProduct } = useMutationCreateProduct(editor!);
  refDescription = product?.description;
  refIsCloud = isCloud;

  const handleSave = async (description: any) => {
    let dataSave = description;

    if (refIsCloud) {
      dataSave = await uploadImageToCloudinary(getImages(dataSave), dataSave);
    }

    updateProduct({
      product: {
        _id: product._id,
        description: dataSave,
      },
    });
  };
  const handleCreateProduct = async (description: any, isCloud: any) => {
    const { name, category, brand, price, quantity, discount } =
      form.getFieldsValue();

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    try {
      await form.validateFields();

      const image = await uploadImageToCloudinary(fileList);

      let dataSave = description;
      if (isCloud) {
        dataSave = await uploadImageToCloudinary(getImages(dataSave), dataSave);
      }

      createProduct({
        product: {
          image,
          name,
          price,
          category,
          discount,
          description: dataSave,
          brand,
          countInStock: quantity,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor!.current = sunEditor;
  };
  const handleReset = () => {
    if (create) editor!.current.setContents("");
  };
  return (
    <div className="p-3">
      <div className=" my-4 space-x-4 text-right">
        {/* <Checkbox
          onChange={(e) =>
            actions.setAdminCreateEditProductState({
              isCloud: e.target.checked,
            })
          }
          checked={isCloud}
        >
          Upload images to the cloud
        </Checkbox> */}
        {create && (
          <Button type="primary" shape="round" onClick={handleReset}>
            Reset
          </Button>
        )}
      </div>
      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        defaultValue={product?.description || ""}
        setDefaultStyle="height: 600px"
        setOptions={{
          callBackSave: (des) => {
            if (
              (create || refDescription === des) &&
              !des.includes("data:image/")
            ) {
              return;
            }

            handleSave(des);
          },
          buttonList: [
            [
              "undo",
              "redo",
              "removeFormat",
              "link",
              "image",
              "video",
              //  "audio",
              "bold",
              "underline",
              "italic",
              "strike",
              "fontColor",
              "hiliteColor",
              "outdent",
              "indent",
              "align",
              "list",
              "table",

              "font",
              "fontSize",
              "formatBlock",
              "fullScreen",
              "codeView",
              "preview",

              ...(create ? ["print"] : ["print", "save"]),
            ],
          ],
        }}
      />
      {create && (
        <div className="mt-2 text-right">
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              handleCreateProduct(editor!.current.getContents(false), isCloud);
            }}
          >
            Create Product
          </Button>
        </div>
      )}
    </div>
  );
};
export default EditProduct2;
