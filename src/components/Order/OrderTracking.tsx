import { Button, Slider, Spin } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useRouter } from "next/router";
import React from "react";

import { useOrderDetail } from "@/src/react-query/hooks/order/useOrderDetail";

import OrderStatus from "./OrderStatus";

dayjs.extend(advancedFormat);
const value = [0, 16.66, 33.32, 49.98, 66.64, 83.3, 100];
const marks = {
  0: {
    label: (
      <div className="pl-4 m-3 mt-3 max-w-[calc(100%-30px)] text-sm font-normal text-gray-500">
        Ordered Successfully
      </div>
    ),
  },
  16.66: {
    label: (
      <div className="pl-4 m-3 mt-3 max-w-[calc(100%-30px)] text-sm font-normal text-gray-500">
        Shop Received
      </div>
    ),
  },
  33.32: {
    label: (
      <div className="pl-4 m-3 mt-3 max-w-[calc(100%-30px)] text-sm font-normal text-gray-500">
        Getting Product
      </div>
    ),
  },
  49.98: {
    label: (
      <div className="pl-4 m-3 mt-3 max-w-[calc(100%-30px)] text-sm font-normal text-gray-500">
        Packing
      </div>
    ),
  },
  66.64: {
    label: (
      <div className="pl-4 m-3 mt-3 max-w-[calc(100%-30px)] text-sm font-normal text-gray-500">
        Shipping Handover
      </div>
    ),
  },
  83.3: {
    label: (
      <div className="pl-4 m-3 mt-3 max-w-[calc(100%-30px)] text-sm font-normal text-gray-500">
        Shipping
      </div>
    ),
  },
  100: {
    label: (
      <div className="pl-4 m-3 mt-3 max-w-[calc(100%-30px)] text-sm font-normal text-gray-500">
        Delivered
      </div>
    ),
  },
};
// const status = [
//    "Ordered Successfully",
//    "Shop Received",
//    "Getting Product",
//    "Packing",
//    "Shipping handover",
//    "Shipping",
//    "Delivered",
// ];
const OrderTracking = () => {
  const router = useRouter();
  const {
    data: order,

    isSuccess,
  } = useOrderDetail(router.query.id as string, router.isReady, true);
  if (!isSuccess) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {!router?.asPath?.startsWith("/admin") && (
          <>
            <h3 className=" text-2xl text-center">
              Order tracking #{router.query.id}
            </h3>
            <Button
              type="primary"
              className="rounded-sm"
              onClick={() => {
                router.push(`/customer/order/${router.query.id}`);
              }}
            >
              View Order Details
            </Button>
          </>
        )}
      </div>
      <div>
        <h3>ORDER STATUS</h3>
        <div className="px-4 pt-6 pb-2 mt-3 bg-white rounded-sm">
          <h3 className="text-sm">
            Status :{" "}
            <span className="font-medium">
              <span
                className={order.status === "Cancelled" ? "text-red-500" : ""}
              >
                {" "}
                {order.status}
              </span>{" "}
              {"  |  "}
              {dayjs(order.statusTime.at(0))
                .format("kk:mm dddd, DD/MM/YYYY")
                .replace("24:", "00:")}
              {/* Successful delivery {"  |  "}
                     {dayjs(Date.now()).format(" h:mm dddd, DD/MM/YYYY")} */}
            </span>
          </h3>
          <div
            className={
              order.status !== "Cancelled" ? " px-12 pt-6 pb-8" : "px-12 pt-6 "
            }
          >
            {order.status !== "Cancelled" && (
              <Slider
                marks={marks}
                value={value[order.statusTime.length - 1]}
                step={16.66}
                dots={true}
                className="h-5 Slider"
                tipFormatter={null}
              />
            )}
          </div>
        </div>
        <div className="mt-4">
          {" "}
          <h2>DETAILS OF ORDER STATUS</h2>
          <div className="p-4 mt-4 bg-white rounded-sm">
            <OrderStatus
              statusTime={order.statusTime}
              orderStatus={order.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
