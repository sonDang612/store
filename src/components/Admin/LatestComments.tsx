import { Rate, Table } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

import { useLatestComment } from "@/src/react-query/hooks/review/useLatestComment";
import { User } from "@/src/types/user";
import { getShortName } from "@/utils/getShortName";
import notEmpty from "@/utils/not-empty";

const LatestComments = () => {
  const { data: latestComments, isLoading } = useLatestComment();
  const columns = [
    {
      title: "name",
      dataIndex: "user",
      width: 70,

      render: (user: User) => (
        <div
          className="flex justify-center items-center -mt-10 w-12 h-12 text-center bg-red-400 rounded-[50%]"
          // style={{
          //    backgroundColor: stringToColour(user.name),
          // }}
        >
          <span className=" uppercase">
            {notEmpty(user) ? getShortName(user.name) : " "}
          </span>
        </div>
      ),
    },
    {
      title: "content",
      dataIndex: "comment",
      render: (comment: any, row: any) => (
        <div className="">
          {notEmpty(row.user) ? (
            <h5 className="text-base font-medium">{row.user.name}</h5>
          ) : (
            <h5 className="text-base font-medium text-red-500">
              User was deleted
            </h5>
          )}

          <p className="mt-1 min-h-[24px] text-gray-500">{comment}</p>
          <div className="flex items-center mt-2 space-x-5 text-xs text-left text-gray-400">
            <span>{dayjs(row.createdAt).format(" hh:mm A - DD/MM/YYYY")}</span>
            <div>
              <Rate
                allowHalf
                value={row.rating}
                disabled
                style={{ fontSize: 15 }}
                //  style={{ fontSize: 14, color: "red" }}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className=" p-5 pb-10 bg-white rounded-sm style-2">
      <div className="flex justify-between items-center px-2 mb-5">
        <h2 className=" text-base text-gray-700">Latest Reviews</h2>
        {/* <h3 className="text-base text-gray-700 cursor-pointer">

            </h3> */}
        <div>
          {" "}
          {/* <Button type="link" onClick={() => ro}> */}
          <Link href="/admin/reviews" passHref>
            <span className="text-blue-500 cursor-pointer">
              View all review
            </span>
          </Link>
          {/* </Button> */}
        </div>
      </div>
      <Table
        pagination={false}
        showHeader={false}
        columns={columns}
        rowKey="_id"
        dataSource={isLoading ? [] : latestComments}
        scroll={{ y: 336.5 }}
        // scroll={{ y: 440.6 }}
      />
    </div>
  );
};

export default LatestComments;
