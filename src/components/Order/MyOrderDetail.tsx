/* eslint-disable react/no-unescaped-entities */
import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Row, Spin, Tag } from "antd";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useRouter } from "next/router";

import { useOrderDetail } from "@/src/react-query/hooks/order/useOrderDetail";

import OrderProduct from "./OrderProduct";

dayjs.extend(advancedFormat);
const MyOrderDetail = () => {
  const router = useRouter();

  const {
    data: order,

    isSuccess,
  } = useOrderDetail(router.query.id as string, router.isReady);

  if (!isSuccess) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      <h3 className=" px-4 mb-7 text-2xl text-center">
        Order details #{router.query.id} -{" "}
        <span className="font-semibold">{order.status}</span>
      </h3>
      <div className="flex justify-between items-center py-2">
        <div className="flex items-center space-x-2 text-sm text-right">
          <div> Order date : </div>
          <Tag color="success" icon={<CheckCircleOutlined />}>
            {" "}
            {dayjs(order.createdAt)
              .format("kk:mm - DD/MM/YYYY")
              .replace("24:", "00:")}
          </Tag>
        </div>
        {order.status !== "Cancelled" && !router?.asPath?.startsWith("/admin") && (
          <Button
            type="primary"
            shape="round"
            className="ml-1 rounded-sm"
            onClick={() =>
              router.push(`/customer/order/tracking/${router.query.id}`)
            }
          >
            Order tracking
          </Button>
        )}
      </div>
      <div>
        <Row gutter={[15, 0]}>
          <Col span={12} className=" h-10">
            <div className="space-y-3">
              <h3 className="text-base uppercase">receiver's address</h3>
              <div className=" p-4 space-y-1 min-h-[123px] bg-white rounded-md">
                <h4 className="text-base font-semibold">
                  {order.paymentResult.receipt_name}
                </h4>
                <p className="font-normal text-gray-600">
                  Address: {order.address}
                </p>
                <h3 className="font-normal text-gray-600">
                  Phone : {order.phone}
                </h3>
              </div>
            </div>
          </Col>

          <Col span={12} className=" h-full">
            <div className=" space-y-3">
              <h3 className="text-base uppercase">payment method</h3>
              <div className=" p-4 min-h-[123px] bg-white rounded-md">
                <h4 className=" text-sm text-gray-600">
                  {order.paymentMethod === "cash" && "Cash payment on delivery"}
                  {order.paymentMethod !== "cash" && (
                    <div className="text-base">
                      <h2>
                        Pay by{" "}
                        <span className="text-sm font-medium capitalize">
                          {order.paymentMethod}
                        </span>
                      </h2>
                      <h3>
                        Payment time:{" "}
                        <span className=" text-sm">
                          {dayjs(order.paymentResult.created)
                            .format("kk:mm dddd DD-MM-YYYY ")
                            .replace("24:", "00:")}
                        </span>
                      </h3>
                    </div>
                  )}

                  {/* {order.paymentMethod === "cash"
                              ? "Cash payment on delivery"
                              : `Pay by ${order.paymentMethod} at ${dayjs(
                                   order.paymentResult.created
                                ).format("dddd DD-MM-YYYY")}`} */}
                </h4>
              </div>
            </div>
          </Col>
        </Row>
        <div className="mt-7">
          <div className="bg-white rounded-sm">
            <Row className=" py-5 px-4">
              <Col flex="0 0 35%">
                <h2 className="text-[17px] text-gray-500">Product</h2>
              </Col>
              <Col flex="0 0 20%">
                <h2 className="text-[17px] text-gray-500">Price</h2>
              </Col>
              <Col flex="0 0 20%">
                <h2 className="text-[17px] text-gray-500">Quantity</h2>
              </Col>

              <Col flex="0 0 25%">
                <h2 className="pr-3 text-[17px] text-right text-gray-500">
                  Provisional price
                </h2>
              </Col>
              {/* <Col flex="0 0 450px">
                        <h2 className="text-[17px] text-gray-500">Product</h2>
                     </Col>
                     <Col flex="0 0 170px">
                        <h2 className="text-[17px] text-gray-500">Price</h2>
                     </Col>
                     <Col flex="0 0 155px">
                        <h2 className="text-[17px] text-gray-500">Quantity</h2>
                     </Col>

                     <Col flex="1 0 190px">
                        <h2 className="pr-3 text-[17px] text-right text-gray-500">
                           Provisional price
                        </h2>
                     </Col> */}
            </Row>
            <Divider className="m-0" />
            {order.orderItems.map((product: any, i: any) => {
              return (
                <div key={product._id}>
                  <OrderProduct
                    product={product}
                    orderId={router.query.id}
                    orderStatus={order.status}
                  />
                  <Divider className="m-0" />{" "}
                </div>
              );
            })}

            {/* <OrderProduct />
                  <Divider className="m-0" />
                  <OrderProduct />
                  <Divider className="m-0" /> */}
            <Row className=" py-5 pr-6">
              <Col offset={15} className=" space-y-2 w-full">
                <Row>
                  <Col span={12} className="text-base text-gray-500">
                    Provisional price
                  </Col>
                  <Col span={12} className="text-right">
                    $ {order.totalPrice}
                  </Col>
                </Row>
                <Row>
                  <Col span={12} className="text-base text-gray-500">
                    Discount
                  </Col>
                  <Col span={12} className="text-right">
                    $ {order.discountPrice}
                  </Col>
                </Row>
                <Row>
                  <Col span={12} className="text-base text-gray-500">
                    Shipping fee
                  </Col>
                  <Col span={12} className="text-right">
                    $ {order.shippingPrice}
                  </Col>
                </Row>
                <Divider className="!my-2" />
                <Row>
                  <Col span={12} className="text-base text-gray-500">
                    Total
                  </Col>
                  <Col
                    span={12}
                    className="text-2xl font-medium text-right text-red-500"
                  >
                    $ {order.total}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrderDetail;
