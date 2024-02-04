import { DashboardOutlined, FireOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout } from "antd";
import Link from "next/link";

import BackTopAdmin from "@/components/Admin/BackTopAdmin";
import FilterCoupon from "@/components/Admin/FilterCoupon";
import HeaderAdmin from "@/components/Admin/HeaderAdmin";
import SiderAdmin from "@/components/Admin/SiderAdmin";
import TableCoupon from "@/components/Admin/TableCoupon";
import { withAdmin } from "@/utils/withAdmin";

const CouponPage = () => {
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
              <FireOutlined /> <span className="ml-2">Coupon</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className=" px-2 ml-4">
          <div className=" bg-white">
            <FilterCoupon />
            <div className=" p-4">
              <TableCoupon />
            </div>
          </div>
        </div>
      </Layout>
      <BackTopAdmin />
    </Layout>
  );
};

// export default dynamic(() => Promise.resolve(Review), { ssr: false });
export default withAdmin(CouponPage);
// CouponPage.getLayout = function getLayout(page) {
//    return <>{page}</>;
// };
