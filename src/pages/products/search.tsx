/* eslint-disable @next/next/no-img-element */

import { Breadcrumb, Button, Col, Pagination, Row, Slider, Spin } from "antd";
import Link from "next/link";
import React, { useState } from "react";

import CategoryFilter from "@/components/Filter/CategoryFilter";
import MenuFilter from "@/components/Filter/MenuFilter";
import RatingFilter from "@/components/Filter/RatingFilter";
import TagFilter from "@/components/Filter/TagFilter";
import { useMounted } from "@/hook/useMounted";
import { useNextQueryParams } from "@/hook/useNextQueryParams";
import Compare from "@/src/components/Compare";
import ProductCompare from "@/src/components/ProductCard/ProductCompare";
import { useListProductsSearch } from "@/src/react-query/hooks/product/useListProductsSearch";
import isEmpty from "@/utils/is-empty";
import { removeEmpty } from "@/utils/removeEmpty";

const SearchPage = () => {
  const router = useNextQueryParams();

  const { hasMounted } = useMounted();

  const [rangePrice, setRangePrice] = useState([0, 0]);

  const {
    data: products,
    isLoading,
    // isSuccess,
  } = useListProductsSearch(
    router.query.page,
    router.query.name,
    router.query.category,
    router.query.price,
    router.query.rating,
    router.query.sort,
    router.isReady,
  );

  const handleFilter = (name: any, value: any) => {
    router.push({
      pathname: "/products/search/",
      query: removeEmpty({
        ...router.query,
        page: 1,
        [name]: value,
      }),
    });
  };

  return (
    <div className="min-h-[100vh] bg-[#f0f2f5]">
      <div className="bg-[#f0f2f5]">
        <div className="pt-5 bg-[#f0f2f5]">
          <Row>
            <Col flex="270px">
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <Link href="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>All</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col flex="1">
              <div className=" flex items-center">
                <div>Filter:</div>
                <div className="ml-3 space-x-2">
                  <TagFilter handleFilter={handleFilter} />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col flex="250px" className="overflow-hidden space-y-6">
              <div className="py-5 px-7 bg-white rounded-md">
                <h2 className="mb-3 text-base font-semibold">
                  Product categories
                </h2>
                <CategoryFilter
                  handleFilter={(name: string, value: any) => {
                    // actions.clearCompareProduct();
                    handleFilter(name, value);
                  }}
                />
              </div>
              <div className="py-5 pr-9 pl-7 bg-white rounded-md">
                <h2 className="mb-3 text-base font-semibold">Ratings</h2>
                <RatingFilter handleFilter={handleFilter} />
              </div>

              <div className="py-5 space-y-5 bg-white rounded-md">
                <h2 className="pr-9 pl-7 mb-3 text-base font-semibold">
                  Filter by price
                </h2>

                <div className="pr-3 pl-4">
                  {!isLoading && (
                    <Slider
                      range
                      defaultValue={
                        router.query.price
                          ? (router.query.price as any).split(",")
                          : [0, 0]
                      }
                      // defaultValue={[0, 0]}
                      min={products?.minPrice || 0}
                      max={products?.maxPrice || 0}
                      onAfterChange={(value) => {
                        setRangePrice(value);
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between items-center pr-3 pl-7">
                  <span className="text-base text-gray-600">
                    {` Price: $ ${
                      (router.query.price as any)?.split(",")[0] || 0
                    } — $ ${(router.query.price as any)?.split(",")[1] || 0}`}
                    {/* {` Price: $ ${
                                 products?.minPrice || 0
                              } — $ ${products?.maxPrice || 0}`} */}
                  </span>
                </div>
                <Button
                  type="primary"
                  size="small"
                  className="ml-40"
                  onClick={() =>
                    handleFilter(
                      "price",
                      rangePrice[0] === 0 && rangePrice[1] === 0
                        ? null
                        : `${rangePrice[0]},${rangePrice[1]}`,
                    )
                  }
                >
                  Filter
                </Button>
              </div>
              {/* Brand */}
              {/* <div className="py-5 pr-9 pl-7 space-y-5 bg-white rounded-md">
                        <h2 className=" mb-3 text-base font-semibold">
                           Brands
                        </h2>
                        <ul className="space-y-2">
                           {brands.map((cat, i) => {
                              return (
                                 <li key={i}>
                                    <Link href={`#`} passHref>
                                       <Checkbox
                                          checked={
                                             router.query.category === cat
                                          }
                                       >
                                          <span className="text-sm text-gray-500 capitalize">
                                             {cat
                                                .replace(/ /g, " ")
                                                .replace(
                                                   /(^\w{1})|(\s+\w{1})/g,
                                                   (letter) =>
                                                      letter.toUpperCase()
                                                )}
                                          </span>
                                       </Checkbox>
                                    </Link>
                                 </li>
                              );
                           })}
                        </ul>
                     </div> */}
            </Col>
            <Col flex="1">
              <div className="pl-6">
                {router.query.name && (
                  <h3 className="mt-1 mb-3 text-xl text-gray-500">
                    Search results for `
                    {/* {router.query.name.substring(1)}` */}
                    {(router.query.name as string).trim()}
                    {/* {(router.query.name as string).replace(/[^\w\s]/gi, "")}` */}
                  </h3>
                )}
                <div className=" mb-7">
                  {hasMounted && <MenuFilter handleFilter={handleFilter} />}
                </div>

                <div>
                  {isEmpty(products) ? (
                    <div className="flex justify-center items-center min-h-[500px]">
                      <Spin size="large" />
                    </div>
                  ) : (
                    <>
                      {products.products.length > 0 && (
                        <div className="pb-5 text-right">
                          <Pagination
                            current={products.currentPage}
                            total={products.totalProduct}
                            showTotal={(total) =>
                              `Total ${total} product${total > 1 ? "s" : ""}`
                            }
                            size="small"
                            pageSize={products.productPerPage}
                            onChange={(pageProduct, pageSize) => {
                              handleFilter("page", pageProduct);
                            }}
                            // onChange={handlePaginateProduct}
                            showQuickJumper
                            showSizeChanger={false}
                          />
                        </div>
                      )}
                      <Row gutter={[10, 10]}>
                        {products.products.map((product: any) => {
                          return (
                            <Col span={6} className=" px-2" key={product._id}>
                              <ProductCompare product={product} />
                            </Col>
                          );
                        })}
                      </Row>
                    </>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Compare />
    </div>
  );
};

export default SearchPage;
