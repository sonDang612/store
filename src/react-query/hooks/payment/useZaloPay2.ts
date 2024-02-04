import { message } from "antd";
import axios from "axios";
import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

import { removeEmpty } from "@/utils/removeEmpty";

const getUrlZaloPay = async ({
  couponObject,
  discountPrice,
  total,
  shippingPrice,
}: any) => {
  const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create",
  };

  let searchParams: URLSearchParams | string = new URLSearchParams(
    removeEmpty({
      couponId: couponObject?._id,
      discount: discountPrice,
      method: "zaloPay",
      shippingPrice,
    }),
  );
  if (searchParams) searchParams = `?${searchParams}`;
  const embed_data = {
    redirecturl: `${process.env.NEXT_PUBLIC_URL_REDIRECT_PAYMENT}/customer/order/success${searchParams}`,
    // redirecturl: `http://localhost:3000/customer/order/success${searchParams}`,
  };
  const items = [
    {
      // itemid: "",
      // itemname: "",
      // itemprice: 1000,
      // itemquantity: 1,
    },
  ];
  const transID = Math.floor(Math.random() * 1000000);
  const order: any = {
    app_id: config.app_id,
    app_trans_id: `${dayjs().format("YYMMDD")}_${transID}`,
    app_user: "culi",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: parseInt(total, 10) * 23000,
    // amount: +parseInt(total) + 1000,
    description: `Pay for product #${transID}`,
    bank_code: "zalopayapp",
    // callback_url: "http://localhost:3000/api/test",
    // redirect_url: "http://localhost:3000",
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;

  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  const { data: result } = await axios.post(config.endpoint, null, {
    params: order,
  });

  return result.order_url;
};

export const useZaloPay = () => {
  const router = useRouter();
  return useMutation(getUrlZaloPay, {
    onSuccess: (urlQrCode) => {
      router.push(urlQrCode);
    },
  });
};
