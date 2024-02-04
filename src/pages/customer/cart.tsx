import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Spin,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import SingleProductCart from "@/components/Cart/SingleProductCart";
import { useMutationCheckCoupon } from "@/src/react-query/hooks/coupon/useMutationCheckCoupon";
import { useCalculateFee } from "@/src/react-query/hooks/order/useCalculateFee";
import { useMutationDeleteProductCart } from "@/src/react-query/hooks/user/useMutationDeleteProductCart";
import { useMutationUpdateProductCart } from "@/src/react-query/hooks/user/useMutationUpdateProductCart";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { Coupon } from "@/src/types/coupon";
import { convertAddress2Id } from "@/src/utils/convertAddress2Id";
import isEmpty from "@/utils/is-empty";
import notEmpty from "@/utils/not-empty";
import { renderOnlyOnClient } from "@/utils/renderOnlyOnClient";
import { totalCalculatePrice } from "@/utils/totalCalculatePrice";

const Cart = () => {
  const actions = useActions();
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
  const couponObject = useSelector<RootState, Coupon | {}>(
    (state) => state.coupon.coupon,
  ) as Coupon;
  const { mutate: checkCoupon } = useMutationCheckCoupon();
  const { mutate: updateCheckCart } = useMutationUpdateProductCart();
  const { mutate: deleteProductCart } = useMutationDeleteProductCart();

  const [numAddress, setNumAddress] = useState(0);

  const [coupon, setCoupon] = useState("");

  const router = useRouter();
  const showModal = () => {
    if (
      user?.cart
        .map((pd: any) => pd.check || false)
        .some((pd: any) => pd === true)
    ) {
      setIsModalVisible(true);
    } else message.info("Please select the product to delete");
  };

  const handleDeleteSelectedProduct = () => {
    deleteProductCart({});
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCheckCoupon = () => {
    if (isEmpty(coupon)) return;
    if (
      !user?.cart
        .map((pd: any) => pd.check || false)
        .some((pd: any) => pd === true)
    ) {
      return message.info("Please select product first");
    }
    checkCoupon({
      name: coupon,
    });
  };
  const handleChangeCheckAll = () => {
    updateCheckCart({
      product: {
        checkAll: !user?.cart
          .map((pd: any) => pd.check || false)
          .every((pd: any) => pd === true),
      },
    });
  };
  const totalPrice = () =>
    user.cart.reduce((acc: any, current: any) => {
      if (current.check) {
        return acc + current.product.currentPrice * current.quantity;
      }
      return acc;
    }, 0) || 0;
  const handleCheckOut = () => {
    if (user.addressList.length === 0) {
      return message.info("You have not selected a shipping address yet");
    }
    if (
      !user?.cart
        .map((pd: any) => pd.check || false)
        .some((pd: any) => pd === true)
    ) {
      return message.info("Please select a product before checkout");
    }
    router.push("/customer/payment");
  };
  const calculateFee = () => {
    if (totalPrice() > 0) {
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
  if (user.cart.length === 0) {
    return (
      <div className="min-h-[100vh] bg-[#f0f2f5]">
        <h2 className=" pt-5 pb-2 text-2xl font-medium"> CART</h2>

        <div className="flex flex-col justify-center items-center space-y-5 h-[340px] bg-white rounded-sm">
          <div>
            <Image
              src="/images/logo-cart.png"
              alt="logo-cart.png"
              width={190}
              height={160}
            />
          </div>
          <h3 className="text-lg">There are no products in your cart.</h3>
          <Button type="primary" onClick={() => router.push("/")}>
            Back Home{" "}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-[#f0f2f5]">
      <Modal
        open={isModalVisible}
        onOk={handleDeleteSelectedProduct}
        onCancel={handleCancel}
        // centered
      >
        <p>Do you want to delete the selected product ?</p>
      </Modal>

      <div className=" pt-5 bg-[#f0f2f5]">
        <h2 className=" text-2xl font-medium"> CART</h2>
      </div>
      <Row className="mt-3">
        <Col flex="910px" className="overflow-hidden">
          <div className="flex justify-between items-center py-2 px-4 mb-3 bg-white rounded-sm">
            <div className="w-[300px]">
              <Checkbox
                checked={user?.cart
                  .map((pd: any) => pd.check || false)
                  .every((pd: any) => pd === true)}
                onChange={handleChangeCheckAll}
              >
                <div className="ml-2">All ({user?.cart?.length} products)</div>
              </Checkbox>
            </div>
            <h2>Price </h2>
            <h2>Quantity </h2>
            <h2>Total </h2>
            <div className="cursor-pointer" onClick={showModal}>
              <DeleteOutlined />{" "}
            </div>
          </div>
          <div className=" p-4 pr-0 mt-5 bg-white rounded-sm">
            {user.cart.map((product: any, i: any) => {
              return (
                <div key={i}>
                  <Divider />
                  <SingleProductCart product={product} />
                </div>
              );
            })}
          </div>
        </Col>

        <Col flex="1" className="ml-7 rounded-sm">
          <div className="p-3 bg-white rounded-sm">
            <div className=" flex justify-between items-center">
              <div className="">Delivered to</div>
              <div>
                <Button
                  type="link"
                  onClick={() => router.push("/customer/address")}
                >
                  Change
                </Button>
              </div>
            </div>
            <div className="flex items-center mt-2 space-x-4 font-medium">
              <h2 className="">
                {(user.addressList.length > 0 &&
                  user.addressList[numAddress].name) ||
                  user.name}
              </h2>
              <Divider type="vertical" />
              <h2>
                {(user.addressList.length > 0 &&
                  user.addressList[numAddress].phone) ||
                  user.phone}
              </h2>
            </div>
            <h3 className="mt-1 text-xs text-gray-400">
              {isEmpty(user.addressList)
                ? "You haven't set address yet"
                : user.addressList.length > 0 &&
                  `${user.addressList[numAddress].address} , ${user.addressList[numAddress].ward} , ${user.addressList[numAddress].district} , ${user.addressList[numAddress].city}`}
            </h3>
          </div>

          <div className="p-3 mt-4 bg-white rounded-sm">
            <h3 className="">Promotion</h3>
            <div className="flex mt-2 space-x-3 text-sm">
              <Input
                value={isEmpty(couponObject?.name) ? coupon : couponObject.name}
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
          <div className="p-5 pb-3 mt-4 space-y-2 bg-white rounded-sm">
            <Row>
              <Col span={12} className="text-sm text-gray-500">
                Provisional price
              </Col>
              <Col span={12} className="text-right">
                $ {totalPrice()?.toFixed(2)}
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
                $ {calculateFee()}
                {/* $ {(totalPrice() * 0.01)?.toFixed(2)} */}
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
                {/* {formatter.format(
                           totalCalculatePrice(
                              totalPrice(),
                              couponObject?.discount || 0,
                              Number(totalPrice() * 0.01)
                           )
                        )} */}
                ${" "}
                {totalCalculatePrice(
                  totalPrice(),
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
              onClick={handleCheckOut}
            >
              Checkout
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

// export default dynamic(() => Promise.resolve(Cart), { ssr: false });
export default renderOnlyOnClient(Cart);
