/* eslint-disable @next/next/no-img-element */

import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Col, message, Row } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

import CompareCard from "@/src/components/CompareCard";
import { useMutationAddProductToCart } from "@/src/react-query/hooks/user/useMutationAddProductToCart";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { CompareProductType } from "@/src/redux/reducers/compareProductReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import isEmpty from "@/src/utils/is-empty";

const ComparePage = () => {
  const actions = useActions();
  const router = useRouter();
  const { data: user } = useUserData(false, false);
  const compareProductList = useSelector<RootState, CompareProductType["list"]>(
    (state) => state.compareProduct.list,
  );
  const hasHeader = useSelector<RootState, CompareProductType["hasHeader"]>(
    (state) => state.compareProduct.hasHeader,
  );
  const { mutate: addProductToCart, isLoading: isLoadingAddProductToCart } =
    useMutationAddProductToCart();
  const handleAddToCart = (product: any) => {
    if (isEmpty(user)) {
      actions.showModalLogin();
      return;
    }

    if (product.countInStock < 1) {
      message.info(
        `${product.name} only have ${product.countInStock} products left `,
      );
      return;
    }
    const productAdd = {
      product: product._id,
      errorMessage: `${product.name} only have ${product.countInStock} products left `,
      countInStock: product.countInStock,
      quantity: 1,
    };

    addProductToCart({
      product: productAdd,
    });
  };

  return (
    <div className="min-h-[100vh]">
      <div className="pt-20 ">
        <Row className=" border-[1px] border-[#e6e6e6]">
          {compareProductList.map((product: any, i: number) => {
            return (
              <Col
                span={8}
                className={
                  i === 2
                    ? "relative"
                    : " border-r-[1px] border-[#e6e6e6] relative"
                }
                key={product._id}
              >
                <CompareCard product={product} />
                {compareProductList.length > 1 && (
                  <div
                    className="absolute top-0 right-0 w-6 text-center cursor-pointer"
                    onClick={() => actions.removeCompareProduct(product)}
                  >
                    X
                  </div>
                )}
              </Col>
            );
          })}
          {Array(3 - compareProductList.length)
            .fill(0)
            .map((_, i) => {
              return (
                <Col
                  span={8}
                  className={
                    i === 2
                      ? "flex justify-center items-center"
                      : " border-r-[1px] border-[#e6e6e6] flex justify-center items-center"
                  }
                  key={i}
                >
                  <div className="flex flex-col justify-center items-center space-y-3">
                    <Button
                      type="dashed"
                      size="large"
                      onClick={() =>
                        router.push({
                          pathname: "/products/search",
                          query: {
                            category: router.query?.category,
                          },
                        })
                      }
                    >
                      +
                    </Button>
                    <span className="text-gray-700">Add Product</span>
                  </div>
                </Col>
              );
            })}
        </Row>
        <div className="py-4 px-2 text-base font-bold bg-gray-100">
          Product Specifications
        </div>

        {Object.entries(compareProductList[hasHeader].tableData).map(
          ([header, content]) => {
            return (
              <Row
                className=" border-r-[1px] border-l-[1px] border-[#e6e6e6]"
                key={header}
              >
                {compareProductList.length > 0 && (
                  <Col
                    span={8}
                    className="border-r-[1px] border-b-[1px] border-[#e6e6e6]"
                  >
                    <div className="p-2 ">
                      <div className="pb-2 text-sm font-bold">
                        <div dangerouslySetInnerHTML={{ __html: header }}></div>
                      </div>
                      <div>
                        <div
                          style={{ wordBreak: "break-word" }}
                          dangerouslySetInnerHTML={{
                            __html: compareProductList[0].tableData[header],
                          }}
                        ></div>
                      </div>
                    </div>
                  </Col>
                )}
                {compareProductList.length > 1 && (
                  <Col
                    span={8}
                    className="border-r-[1px] border-b-[1px] border-[#e6e6e6]"
                  >
                    <div className="p-2 ">
                      <div className="pb-2 text-sm font-bold">
                        <div dangerouslySetInnerHTML={{ __html: header }}></div>
                      </div>
                      <div>
                        <div
                          style={{ wordBreak: "break-word" }}
                          dangerouslySetInnerHTML={{
                            __html: compareProductList[1].tableData[header],
                          }}
                        ></div>
                      </div>
                    </div>
                  </Col>
                )}
                {compareProductList.length > 2 && (
                  <Col span={8} className=" border-b-[1px] border-[#e6e6e6]">
                    <div className="p-2 ">
                      <div className="pb-2 text-sm font-bold">
                        <div dangerouslySetInnerHTML={{ __html: header }}></div>
                      </div>
                      <div>
                        <div
                          style={{ wordBreak: "break-word" }}
                          dangerouslySetInnerHTML={{
                            __html: compareProductList[2].tableData[header],
                          }}
                        ></div>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            );
          },
        )}
        <Row className=" border-r-[1px] border-l-[1px] border-[#e6e6e6]">
          {compareProductList.map((product, i) => {
            return (
              <Col
                span={8}
                className={
                  i === 2
                    ? "border-b-[1px] border-[#e6e6e6]"
                    : "border-r-[1px] border-b-[1px] border-[#e6e6e6]"
                }
                key={product._id}
              >
                <div className="flex justify-center pb-2 mt-2">
                  <Button
                    type="primary"
                    className="flex items-center text-center rounded-sm"
                    size="large"
                    onClick={() => handleAddToCart(product)}
                    disabled={isLoadingAddProductToCart}
                    icon={<ShoppingCartOutlined style={{ fontSize: 21 }} />}
                  >
                    Add to card
                  </Button>
                </div>
              </Col>
            );
          })}
        </Row>
        {/* <Row className="  border-[1px] border-[#e6e6e6]">
          {compareProductList.map((product, i) => {
            return (
              <Col
                span={8}
                className={i === 2 ? "" : " border-r-[1px] border-[#e6e6e6]"}
                key={product._id}
              >
                {Object.entries(product.tableData).map(
                  ([header, content], j) => {
                    return (
                      <div
                        key={j}
                        className="p-2 border-b-[1px] border-[#e6e6e6]"
                      >
                        <div className="pb-2 text-sm font-bold">
                          <span
                            dangerouslySetInnerHTML={{ __html: header }}
                          ></span>
                        </div>
                        <div>
                          <span
                            dangerouslySetInnerHTML={{ __html: content }}
                          ></span>
                        </div>
                      </div>
                    );
                  },
                )}

                <div className="flex justify-center mt-2">
                  <Button
                    type="primary"
                    className="flex items-center text-center rounded-sm"
                    size="large"
                    onClick={() => handleAddToCart(product)}
                    disabled={isLoadingAddProductToCart}
                    icon={<ShoppingCartOutlined style={{ fontSize: 21 }} />}
                  >
                    Add to card
                  </Button>
                </div>
              </Col>
            );
          })}
        </Row> */}
      </div>
    </div>
  );
};

export default ComparePage;
/* <Row className="  border-[1px] border-[#e6e6e6]">
{compareProductList.map((product, i) => {
  return (
    <Col
      span={8}
      className={i === 2 ? "" : " border-r-[1px] border-[#e6e6e6]"}
      key={product._id}
    >
      {Object.entries(product.tableData).map(
        ([header, content], j) => {
          return (
            <div
              key={j}
              className="p-2 border-b-[1px] border-[#e6e6e6]"
            >
              <div className="pb-2 text-sm font-bold">
                <span
                  dangerouslySetInnerHTML={{ __html: header }}
                ></span>
              </div>
              <div>
                <span
                  dangerouslySetInnerHTML={{ __html: content }}
                ></span>
              </div>
            </div>
          );
        },
      )}

      <div className="flex justify-center mt-2">
        <Button
          type="primary"
          className="flex items-center text-center rounded-sm"
          size="large"
          onClick={() => handleAddToCart(product)}
          disabled={isLoadingAddProductToCart}
          icon={<ShoppingCartOutlined style={{ fontSize: 21 }} />}
        >
          Add to card
        </Button>
      </div>
    </Col>
  );
})}
</Row> */

//----
// {compareProductList.map((product, i) => {
//   return (
//     <Col
//       span={8}
//       className={i === 2 ? "" : " border-r-[1px] border-[#e6e6e6]"}
//       key={product._id}
//     >
//       {Object.entries(product.tableData).map(
//         ([header, content], j) => {
//           return (
//             <div
//               key={j}
//               className="p-2 border-b-[1px] border-[#e6e6e6]"
//             >
//               {/* {i === hasHeader ? (
//                 <p className="pb-2 text-sm font-bold">{header}</p>
//               ) : (
//                 <p className="pb-2 text-sm font-bold">&nbsp;</p>
//               )} */}
//               <div className="pb-2 text-sm font-bold">
//                 <span
//                   dangerouslySetInnerHTML={{ __html: header }}
//                 ></span>
//               </div>
//               <div>
//                 <span
//                   dangerouslySetInnerHTML={{ __html: content }}
//                 ></span>
//               </div>
//             </div>
//           );
//         },
//       )}
//       <div className="flex justify-center mt-2">
//         <Button
//           type="primary"
//           className="flex items-center text-center rounded-sm"
//           size="large"
//           onClick={() => handleAddToCart(product)}
//           disabled={isLoadingAddProductToCart}
//           icon={<ShoppingCartOutlined style={{ fontSize: 21 }} />}
//         >
//           Add to card
//         </Button>
//       </div>
//     </Col>
//   );
// })}
