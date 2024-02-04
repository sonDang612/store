import axios from "axios";
import { useQuery } from "react-query";

import { queryKeys } from "@/src/react-query/constants";

export type FeePayload = { toDistrictId: number; toWardCode: number };
const calculateFee = async ({ toDistrictId, toWardCode }: FeePayload) => {
  // "DistrictID": 3695,
  // "ProvinceID": 202,
  // "DistrictName": "Thành Phố Thủ Đức",
  //   {
  //     "service_id": 100036,
  //     "short_name": "",
  //     "service_type_id": 0
  // },
  // {
  //     "service_id": 53319,
  //     "short_name": "Bay",
  //     "service_type_id": 1
  // },
  // {
  //     "service_id": 53320,
  //     "short_name": "Đi bộ",
  //     "service_type_id": 2
  // },
  // {
  //     "service_id": 53330,
  //     "short_name": "",
  //     "service_type_id": 0
  // },
  // {
  //     "service_id": 53329,
  //     "short_name": "60P",
  //     "service_type_id": 0
  // },
  // {
  //     "service_id": 53324,
  //     "short_name": "",
  //     "service_type_id": 0
  // },
  // {
  //     "service_id": 53321,
  //     "short_name": "Tiết kiệm",
  //     "service_type_id": 3
  // }

  const response = await axios.get(
    `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`,
    {
      headers: { Token: process.env.NEXT_PUBLIC_GHN_TOKEN },
      params: {
        // service_id: 53321,
        shop_id: 120089,
        from_district: 3695,
        to_district: +toDistrictId,
      },
    },
  );
  const services = (response.data?.data as any[]).filter((s) => s.short_name);
  console.log(
    "🚀 ~ file: useCalculateFee.ts ~ line 60 ~ calculateFee ~ services",
    services,
  );

  const { data } = await axios.get(
    `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
    {
      headers: { Token: process.env.NEXT_PUBLIC_GHN_TOKEN },
      params: {
        // service_id: 53350,
        service_id: services[0].service_id,
        // service_type_id: 2,
        height: 50,
        width: 50,
        length: 50,
        weight: 2000,
        from_district_id: 3695,
        to_district_id: +toDistrictId,
        to_ward_code: +toWardCode,
      },
    },
  );
  return {
    ...data.data,
    total: Math.round((+data.data.total / 23000) * 100) / 100,
  };
};

export const useCalculateFee = (
  { toDistrictId, toWardCode }: FeePayload,
  enabled: boolean = false,
) => {
  return useQuery(
    [queryKeys.getFee, { toDistrictId, toWardCode }],
    () => calculateFee({ toDistrictId, toWardCode }),
    {
      onSuccess: (result) => {
        console.log(
          "🚀 ~ file: useCalculateFee.ts ~ line 71 ~ useCalculateFee ~ result",
          result,
        );
        // message.success(`Get MyOrder Successfully`);
      },
      enabled,
    },
  );
};
