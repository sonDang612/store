import { DashboardOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout } from "antd";
import Link from "next/link";
import React from "react";

import BackTopAdmin from "@/components/Admin/BackTopAdmin";
import Filter from "@/components/Admin/Filter";
import HeaderAdmin from "@/components/Admin/HeaderAdmin";
import SiderAdmin from "@/components/Admin/SiderAdmin";
import TableUser from "@/components/Admin/TableUser";
import { withAdmin } from "@/utils/withAdmin";

const UserPage = () => {
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
              <UserOutlined /> <span className="ml-2">User</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className=" px-2 ml-4">
          <div className=" bg-white">
            <Filter />
            <div className=" p-4">
              <TableUser />
            </div>
          </div>
        </div>
      </Layout>
      <BackTopAdmin />
    </Layout>
  );
};

export default withAdmin(UserPage);
