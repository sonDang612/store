import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import { replaceSpecialChars } from "@/src/utils/replaceSpecialChars";
import { convertCategory } from "@/utils/convertCategory";
import isEmpty from "@/utils/is-empty";

const getProductsSearch = async (query: any) => {
  const { data } = await axiosInstance.get(`/api/products/search`, {
    params: {
      currentPrice: isEmpty(query.price)
        ? null
        : [`>=${query.price.split(",")[0]}`, `<=${query.price.split(",")[1]}`],

      averageRating: isEmpty(query.rating) ? null : `>=${query.rating}`,
      sort: isEmpty(query.sort) ? null : query.sort,
      page: isEmpty(query.page) ? null : query.page,
      name: isEmpty(query.name) ? null : `~${replaceSpecialChars(query.name)}`,
      // !co slice roi thi khoi select image nua
      fields:
        "name,currentPrice,averageRating,sold,discount,slug,category,numReviews,tableInformation,countInStock",
      limit: 12,
      maxMin: true,
      active: "!false",
      category: isEmpty(query.category)
        ? null
        : `${convertCategory(query.category)}`,
    },
  });

  return data;
};

export const useListProductsSearch = (
  page: string | string[],
  name: string | string[],
  category: string | string[],
  price: string | string[],
  rating: string | string[],
  sort: string | string[],
  isReady: boolean,
) => {
  return useQuery(
    [
      queryKeys.getProductsSearch,
      { page, name, category, price, rating, sort },
    ],
    () => getProductsSearch({ page, name, category, price, rating, sort }),
    {
      onSuccess: (products) => {
        // message.success(`Get List Product Category Successfully`);
      },

      enabled: Boolean(isReady),
    },
  );
};
