import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";

import { useCalculateFee } from "@/src/react-query/hooks/order/useCalculateFee";
import { useMutationCreateOrder } from "@/src/react-query/hooks/order/useMutationCreateOrder";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import type { RootState } from "@/src/redux/store";
import { Coupon } from "@/src/types/coupon";
import { convertAddress2Id } from "@/src/utils/convertAddress2Id";
import { totalCalculatePrice } from "@/utils/totalCalculatePrice";

export default function Paypal() {
  const { data: user } = useUserData(false, false);
  const { data: feeResult } = useCalculateFee(
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
  const { mutate: createOrder } = useMutationCreateOrder();

  const handleSuccess = async (data: any, actions: any) => {
    const { update_time, status, id, purchase_units } =
      await actions.order.capture();

    // const user = queryClient.getQueryData<User>(queryKeys.getUserData);

    const totalPrice = Number(
      user.cart
        .reduce((acc: any, current: any) => {
          if (current.check) {
            return acc + current.product.currentPrice * current.quantity;
          }
          return acc;
        }, 0)
        .toFixed(2) || 0,
    );
    const shippingPrice = Number(feeResult ? feeResult?.total || 0 : 0);
    const discountPrice = Number(couponObject?.discount) || 0;
    const total = Number(
      totalCalculatePrice(totalPrice, discountPrice, shippingPrice),
    );
    // const total = Number(
    //    (totalPrice + shippingPrice - discountPrice).toFixed(2)
    // );
    const paymentMethod = "paypal";
    const address = `${user.addressList[0].address} , ${user.addressList[0].ward} , ${user.addressList[0].district} , ${user.addressList[0].city}`;
    const { phone } = user.addressList[0];
    const paymentResult = {
      id,
      status,
      created: update_time,
      receipt_email: user.email,
      receipt_name: user.addressList[0].name,
    };
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
    // console.log({
    //    user: user._id,
    //    orderItems,
    //    address,
    //    paymentMethod,
    //    paymentResult,
    //    totalPrice,
    //    shippingPrice,
    //    discountPrice,
    //    total,
    //    phone,
    // });
    createOrder({
      order: {
        // user: user._id,
        orderItems,
        address,
        paymentMethod,
        paymentResult,
        totalPrice,
        shippingPrice,
        discountPrice,
        total,
        phone,
        couponId: couponObject?._id,
      },
    });
  };
  const handleError = (err: any) => {
    console.log(err);
  };
  const handleOrder = (data: any, actions: any) => {
    // const user = queryClient.getQueryData<User>(queryKeys.getUserData);
    const totalPrice =
      user.cart.reduce((acc: any, current: any) => {
        if (current.check) {
          return acc + current.product.currentPrice * current.quantity;
        }
        return acc;
      }, 0) || 0;
    const shippingPrice = Number(feeResult ? feeResult?.total || 0 : 0);
    const discountPrice = Number(couponObject?.discount) || 0;
    const total = Number(
      (totalPrice + shippingPrice - discountPrice).toFixed(2),
    );
    // console.log(total);
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "Pay to buy products",
          amount: {
            currency_code: "USD",
            value: total,
          },
        },
      ],
    });
  };
  return (
    <PayPalScriptProvider
      options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
    >
      <PayPalButtons
        className="mt-10"
        // fundingSource={FUNDING.PAYPAL}
        createOrder={handleOrder}
        fundingSource="paypal"
        onApprove={handleSuccess}
        onError={handleError}
      />
    </PayPalScriptProvider>
  );
}
