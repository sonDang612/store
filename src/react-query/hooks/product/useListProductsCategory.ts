import queryString from "query-string";
import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import isEmpty from "@/utils/is-empty";

const getProductsCategory = async (query: {
  category: any;
  price: any;
  rating: any;
  sort: any;
}) => {
  const orderSort = () => {
    if (!isEmpty(query.sort)) {
      return query.sort;
    }
    return null;
  };
  const queryFilter = queryString.stringify(
    {
      price: isEmpty(query.price)
        ? null
        : [`>=${query.price.split(",")[0]}`, `<=${query.price.split(",")[1]}`],

      averageRating: isEmpty(query.rating) ? null : `>=${query.rating}`,
      sort: orderSort(),
    },
    {
      skipNull: true,
    },
  );

  const { data } = await axiosInstance.get(
    `/api/category/${query.category}?${queryFilter}`,
  );

  return data;
};

export const useListProductsCategory = (
  category: any,
  price: any,
  rating: any,
  sort: any,
  isReady: any,
) => {
  return useQuery(
    [queryKeys.getProductsCategory],
    () => getProductsCategory({ category, price, rating, sort }),
    {
      onSuccess: (products) => {
        // message.success(`Get List Product Category Successfully`);
      },

      enabled: isReady,
    },
  );
};
