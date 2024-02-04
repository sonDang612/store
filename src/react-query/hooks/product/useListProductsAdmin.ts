import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { AdminProductType } from "@/src/redux/reducers/adminProductReducer";
import isEmpty from "@/utils/is-empty";

const getProductsAdmin = async (query: any) => {
  let categoryQuery = "";

  if (!isEmpty(query.category)) {
    if (query.category.length === 1) {
      categoryQuery = `category=${query.category[0]}`;
    } else {
      categoryQuery = query.category
        .map((cat: any) => `category[]=${cat}`)
        // .map((cat) => `category[]=${convertCategory(cat)}`)
        .join("&");
    }
  }

  const { data } = await axiosInstance.get(
    `/api/products/search?${categoryQuery}`,
    {
      params: {
        price: isEmpty(query.price)
          ? null
          : [
              `>=${query.price.split(",")[0]}`,
              `<=${query.price.split(",")[1]}`,
            ],

        page: isEmpty(query.page) ? null : query.page,
        _id: isEmpty(query.name)
          ? null
          : query.name.startsWith("#")
          ? `${query.name.substring(1)}`
          : null,
        name: isEmpty(query.name)
          ? null
          : query.name.startsWith("#")
          ? null
          : `~${query.name}`,
        averageRating: isEmpty(query.rating)
          ? null
          : `${query.rating.join(",")}`,
        active: query.showDeleted === false ? `!${query.showDeleted}` : false,
        sort: query.showDeleted === true ? "-active" : null,
        fields:
          "active,name,price,currentPrice,averageRating,sold,brand,countInStock,category,discount,slug",
        limit: 8,
      },
    },
  );

  return data;
};

export const useListProductsAdmin = (
  { page, name, category, rating, showDeleted }: AdminProductType["search"],
  isReady: boolean,
) => {
  return useQuery(
    [queryKeys.getProductsAdmin, { page, name, category, rating, showDeleted }],
    () => getProductsAdmin({ page, name, category, rating, showDeleted }),

    {
      onError: (e) => {
        console.log(e);
      },
      enabled: Boolean(isReady),
    },
  );
};
