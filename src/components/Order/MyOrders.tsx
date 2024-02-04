/* eslint-disable react/display-name */
import { SearchOutlined } from "@ant-design/icons";
import { Spin, Table, Tag } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { ORDER_STATUS_COLOR } from "@/src/constant";
import { useMyOrders } from "@/src/react-query/hooks/order/useMyOrders";
import { formatter } from "@/utils/formatPrice";
import notEmpty from "@/utils/not-empty";

const columns = [
  {
    title: "Order Id",
    dataIndex: "_id",
    render: (id: any) => {
      return <span className="text-[#0b74e5]">{id}</span>;
    },
    // sorter: (a, b) => a._id.localeCompare(b._id),
    width: "22%",
  },
  {
    title: "Order date",
    dataIndex: "createdAt",

    render: (createdAt: any) => {
      return (
        <Tag color="geekblue" className="min-w-[172px]">
          {dayjs(createdAt).format("dddd h:mm - DD/MM/YYYY")}
        </Tag>
      );
    },

    sorter: (a: any, b: any) => {
      const x = new Date(a.createdAt);
      const y = new Date(b.createdAt);
      return x.getTime() - y.getTime();
    },
  },
  {
    title: "Total Price",
    dataIndex: "total",

    // defaultSortOrder: "descend",
    sorter: (a: any, b: any) => a.total - b.total,
    render: (total: any) => {
      return <div>{formatter.format(total)}</div>;
    },
    // sortDirections: ["descend", "ascend"],  k oco cung dc
  },
  {
    title: "Order Status",

    dataIndex: "status",
    render: (status: any, rowIndex: any) => {
      return (
        <Tag color={ORDER_STATUS_COLOR[status]} className="capitalize">
          {status}
        </Tag>
        // <span style={{ color: stringToColour(status.toLowerCase()) }}>
        //    {status}
        // </span>
      );
    },
    sorter: (a: any, b: any) => a.status.localeCompare(b.status),
  },

  {
    title: "Detail",
    // key: "_id",
    dataIndex: "detail",
    render: (_: any, rowIndex: any) => (
      <Link href={`/customer/order/${rowIndex._id}`} passHref>
        <SearchOutlined style={{ fontSize: "20px", color: "#0b74e5" }} />
      </Link>
    ),
  },
];
const MyOrders = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const {
    data: myOrders,
    isLoading,
    isFetching,
    isSuccess,
  } = useMyOrders(router.isReady, page);

  if (isLoading) {
    return (
      <div className=" flex justify-center items-center h-[300px]">
        <Spin size="large" />
      </div>
    );
  }
  // const myOrders = notEmpty(data)
  //    ? data.data.map((row) => ({
  //         ...row,
  //         key: row._id,
  //      }))
  //    : [];
  return (
    <div>
      <h2 className="px-4 mb-7 text-2xl text-center">My Orders</h2>

      <div className="bg-white rounded-md">
        <Table
          className="RCM_two_level_table1"
          columns={columns}
          rowKey="_id"
          dataSource={notEmpty(myOrders?.data) ? myOrders.data : []}
          expandable={{
            expandedRowRender: (record) => {
              console.log(record);
              return (
                <div className="flex mx-auto space-x-4 w-[85%]">
                  <div>
                    Pay by{" "}
                    <span className="font-medium capitalize">
                      {record.paymentMethod}
                    </span>{" "}
                    on{" "}
                    <span className="font-medium text-green-500">
                      {dayjs(
                        record.paymentResult?.created || record.createdAt,
                      ).format("dddd h:mm:ss A - DD/MM/YYYY")}
                      {/* {dayjs(record.paymentResult.created).format(
                                    "dddd h:mm:ss A - DD/MM/YYYY"
                                 )} */}
                    </span>
                  </div>

                  <div>
                    Delivery to{" "}
                    <span className="font-medium text-blue-600">
                      {record.paymentResult.receipt_name}
                    </span>
                  </div>

                  <div>
                    Email :{"  "}
                    <span className="font-medium text-[#FBBC05]">
                      {record.paymentResult.receipt_email}
                    </span>
                  </div>
                </div>
              );
            },
          }}
          loading={isLoading || isFetching}
          pagination={
            !isLoading &&
            notEmpty(myOrders?.data) && {
              defaultCurrent: 1,
              total: myOrders.metadata.totalOrders,
              defaultPageSize: myOrders.metadata.orderPerPage,
              pageSizeOptions: ["8"],
              showSizeChanger: true,
              current: myOrders.metadata.currentPage || 1,
              onChange: (newPage, pageSize) => setPage(newPage),
            }
          }
        />
      </div>
    </div>
  );
};

export default MyOrders;
