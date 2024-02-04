import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, Modal, Row } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import MyOrderDetail from "@/components/Order/MyOrderDetail";
import UserSideBar from "@/components/SideBar/UserSideBar";
import { useMutationUpdateStatusOrder } from "@/src/react-query/hooks/order/useMutationUpdateStatusOrder";
import { useOrderDetail } from "@/src/react-query/hooks/order/useOrderDetail";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { renderOnlyOnClient } from "@/utils/renderOnlyOnClient";

const OrderDetailPage = () => {
  const { data: user } = useUserData(false, false);
  const router = useRouter();

  const { data: order }: any = useOrderDetail(router.query.id as string, false);
  const { mutate: updateStatusOrder } = useMutationUpdateStatusOrder();
  const showModal = () => {
    Modal.confirm({
      title: "Cancel Order",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel this order?",
      okText: "Sure",
      cancelText: "No",
      onOk() {
        updateStatusOrder({
          orderId: router.query.id,
          status: "Cancelled",
          isAdmin: false,
        });
      },
    });
  };

  return (
    <div>
      <div className=" min-h-[calc(100vh-70px)] bg-[#f0f2f5]">
        <div className="pt-5 ml-4 bg-[#f0f2f5]">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link href="/">Home page</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>My order</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="mt-3 bg-[#f0f2f5]">
          <Row gutter={[15, 0]}>
            <Col flex="270px">
              <Row gutter={[10, 0]} className="px-4">
                <Col flex="55px">
                  <Image
                    src="/images/blank-avatar.png"
                    alt="blank-avatar.png"
                    width={45}
                    height={45}
                    className=" rounded-[50%]"
                  />
                </Col>
                <Col flex="1 1 0%">
                  <h4 className="text-sm text-gray-500"> Account </h4>
                  <h3 className="text-base text-gray-700">
                    {user?.name || ""}
                  </h3>
                </Col>
              </Row>
              <div className="mt-3">
                <UserSideBar />
              </div>
            </Col>
            <Col flex="1 1 0%">
              <MyOrderDetail />
              {order &&
                ![
                  "Packing",
                  "Cancelled",
                  "Shipping handover",
                  "Shipping",
                  "Delivered",
                ].includes(order.status) && (
                  <div className="py-3 text-right">
                    <Button type="primary" onClick={showModal}>
                      Cancel order
                    </Button>
                  </div>
                )}
              {/* {order &&
                dayjs().diff(order.createdAt, "minute", true) <
                  +process.env.NEXT_PUBLIC_MINUTES_TO_CANCEL_ORDERS &&
                ![
                  "Packing",
                  "Cancelled",
                  "Shipping handover",
                  "Shipping",
                  "Delivered",
                ].includes(order.status) && (
                  <div className="py-3 text-right">
                    <Button type="primary" onClick={showModal}>
                      Cancel order
                    </Button>
                  </div>
                )} */}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default renderOnlyOnClient(OrderDetailPage);
