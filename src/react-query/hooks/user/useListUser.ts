import { useQuery } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { convertDateToUTO } from "@/utils/convertDateToUTO";
import isEmpty from "@/utils/is-empty";

const getListUser = async (query: any) => {
  // console.log(query);

  const { data } = await axiosInstanceAdmin.get(`/api/admin/users`, {
    params: {
      name: isEmpty(query.name) ? null : `~${query.name}`,

      // between: isEmpty(query.createdAt)
      //    ? null
      //    : `${query.createdAt[0]}|${query.createdAt[1]}`,
      between: isEmpty(query.createdAt)
        ? null
        : `${convertDateToUTO(query.createdAt[0])}|${convertDateToUTO(
            query.createdAt[1],
          )}`,
      "addressList.city": isEmpty(query.city) ? null : `~${query.city}`,
      "addressList.district": isEmpty(query.district)
        ? null
        : `~${query.district}`,
      "addressList.ward": isEmpty(query.ward) ? null : `~${query.ward}`,
      page: isEmpty(query.page) ? null : query.page,
      active: query.active === true ? `!${false}` : false,
      sort: "-active",
    },
  });
  return data;
};

export const useListUser = ({
  page,
  name,
  ward,
  district,
  city,
  createdAt,
  active,
}: any) => {
  return useQuery(
    [
      queryKeys.getListUser,
      { page, name, city, district, ward, createdAt, active },
    ],
    () =>
      getListUser({
        page,
        name,
        ward,
        district,
        city,
        createdAt,
        active,
      }),
    {
      onSuccess: (user) => {
        // message.success(`Get WishList Successfully`);
      },

      // enabled: Boolean(router.isReady),
    },
  );
};
