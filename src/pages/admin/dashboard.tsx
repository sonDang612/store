import {
  CodeOutlined,
  DashboardOutlined,
  DingtalkOutlined,
  FileDoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Col, Layout, Row, Spin } from "antd";
import React from "react";

import BackTopAdmin from "@/components/Admin/BackTopAdmin";
import CardNumber from "@/components/Admin/CardNumber";
import CategoryLineChart from "@/components/Admin/CategoryLineChart";
import HeaderAdmin from "@/components/Admin/HeaderAdmin";
import LatestComments from "@/components/Admin/LatestComments";
import LatestOrder from "@/components/Admin/LatestOrder";
import SiderAdmin from "@/components/Admin/SiderAdmin";
import TotalRevenueBarChart from "@/components/Admin/TotalRevenueBarChart";
import { useStatisticWeb } from "@/src/react-query/hooks/statistic/useStatisticWeb";
import { withAdmin } from "@/utils/withAdmin";

const arrayData = [
  {
    icon: <DingtalkOutlined style={{ fontSize: 54, color: "#64EA91" }} />,
    name: "Total Reviews",
    total: 2864,
  },
  {
    icon: <UserOutlined style={{ fontSize: 54, color: "#8FC9FB" }} />,
    name: "Total Customers",
    total: 1432,
  },
  {
    icon: <FileDoneOutlined style={{ fontSize: 54, color: "#D897EB" }} />,
    name: "Total Orders",
    total: 421,
  },
  {
    icon: <CodeOutlined style={{ fontSize: 54, color: "#F8B2B3" }} />,
    name: "Total Products",
    total: 226,
  },
];

const DashboardPage = () => {
  const { data: statisticWeb, isLoading } = useStatisticWeb();

  return (
    <Layout className=" pb-20 min-w-[1400px]">
      <SiderAdmin />

      <Layout className="site-layout">
        <HeaderAdmin />
        <div className="py-2 pl-6">
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item className="text-gray-500">
              <DashboardOutlined />
              <span className="ml-2">Dasboard</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className=" px-2 ml-4">
          <Spin tip="Loading..." spinning={isLoading}>
            <Row gutter={[10, 0]}>
              {!isLoading ? (
                arrayData.map((data, i) => {
                  return (
                    <Col span={6} key={i}>
                      <div className="px-2">
                        <CardNumber
                          data={{
                            ...data,
                            total: statisticWeb[i],
                          }}
                        />
                      </div>
                    </Col>
                  );
                })
              ) : (
                <div className="h-screen"></div>
              )}
            </Row>
            <div className="px-2 space-y-6">
              <CategoryLineChart />
              <Row gutter={[20, 0]} className="mt-5">
                <Col span={12}>
                  <LatestOrder />
                </Col>
                <Col span={12}>
                  <LatestComments />
                </Col>
              </Row>
              <div className="bg-white rounded-sm">
                <TotalRevenueBarChart />
              </div>
            </div>
          </Spin>
        </div>
      </Layout>
      <BackTopAdmin />
    </Layout>
  );
};

export default withAdmin(DashboardPage);
