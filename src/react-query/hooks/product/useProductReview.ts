import queryString from "query-string";
import { useQuery } from "react-query";

import { axiosInstance } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import isEmpty from "@/utils/is-empty";
import notEmpty from "@/utils/not-empty";

const getProductReview = async (query: any) => {
  const queryFilter = queryString.stringify(
    {
      page: isEmpty(query.page) ? null : query.page,
      limit: isEmpty(query.limit) ? 5 : query.limit,
      rating: isEmpty(query.rating) || query.rating === 6 ? null : query.rating,

      // averageRating: isEmpty(query.rating) ? null : `>=${query.rating}`,
      sort: notEmpty(query.rating) && query.rating === 6 ? "-createdAt" : null,
    },
    {
      skipNull: true,
    },
  );
  const { data } = await axiosInstance.get(
    `/api/products/${query.id}/review?${queryFilter}`,
  );

  return data;
};

export const useProductReview = (
  id: string | string[],
  page: number,
  limit: string | number,
  rating: number,
  enabled = false,
) => {
  return useQuery(
    [queryKeys.getProductReview, { id, page, limit, rating }],
    () => getProductReview({ id, page, limit, rating }),
    {
      onSuccess: (review) => {
        // message.success(`Get Product Review Successfully`);
      },
      enabled: !!id && enabled,
    },
  );
};
