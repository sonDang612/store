import { DashboardOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Form, Layout, Spin } from "antd";
import Link from "next/link";
import { useRef } from "react";
import { useSelector } from "react-redux";
import SunEditorCore from "suneditor/src/lib/core";

import BackTopAdmin from "@/components/Admin/BackTopAdmin";
import EditProduct2 from "@/components/Admin/EditProduct2";
import FormProductEdit from "@/components/Admin/FormProductEdit";
import HeaderAdmin from "@/components/Admin/HeaderAdmin";
import ImageProductEdit from "@/components/Admin/ImageProductEdit";
import SiderAdmin from "@/components/Admin/SiderAdmin";
import { AdminCreateEditProductType } from "@/src/redux/reducers/adminCreateEditProductReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { withAdmin } from "@/utils/withAdmin";

const ProductsEditPage = () => {
  const spinning = useSelector<
    RootState,
    AdminCreateEditProductType["spinning"]
  >((state) => state.adminCreateEditProduct.spinning);
  const [form] = Form.useForm();
  const actions = useActions();
  const editor = useRef<SunEditorCore>({} as SunEditorCore);

  return (
    <Layout className="pb-20">
      <SiderAdmin />
      <Layout className="site-layout">
        <HeaderAdmin />

        <div className="py-2 pl-6">
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item className="text-gray-500 cursor-pointer">
              <DashboardOutlined />
              <Link href="/admin/dashboard" passHref>
                <span className="ml-2">Dasboard</span>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <FileDoneOutlined /> <span className="ml-2">Products</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className=" px-2 ml-4">
          <div className=" bg-white">
            <div className="flex items-center ml-auto w-[60%]">
              <div className=" p-4 text-xl font-medium text-center">
                Create Products
              </div>
              <div className="pr-6 ml-auto">
                <Button
                  type="primary"
                  onClick={() => {
                    form.resetFields();
                    actions.setAdminCreateEditProductState({ fileList: [] });
                    editor.current.setContents("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
            <Spin tip="Loading..." spinning={spinning}>
              <div>
                <ImageProductEdit create />
                <FormProductEdit create form={form} />
                <EditProduct2 create form={form} editor={editor} />
              </div>
            </Spin>
          </div>
        </div>
      </Layout>
      <BackTopAdmin />
    </Layout>
  );
};

// export default dynamic(() => Promise.resolve(ProductsEditPage), { ssr: false });
export default withAdmin(ProductsEditPage);
// ProductsEditPage.getLayout = function getLayout(page) {
//    return <>{page}</>;
// };
