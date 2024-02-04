import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import React from "react";

import { ORDER_STATUS_REVERSE } from "@/src/constant";

dayjs.extend(advancedFormat);

const OrderStatus: React.FC<any> = ({ orderStatus, statusTime = [] }) => {
  let date = new Date("2000/01/01");
  const status = ORDER_STATUS_REVERSE.slice(7 - statusTime.length, 7);
  if (orderStatus === "Cancelled") status[0] = orderStatus;
  return (
    <div className=" border-[1px] border-gray-300 border-solid">
      {statusTime.map((day: any, i: any) => {
        if (!dayjs(day).isSame(date, "day")) {
          date = day;

          return (
            <div key={i} className="">
              <h2 className="p-3 font-bold tracking-wide bg-[#F1F1F1]">
                {i === 0 && " Latest Update : "}
                {dayjs(day).format("dddd, DD-MM-YYYY")}
              </h2>

              <h3 className="p-3 text-[13px] font-normal border-0 border-b-[1px] border-gray-200 border-solid">
                <span className="mr-4">
                  {" "}
                  {dayjs(day).format("kk:mm").replace("24:", "00:")}
                </span>{" "}
                <span
                  className={
                    status[i] === "Delivered"
                      ? "font-bold "
                      : status[i] === "Cancelled"
                      ? "font-bold text-red-500"
                      : ""
                  }
                >
                  {status[i]}
                </span>
              </h3>
            </div>
          );
        }

        return (
          <div
            key={i}
            className=" p-3 text-[13px] font-normal border-0 border-b-[1px] border-gray-200 border-solid"
          >
            <span className="mr-4">
              {" "}
              {dayjs(day).format("kk:mm").replace("24:", "00:")}
            </span>{" "}
            <span>{status[i]}</span>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatus;
