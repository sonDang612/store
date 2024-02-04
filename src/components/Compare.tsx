/* eslint-disable @next/next/no-img-element */
import { DownOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { MAP_CATEGORY } from "../constant";
import { CompareProductType } from "../redux/reducers/compareProductReducer";
import { RootState } from "../redux/store";
import { useActions } from "../redux/useActions";
import { convertCategory } from "../utils/convertCategory";

const Compare = () => {
  const actions = useActions();
  const router = useRouter();
  const compareProductList = useSelector<RootState, CompareProductType["list"]>(
    (state) => state.compareProduct.list,
  );
  const showCompareMini = useSelector<
    RootState,
    CompareProductType["showCompareMini"]
  >((state) => state.compareProduct.showCompareMini);
  useEffect(() => {
    actions.setMiniCompareProduct(true);
    actions.setHasHeader(0);
  }, [actions]);

  return (
    <div>
      {" "}
      {showCompareMini && compareProductList.length && (
        <div
          className="flex fixed bottom-4 left-12 justify-center items-center space-x-2 bg-white rounded-md cursor-pointer compareProduct"
          onClick={() => actions.toggleMiniCompareProduct()}
        >
          <img src="/images/compare.png" alt="compare.png" />
          <span className="text-xs ">
            Compare ({compareProductList.length})
          </span>
        </div>
      )}
      {!showCompareMini && (
        <div className="fixed bottom-0 left-0 w-screen h-[107px] ">
          <div className="mx-auto w-[60vw] h-full ">
            <Row
              className="h-full bg-white border-[1px] border-gray-300"
              style={{ boxShadow: "0 -2px 10px rgb(0 0 0 / 12%)" }}
            >
              {compareProductList.map((p) => {
                return (
                  <Col
                    key={p._id}
                    span={6}
                    className="flex relative flex-col justify-center items-center space-y-2 text-gray-300 border-r-[1px] border-gray-300 cursor-pointer"
                  >
                    <img
                      src={p.image[0]}
                      alt={p.image[0]}
                      width={60}
                      height={37}
                    />
                    <span className="text-xs text-center text-gray-700">
                      {p.name}
                    </span>
                    <div
                      className="absolute -top-2 right-0 w-5 text-center"
                      onClick={() => actions.removeCompareProduct(p)}
                    >
                      X
                    </div>
                  </Col>
                );
              })}
              {Array(3 - compareProductList.length)
                .fill(0)
                .map((p, i) => {
                  return (
                    <Col
                      key={i}
                      span={6}
                      className="flex flex-col justify-center items-center space-y-2 text-gray-300 border-r-[1px] border-gray-300"
                    >
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => {
                          router.push({
                            pathname: "/products/search",
                            query: {
                              category: compareProductList.length
                                ? MAP_CATEGORY[compareProductList[0].category]
                                : undefined,
                            },
                          });
                        }}
                      >
                        +
                      </Button>
                      <span className="text-gray-700">Add Product</span>
                    </Col>
                  );
                })}

              <Col span={6} className="relative">
                <div className="flex flex-col justify-evenly items-center h-full">
                  <Button
                    type="primary"
                    className="rounded-sm"
                    onClick={() => {
                      router.push(
                        `/compare/${
                          MAP_CATEGORY[compareProductList[0].category]
                        }`,
                      );
                    }}
                  >
                    Compare Product
                  </Button>
                  <span
                    className="inline-block text-[#1a94ff] cursor-pointer"
                    onClick={() => actions.clearCompareProduct()}
                  >
                    Delete all product
                  </span>
                </div>
                <div
                  className="cursor-pointer CollapseCompareProduct"
                  onClick={() => actions.toggleMiniCompareProduct()}
                >
                  <span className="inline-block -mr-5">
                    {" "}
                    Collapse <DownOutlined />
                  </span>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
