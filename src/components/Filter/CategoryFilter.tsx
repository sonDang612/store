import { Checkbox } from "antd";
import { useRouter } from "next/router";
import React from "react";

import { useMounted } from "@/hook/useMounted";
import { FILTER_CATEGORY } from "@/src/constant";
import isEmpty from "@/utils/is-empty";

const CategoryFilter: React.FC<any> = ({ handleFilter }) => {
  const { hasMounted } = useMounted();
  const router = useRouter();
  const checkCategory = (cat: any) => {
    if (isEmpty(router.query.category) && cat === "all") return true;
    if (router.query.category === cat) return true;
    return false;
  };
  return (
    <ul className="space-y-2">
      {FILTER_CATEGORY.map((cat, i) => {
        return (
          <li key={i}>
            <div
              // href={`/FILTER_CATEGORY/${cat}`}
              // passHref
              className="inline-block"
              onClick={
                () => {
                  delete router.query.price;
                  handleFilter("category", cat !== "all" ? cat : null);
                }
                // handleClickCategory(i, cat)
              }
            >
              <Checkbox checked={hasMounted ? checkCategory(cat) : false}>
                <span className="text-sm text-gray-500 capitalize">
                  {cat
                    .replace(/-/g, " ")
                    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                      letter.toUpperCase(),
                    )}
                </span>
              </Checkbox>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default CategoryFilter;
