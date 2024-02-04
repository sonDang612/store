import { DashboardOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Breadcrumb, Form, Layout, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import SunEditorCore from "suneditor/src/lib/core";

import BackTopAdmin from "@/components/Admin/BackTopAdmin";
import EditProduct2 from "@/components/Admin/EditProduct2";
import FormProductEdit from "@/components/Admin/FormProductEdit";
import HeaderAdmin from "@/components/Admin/HeaderAdmin";
import ImageProductEdit from "@/components/Admin/ImageProductEdit";
import SiderAdmin from "@/components/Admin/SiderAdmin";
import { useProductDetails } from "@/src/react-query/hooks/product/useProductDetails";
import { withAdmin } from "@/utils/withAdmin";

const ProductsEditPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { data, isLoading, isSuccess } = useProductDetails(
    router.query.id as string,
  );
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
            <div className=" p-4 text-xl font-medium text-center">
              Edit Products{" "}
              <Link
                href={`/product/${router.query.id}?slug=${data?.slug}`}
              >{`#${router.query.id}`}</Link>
            </div>
            <Spin tip="Loading..." spinning={isLoading}>
              {!isLoading && isSuccess ? (
                <div>
                  <ImageProductEdit image={data.image} id={data._id} />
                  <FormProductEdit data={data} form={form} />
                  <EditProduct2 editor={editor} form={form} />
                </div>
              ) : (
                <div className="h-screen"></div>
              )}
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
