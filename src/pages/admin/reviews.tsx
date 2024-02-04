import { DashboardOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout } from "antd";
import Link from "next/link";

import BackTopAdmin from "@/components/Admin/BackTopAdmin";
import FilterReview from "@/components/Admin/FilterReview";
import HeaderAdmin from "@/components/Admin/HeaderAdmin";
import SiderAdmin from "@/components/Admin/SiderAdmin";
import TableReview from "@/components/Admin/TableReview";
import { withAdmin } from "@/utils/withAdmin";

const Review = () => {
  return (
    <Layout className="pb-20 min-w-[1400px]">
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
              <FileDoneOutlined /> <span className="ml-2">Review</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className=" px-2 ml-4">
          <div className=" bg-white">
            <FilterReview />
            <div className=" p-4">
              <TableReview />
            </div>
          </div>
        </div>
      </Layout>
      <BackTopAdmin />
    </Layout>
  );
};

// export default dynamic(() => Promise.resolve(Review), { ssr: false });
export default withAdmin(Review);
// Review.getLayout = function getLayout(page) {
//    return <>{page}</>;
// };
