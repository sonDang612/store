import { useQuery } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { AdminOrderType } from "@/src/redux/reducers/adminOrderReducer";
import { convertDateToUTO } from "@/utils/convertDateToUTO";
import isEmpty from "@/utils/is-empty";

const getListOrder = async (query: any) => {
  const { data } = await axiosInstanceAdmin.get(`/api/admin/orders`, {
    params: {
      address: isEmpty(query.name) ? null : `~${query.name}`,
      _id: isEmpty(query.id)
        ? null
        : `${query.id.at(0) === "#" ? query.id.slice(1) : query.id}`,

      between: isEmpty(query.createdAt)
        ? null
        : `${convertDateToUTO(query.createdAt[0])}|${convertDateToUTO(
            query.createdAt[1],
          )}`,

      fields:
        "user,orderItems,address,paymentMethod,phone,total,status,statusTime,createdAt,paymentResult,updatedAt",
      status: isEmpty(query.status) ? null : `~${query.status}`,
      page: isEmpty(query.page) ? null : query.page,
      paymentMethod: isEmpty(query.payment) ? null : `~${query.payment}`,
    },
  });
  return data;
};

export const useListOrder = ({
  name,
  id,
  status,
  createdAt,
  payment,
  page,
}: AdminOrderType["search"]) => {
  return useQuery(
    [queryKeys.getListOrder, { page, name, id, status, payment, createdAt }],
    () => getListOrder({ name, id, status, createdAt, payment, page }),
    {
      onSuccess: (user) => {
        // message.success(`Get WishList Successfully`);
      },
      onError: (e) => {
        console.log(e);
      },
    },
  );
};
