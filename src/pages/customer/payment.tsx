/* eslint-disable complexity */
import {
  Button,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Spin,
} from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import ProductPayment from "@/components/Payment/ProductPayment";
import Paypal from "@/components/PayPal/PayPal";
import PaymentStripe from "@/components/Stripe/PaymentStripe";
import { useMutationCheckCoupon } from "@/src/react-query/hooks/coupon/useMutationCheckCoupon";
import { useCalculateFee } from "@/src/react-query/hooks/order/useCalculateFee";
import { useMutationCreateOrder } from "@/src/react-query/hooks/order/useMutationCreateOrder";
import { useMoMo } from "@/src/react-query/hooks/payment/useMoMo";
import { useZaloPay } from "@/src/react-query/hooks/payment/useZaloPay";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { Coupon } from "@/src/types/coupon";
import { convertAddress2Id } from "@/src/utils/convertAddress2Id";
import isEmpty from "@/utils/is-empty";
import notEmpty from "@/utils/not-empty";
import { renderOnlyOnClient } from "@/utils/renderOnlyOnClient";
import { totalCalculatePrice } from "@/utils/totalCalculatePrice";

let discountPayment = "";
const numAddress = 0;
const Payment = () => {
  const [method, setMethod] = useState<
    "cash" | "zaloPay" | "MoMo" | "paypal" | "stripe"
  >("cash");
  const [open, setOpen] = useState(false);
  const actions = useActions();
  const couponObject = useSelector<RootState, Coupon | {}>(
    (state) => state.coupon.coupon,
  ) as Coupon;
  if (couponObject?.discount) discountPayment = couponObject?.name;
  const { mutate: createOrder, isLoading: isLoadingCreateOrder } =
    useMutationCreateOrder();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: user, isLoading } = useUserData();

  const { data: feeResult, isLoading: isLoadingCalculateFee } = useCalculateFee(
    convertAddress2Id({
      toDistrictName: user?.addressList?.length
        ? user?.addressList[0].district
        : "",
      toWardName: user?.addressList?.length ? user?.addressList[0].ward : "",
    }),
    !!user && user.addressList.length > 0,
  );

  const { mutate: checkCoupon } = useMutationCheckCoupon();
  const { mutate: getQrCodeZaloPay } = useZaloPay();
  const { mutate: getQrCodeMoMo } = useMoMo();
  const [coupon, setCoupon] = useState(discountPayment);

  const router = useRouter();

  const onChange = (e: any) => {
    setMethod(e.target.value);
  };
  const getTotalPrice = () =>
    user.cart.reduce((acc: any, current: any) => {
      if (current.check) {
        return acc + current.product.currentPrice * current.quantity;
      }
      return acc;
    }, 0) || 0;
  const calculatePayment = () => {
    const totalPrice = getTotalPrice();
    const shippingPrice = Number(feeResult ? feeResult?.total || 0 : 0);
    const discountPrice = Number(couponObject?.discount) || 0;
    const total = Number(
      totalCalculatePrice(totalPrice, discountPrice, shippingPrice),
    );
    const orderItems = user.cart
      .map((product: any) => {
        if (product.check) {
          return {
            name: product.product.name,
            quantity: product.quantity,
            image: product.product.image[0],
            price: product.product.currentPrice,
            product: product.product._id,
          };
        }
        return undefined;
      })
      .filter(Boolean);

    const address = `${user.addressList[0].address} , ${user.addressList[0].ward} , ${user.addressList[0].district} , ${user.addressList[0].city}`;
    const { phone } = user.addressList[0];
    const couponId = couponObject?._id;
    const paymentResult = {
      receipt_email: user.email,
      receipt_name: user.addressList[0].name,
    };
    return {
      totalPrice,
      shippingPrice,
      discountPrice,
      total,
      orderItems,
      address,
      phone,
      couponId,
      paymentResult,
    };
  };
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOrder = () => {
    if (user.addressList.length === 0) {
      message.info("You have not selected a shipping address yet");
      router.push("/customer/address");
      return;
    }
    const paymentInfor = calculatePayment();
    const orderPayload = {
      order: {
        user: user._id,
        paymentMethod: method,
        ...paymentInfor,
      },
    };
    if (method === "cash") {
      createOrder(orderPayload);
    } else if (method === "zaloPay") {
      // const paymentMethod = "zaloPay";
      // const paymentResult = {
      //   receipt_email: user.email,
      //   receipt_name: user.addressList[0].name,
      //   status: "success",
      //   created: Date.now(),
      //   id: router.query.apptransid,
      // };
      getQrCodeZaloPay(orderPayload);
    } else if (method === "MoMo") {
      // const paymentMethod = "MoMo";
      //   const paymentResult = {
      //     receipt_email: user.email,
      //     receipt_name: user.addressList[0].name,
      //     status: "success",
      //     created: Date.now(),
      //     id: router.query.requestId,
      //   };
      getQrCodeMoMo(orderPayload);
    } else showModal();
  };

  const handleCheckCoupon = () => {
    if (isEmpty(coupon)) return;
    checkCoupon({
      name: coupon,
    });
  };
  const calculateFee = () => {
    if (getTotalPrice() > 0) {
      return Number(isLoadingCalculateFee ? "..." : feeResult?.total || 0);
    }
    return 0;
  };
  if (isLoading || isEmpty(user)) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="py-3 pl-3 mx-auto max-w-[1270px] min-h-screen">
      {/* <h2 className="text-2xl font-semibold text-gray-600">
            Choose a form of payment
         </h2> */}
      <Modal
        title={
          <h2>
            Pay by <span className="capitalize">{method}</span>
          </h2>
        }
        open={isModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null}
        forceRender={true}
        className="rounded-md"
      >
        <div className="-mt-5">{method === "paypal" && <Paypal />}</div>
        <div>{method === "stripe" && <PaymentStripe />}</div>
      </Modal>
      <Row className="mt-3">
        <Col flex="910px" className="mt-3">
          <h2 className="text-2xl font-semibold text-gray-600">
            1. Order Details
          </h2>
          <div className="py-3 px-5 mt-3 rounded-sm border-[1px] border-gray-300 border-solid">
            {user.cart.map((product: any, i: any) => {
              if (product.check) {
                return (
                  <div key={product.product._id}>
                    <ProductPayment product={product} />
                    {/* {products[i + 1] && <Divider />} */}
                  </div>
                );
              }
              return <div key={i}></div>;
            })}
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-gray-600">
            2. Choose a form of payment
          </h2>
          <div className=" py-3 px-5 mt-3 rounded-sm border-[1px] border-gray-300 border-solid">
            <Radio.Group
              onChange={onChange}
              value={method}
              className="flex flex-col space-y-7"
              size="large"
              name="methodPayment"
            >
              <Radio value="cash">
                <div className=" flex items-center ml-5 space-x-5 translate-y-2">
                  <img src="/images/cash.svg" alt="cash" />
                  <h4 className="text-base"> Cash payment on delivery</h4>
                </div>
              </Radio>
              <div className="">
                <Radio value="paypal" className="">
                  <div className="flex items-center ml-5 space-x-5 translate-y-2">
                    <img
                      src="/images/paypal.png"
                      alt="cash"
                      className="w-8 h-8"
                    />
                    <h4 className="text-base"> Pay by Paypal</h4>
                  </div>
                </Radio>
              </div>

              <Radio value="stripe" className="">
                <div className="flex items-center ml-5 space-x-5 translate-y-2">
                  <img
                    src="/images/stripe2.png"
                    alt="cash"
                    className="w-14 -translate-x-2"
                  />

                  <h4 className=" text-base -translate-x-6">Pay by Stripe</h4>
                </div>
              </Radio>
              <Radio value="zaloPay" className="">
                <div className="flex items-center ml-5 space-x-5 translate-y-2">
                  <img
                    src="/images/zalo-pay.jpg"
                    alt="cash"
                    className="w-8 h-8"
                  />
                  <h4 className="text-base">Zalo pay wallet</h4>
                </div>
              </Radio>
              <Radio value="MoMo" className="">
                <div className="flex items-center ml-5 space-x-5 translate-y-2">
                  <img
                    src="/images/logo-momo.png"
                    alt="cash"
                    className="w-8 h-8"
                  />
                  <h4 className="text-base">MoMo wallet</h4>
                </div>
              </Radio>
            </Radio.Group>
          </div>
        </Col>
        <Col flex="1" className="pt-14 ml-7 rounded-sm">
          <div className="p-3 bg-white rounded-sm border-[1px] border-gray-300 border-solid">
            <div className=" flex justify-between items-center">
              <div className="text-base">Delivery address</div>
              <div>
                <Button
                  type="ghost"
                  className="rounded-md"
                  onClick={() => router.push("/customer/address")}
                >
                  Change
                </Button>
              </div>
            </div>
            <Divider className="!my-3" />
            <div className="space-y-1">
              <div className=" ">
                <h2 className="text-base font-medium">
                  {user.addressList[0].name}
                </h2>
              </div>
              <h3 className=" mt-1 text-xs">
                {user.addressList.length > 0
                  ? `${user.addressList[numAddress].address} , ${user.addressList[numAddress].ward} , ${user.addressList[numAddress].district} , ${user.addressList[numAddress].city}`
                  : "You haven't set address yet"}
              </h3>
              <h2 className="text-xs">
                Phone: {user.addressList[numAddress].phone}
              </h2>
            </div>
          </div>
          <div className="p-3 mt-4 bg-white rounded-sm border-[1px] border-gray-300 border-solid">
            <h3 className="">Promotion</h3>
            <div className="flex mt-2 space-x-3 text-sm">
              <Input
                value={
                  isEmpty(couponObject?.name)
                    ? coupon || discountPayment
                    : couponObject.name
                }
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                disabled={notEmpty(couponObject)}
                placeholder="Enter your promotion"
                prefix={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                  >
                    <g fill="none" fillRule="evenodd">
                      <path
                        fill="#0D5CB6"
                        d="M18.549 4c.757 0 1.378.73 1.445 1.662L20 5.83v1.958c-1.268.247-2.222 1.323-2.222 2.613s.954 2.366 2.222 2.613v1.958c0 .954-.58 1.737-1.32 1.822l-.131.007H1.452c-.757 0-1.379-.73-1.446-1.662l-.005-.167L0 13.013c1.268-.246 2.223-1.323 2.223-2.613S1.268 8.033 0 7.787V5.829c0-.954.58-1.737 1.32-1.822L1.452 4h17.097zM1.517 5.065l-.067.002c-.11.012-.292.247-.33.617l-.008.145-.002 1.197.09.041c1.217.591 2.051 1.772 2.128 3.128l.006.205c0 1.44-.857 2.712-2.134 3.333l-.09.04.001 1.162.004.13c.027.38.195.612.3.66l.037.008 17.031.002.067-.002c.11-.012.292-.247.331-.617l.008-.144-.001-1.2-.088-.04c-1.217-.59-2.05-1.772-2.127-3.127l-.006-.205c0-1.44.856-2.712 2.133-3.332l.088-.042.002-1.161-.004-.13c-.028-.38-.195-.612-.3-.66l-.037-.008-17.032-.002zM12.5 12c.46 0 .833.358.833.8 0 .442-.373.8-.833.8-.46 0-.834-.358-.834-.8 0-.442.373-.8.834-.8zm.442-4.424c.217.208.24.531.072.765l-.072.083-5 4.8c-.244.235-.64.235-.884 0-.217-.208-.241-.531-.072-.765l.072-.083 5-4.8c.244-.235.64-.235.884 0zM7.5 7.2c.46 0 .833.358.833.8 0 .442-.373.8-.833.8-.46 0-.834-.358-.834-.8 0-.442.374-.8.834-.8z"
                      />
                    </g>
                  </svg>
                }
                onPressEnter={
                  isEmpty(couponObject)
                    ? handleCheckCoupon
                    : () => actions.setCouponReducer({})
                }
              />
              <Button
                type="primary"
                className="rounded-sm"
                onClick={
                  isEmpty(couponObject)
                    ? handleCheckCoupon
                    : () => actions.setCouponReducer({})
                }
              >
                {isEmpty(couponObject) ? "Apply" : "Change"}
              </Button>
            </div>
          </div>
          <div className="p-5 pb-3 mt-4 space-y-2 bg-white rounded-sm border-[1px] border-gray-300 border-solid">
            <div className=" flex justify-between items-center">
              <div className="">
                <h4 className="text-base">Your products</h4>
                <h4 className="flex items-center text-xs">
                  {user.cart.filter((pd: any) => pd.check).length} product.
                  <Button
                    type="link"
                    className="text-xs"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? "Collapse" : "See information"}
                  </Button>
                </h4>
              </div>
              <div>
                <Button
                  type="ghost"
                  className="rounded-md"
                  onClick={() => router.push("/customer/cart")}
                >
                  Change
                </Button>
              </div>
            </div>

            {open &&
              user.cart.map((product: any, i: any) => {
                if (product.check) {
                  return (
                    <div key={product.product._id}>
                      <Divider className="!my-2" />
                      <Row>
                        <Col flex="13%" className="text-[12px] font-medium">
                          {product.quantity} x{" "}
                        </Col>
                        <Col
                          flex="55%"
                          className=" text-[12px]"
                          style={{ color: "#0d5cb6" }}
                        >
                          {product.product.name}{" "}
                        </Col>
                        <Col flex="1" className="pl-5 text-[12px] text-left">
                          $
                          {(
                            product.product.currentPrice * product.quantity
                          ).toFixed(2)}
                        </Col>
                      </Row>
                    </div>
                  );
                }
                return <div key={i}></div>;
              })}

            <Divider className="!my-4" />
            <Row>
              <Col span={12} className="text-sm text-gray-500">
                Provisional price
              </Col>
              <Col span={12} className="text-right">
                $ {getTotalPrice().toFixed(2)}
              </Col>
            </Row>
            <Row>
              <Col span={12} className="text-sm text-gray-500">
                Discount
              </Col>
              <Col span={12} className="text-right">
                {notEmpty(couponObject) && `$ ${couponObject.discount}`}
              </Col>
            </Row>
            <Row>
              <Col span={12} className="text-sm text-gray-500">
                Shipping fee
              </Col>
              <Col span={12} className="text-right">
                {/* $ {(getTotalPrice() * 0.01).toFixed(2)} */}${" "}
                {Number(calculateFee() || 0)}
              </Col>
            </Row>
            <Divider className="!my-5" />
            <Row>
              <Col span={12} className="text-base text-gray-500">
                Total
              </Col>
              <Col
                span={12}
                className="text-2xl font-medium text-right text-red-500"
              >
                ${" "}
                {totalCalculatePrice(
                  getTotalPrice(),
                  couponObject?.discount || 0,
                  Number(calculateFee() || 0),
                )}
              </Col>
            </Row>
          </div>
          <div className="mt-2 bg-white">
            <Button
              type="primary"
              block
              className=" flex justify-center items-center h-8 text-base rounded-sm"
              danger
              loading={isLoadingCreateOrder}
              onClick={handleOrder}
            >
              Order
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default renderOnlyOnClient(Payment);
