import { useQuery } from "react-query";

import { axiosInstanceAdmin } from "@/src/axiosInstance";
import { queryKeys } from "@/src/react-query/constants";
import isEmpty from "@/utils/is-empty";

const getListReview = async (query: any) => {
  let ratingQuery = "";

  if (!isEmpty(query.rating)) {
    if (query.rating.length === 1) ratingQuery = `rating=${query.rating[0]}`;
    else {
      ratingQuery = query.rating.map((cat: any) => `rating[]=${cat}`).join("&");
    }
  }
  let nameSearch = "product.name";
  let search = "";
  if (!isEmpty(query.search)) {
    [nameSearch, search] = query.search.split("[]");
    //  nameSearch = query.search.split("[]")[0];
    // search = query.search.split("[]")[1];
    if (!nameSearch.includes("._id")) search = `~${search}`;
    //   else search = search.slice(1);
  }

  const { data } = await axiosInstanceAdmin.get(
    `/api/admin/reviews?${ratingQuery}`,
    {
      params: {
        [nameSearch]: query.search === "" ? null : `${search}`,
        page: isEmpty(query.page) ? null : query.page,
        //  rating: isEmpty(query.rating) ? null : `~${query.payment}`,
      },
    },
  );
  return data;
};

export const useListReview = ({ page, search, rating }: any) => {
  return useQuery(
    [queryKeys.getListReview, { page, search, rating }],
    () => getListReview({ page, search, rating }),
    {
      onSuccess: (review) => {},
      onError: (e) => {
        console.log(e);
      },
    },
  );
};
