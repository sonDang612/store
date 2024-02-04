import axios from "axios";
// import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

import { convertCurrency } from "@/src/utils/convertCurrency";
import { asyncHandler } from "@/utils/asyncHandler";
import base from "@/utils/base";

const handler = base().post(
  asyncHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req;
    const config = {
      app_id: 2553,
      key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
      // endpoint: "https://sb-openapi.zalopay.vn/v2/create",
      endpoint:
        "https://zlpdev-mi-zlpdemo.zalopay.vn/zlp-demo/v2/api/create_order",
    };

    let searchParams: URLSearchParams | string = new URLSearchParams({
      payload: JSON.stringify(body),
    });
    if (searchParams) searchParams = `?${searchParams}`;
    const embedData = {
      redirecturl: `${process.env.NEXT_PUBLIC_URL_REDIRECT_PAYMENT}/customer/order/success${searchParams}`,
    };
    let { result: amount } = await convertCurrency(Number(body.order.total));
    amount = Math.round(amount);
    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${dayjs().format("YYMMDD")}_${transID}`,
      app_user: "culi",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embedData),
      amount,
      description: `Pay for product #${transID}`,
      bank_code: "zalopayapp",
      key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    };
    // const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    // order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const { data: result } = await axios.post(config.endpoint, null, {
      params: order,
    });

    res.json(JSON.parse(result?.response_data));
  }),
);
export default handler;
