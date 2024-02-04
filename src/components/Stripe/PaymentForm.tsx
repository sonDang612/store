import {
  CardElement,
  CardElementProps,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "antd";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

import { useCalculateFee } from "@/src/react-query/hooks/order/useCalculateFee";
import { useMutationCreateOrder } from "@/src/react-query/hooks/order/useMutationCreateOrder";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { RootState } from "@/src/redux/store";
import { Coupon } from "@/src/types/coupon";
import { convertAddress2Id } from "@/src/utils/convertAddress2Id";
import { totalCalculatePrice } from "@/utils/totalCalculatePrice";

const CARD_OPTIONS: CardElementProps["options"] = {
  iconStyle: "solid",
  style: {
    base: {
      // iconColor: "#1de020",
      iconColor: "#c4f0ff",
      color: "#232426",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    // invalid: {
    //    iconColor: "#f03737",
    //    color: "#f03737",
    // },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

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
  const { mutate: createOrder, isLoading } = useMutationCreateOrder();
  const [loadingStripe, setLoadingStripe] = useState(false);
  const handleSubmit = async () => {
    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    const { error, paymentMethod } = result;
    if (!error) {
      try {
        setLoadingStripe(true);

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
        const { id } = paymentMethod;
        const response = await axios.post("/api/payment", {
          amount: parseInt(total.toFixed(2)) * 100,
          id,
          email: user.email,
        });
        const {
          created,
          status,
          id: idResult,
          amount,
          receipt_email,
        } = response.data;

        const paymentMethod2 = "Stripe Card";
        const address = `${user.addressList[0].address} , ${user.addressList[0].ward} , ${user.addressList[0].district} , ${user.addressList[0].city}`;
        const { phone } = user.addressList[0];
        const paymentResult = {
          id: idResult,
          status,
          created: new Date(+created * 1000),
          receipt_email,
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

        createOrder({
          order: {
            // user: user._id,
            orderItems,
            address,
            paymentMethod: paymentMethod2,
            paymentResult,
            totalPrice,
            shippingPrice,
            discountPrice,
            total,
            phone,
            couponId: couponObject?._id,
          },
        });
      } catch (error) {
        setLoadingStripe(false);
        console.log("Error", error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <div className=" mt-7 space-y-5 text-black">
      <div className="p-3 border-[1px] border-gray-300 border-solid">
        <CardElement options={CARD_OPTIONS} />
      </div>

      <Button
        type="primary"
        danger
        block
        className=" rounded-md"
        onClick={handleSubmit}
        loading={loadingStripe || isLoading}
      >
        {" "}
        Pay
      </Button>
    </div>
  );
};
export default PaymentForm;
