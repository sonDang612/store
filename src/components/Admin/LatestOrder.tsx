/* eslint-disable react/display-name */
import { Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

import { COLOR, ORDER_STATUS_COLOR } from "@/src/constant";
import { useLatestOrder } from "@/src/react-query/hooks/order/useLatestOrder";
import { User } from "@/src/types/user";

function LatestOrder() {
  const { data: latestOrder, isLoading } = useLatestOrder();

  const columns = [
    {
      title: "DATE",
      dataIndex: "createdAt",
      render: (createdAt: any) => (
        <div className=" text-sm font-normal text-gray-500">
          {dayjs(createdAt).format("MMMM DD,YYYY")}
        </div>
      ),
    },
    {
      title: "BILLING NAME",
      dataIndex: "user",
      render: (user: User) => (
        <div className=" text-gray-600">
          {" "}
          <Tooltip
            placement="topLeft"
            title={user.active ? user?.name : "User was deleted"}
            color={user.active ? "blue" : "red"}
            // title={notEmpty(user) ? user?.name : "User was deleted"}
            // color={notEmpty(user) ? "blue" : "red"}
          >
            <div className=" max-w-[110px] text-sm font-normal text-gray-500 truncate">
              {user.active ? (
                user.name
              ) : (
                <span className="text-red-500">User was deleted</span>
              )}
            </div>
          </Tooltip>{" "}
        </div>
      ),
    },
    {
      title: "AMOUNT",
      dataIndex: "total",

      render: (text: string) => (
        <span style={{ color: COLOR.peach }} className=" text-sm font-normal">
          ${text}
        </span>
        // <span style={{ color: status[it.status].color }}>${text}</span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",

      render: (status: any) => (
        <Tag color={ORDER_STATUS_COLOR[status]} className="capitalize">
          {status}
        </Tag>
        // <Tag color={status[text].color}>{status[text].text}</Tag>
      ),
    },
  ];
  return (
    // <div className=" p-5 pb-10 min-h-[544.6px] bg-white rounded-sm adminTable">
    <div className=" p-5 pb-10 min-h-[440.6px] bg-white rounded-sm adminTable">
      <div className="flex justify-between items-center px-2 mb-5">
        <h2 className=" text-base text-gray-700">Latest Orders</h2>
        {/* <h3 className="text-base text-gray-700 cursor-pointer">

            </h3> */}
        <div>
          {" "}
          {/* <Button type="link" onClick={() => ro}> */}
          <Link href="/admin/orders" passHref>
            <span className="text-blue-500 cursor-pointer">
              View all orders
            </span>
          </Link>
          {/* </Button> */}
        </div>
      </div>
      <Table
        pagination={false}
        columns={columns}
        rowKey="_id"
        dataSource={isLoading ? [] : latestOrder}
      />
    </div>
  );
}

export default LatestOrder;
