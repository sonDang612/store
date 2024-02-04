import { Button, Checkbox, Divider, Input, Tag } from "antd";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

import {
  PRODUCT_CATEGORY_COLOR,
  TAG_CATEGORIES,
  TAG_RATING,
} from "@/src/constant";
import { AdminProductType } from "@/src/redux/reducers/adminProductReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";

const { CheckableTag } = Tag;
const FilterProduct: React.FC<any> = () => {
  const { category, rating, showDeleted } = useSelector<
    RootState,
    AdminProductType["search"]
  >((state) => state.adminProduct.search);
  const multipleRating = useSelector<
    RootState,
    AdminProductType["multipleRating"]
  >((state) => state.adminProduct.multipleRating);
  const multipleCategory = useSelector<
    RootState,
    AdminProductType["multipleCategory"]
  >((state) => state.adminProduct.multipleCategory);
  const actions = useActions();
  const onSearch = (value: any) => {
    actions.setSearchAdminProductState({
      name: value,
    });
  };
  const handleChangeCategory = (tag: any, checked: any) => {
    let nextSelectedCategory;
    if (multipleCategory) {
      nextSelectedCategory = checked
        ? [...category, tag]
        : category.filter((t: any) => t !== tag);
    } else nextSelectedCategory = checked ? [tag] : [];
    actions.setSearchAdminProductState({
      category: nextSelectedCategory,
      page: 1,
    });
  };
  const handleChangeRating = (tag: any, checked: any) => {
    let nextSelectedRating;
    if (multipleRating) {
      nextSelectedRating = checked
        ? [...rating, tag]
        : rating.filter((t: any) => t !== tag);
    } else nextSelectedRating = checked ? [tag] : [];
    actions.setSearchAdminProductState({
      rating: nextSelectedRating,
      page: 1,
    });
  };
  return (
    <div className="py-7 px-5">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center">
          <Input.Search
            placeholder="Search product"
            allowClear
            onSearch={onSearch}
            enterButton="Search"
            style={{ width: "40%" }}
            className="mr-6"
          />
          <Checkbox
            onChange={() =>
              actions.setSearchAdminProductState({
                showDeleted: !showDeleted,
                page: 1,
              })
            }
            checked={showDeleted}
            className="self-end mr-6"
          >
            Show deleted products
          </Checkbox>
          <Button
            type="primary"
            className="rounded-sm"
            onClick={() => {
              actions.setSearchAdminProductState({
                category: [],
                rating: [],
              });
            }}
          >
            Clear all
          </Button>
          <Link
            type="default"
            href="/admin/products/create"
            passHref
            className="z-50"
          >
            <a className="ml-auto rounded-sm border-[1px] border-gray-200 hover:border-[#1890FF] border-solid duration-500 cursor-pointer">
              <span className="inline-block py-1 px-2 hover:text-[#1890FF] duration-500">
                Create
              </span>
            </a>
          </Link>
          {/* </div> */}
        </div>
        <div className="flex items-center">
          <span style={{ marginRight: 12 }} className="text-gray-600">
            Categories:
          </span>
          {TAG_CATEGORIES.map((tag: any) => {
            const isChecked = category.indexOf(tag) > -1;
            return (
              <div key={tag}>
                <CheckableTag
                  style={{
                    backgroundColor: isChecked
                      ? PRODUCT_CATEGORY_COLOR[tag]
                      : undefined,
                  }}
                  checked={isChecked}
                  onChange={(checked) => handleChangeCategory(tag, checked)}
                  className="text-xs"
                >
                  {tag}
                </CheckableTag>
                <Divider type="vertical" />
              </div>
            );
          })}
          <Button
            type="primary"
            size="small"
            onClick={() => actions.setSearchAdminProductState({ category: [] })}
            className="mr-5 text-xs"
          >
            {" "}
            Clear
          </Button>
          <Checkbox
            onChange={() =>
              actions.setAdminProductState({
                multipleCategory: !multipleCategory,
              })
            }
            checked={multipleCategory}
          >
            Multiple
          </Checkbox>
        </div>
        <div className="flex items-center">
          <span style={{ marginRight: 40 }} className="text-gray-600">
            Rating:
          </span>
          {TAG_RATING.map((tag) => {
            const isChecked = rating.indexOf(tag) > -1;
            return (
              <div key={tag}>
                <CheckableTag
                  checked={isChecked}
                  onChange={(checked) => handleChangeRating(tag, checked)}
                >
                  <div className=" flex items-center space-x-1">
                    <span className=" ">{tag}</span>
                    <span>star</span>
                  </div>
                </CheckableTag>
                <Divider type="vertical" />
              </div>
            );
          })}
          <Button
            type="primary"
            size="small"
            onClick={() => actions.setSearchAdminProductState({ rating: [] })}
            className="mr-5 text-xs"
          >
            {" "}
            Clear
          </Button>
          <Checkbox
            onChange={() =>
              actions.setAdminProductState({ multipleRating: !multipleRating })
            }
            checked={multipleRating}
          >
            Multiple
          </Checkbox>
        </div>
      </div>
    </div>
  );
};

export default FilterProduct;
