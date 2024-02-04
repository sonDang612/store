/* eslint-disable no-nested-ternary */
import { Col, Divider, Rate, Row } from "antd";
import Link from "next/link";
import React from "react";

import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import isEmpty from "@/utils/is-empty";

import QuantityProduct from "./QuantityProduct";

const InforProduct: React.FC<any> = ({ reviewRef, product }) => {
  const { data: user } = useUserData(false, false);

  return (
    <div className="space-y-6">
      <h3 className=" text-3xl font-medium text-gray-600">{product.name}</h3>
      <div className=" flex items-center space-x-2">
        <div className="-mt-1">
          <Rate
            allowHalf
            value={product.averageRating}
            disabled
            style={{ fontSize: 16 }}
            //  style={{ fontSize: 14, color: "red" }}
          />
        </div>
        <h3
          className="!ml-9 text-sm text-gray-500 hover:text-[#1a94ff] transition-all duration-150 cursor-pointer"
          onClick={() =>
            reviewRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        >
          {product.numReviews} Customer Reviews
        </h3>
        <div>
          <Divider type="vertical" />
        </div>
        <h3 className="text-sm text-gray-500">Sold {product.sold}</h3>
      </div>
      <Row>
        <Col flex="150px" className="font-semibold">
          Brand
        </Col>
        <Col flex="1" className="cursor-pointer">
          {product.brand}
        </Col>
      </Row>
      <Row>
        <Col flex="150px" className="font-semibold">
          Availability
        </Col>
        <Col flex="1">
          <span
            className={
              product.countInStock > 0 ? "text-[#1a94ff]" : "text-red-500"
            }
          >
            {product.countInStock > 0
              ? product.active && "In Stock"
              : "Out of stock"}
          </span>
        </Col>
      </Row>
      <div className=" py-3 mr-5 max-w-[500px] text-white bg-gray-50">
        {product.active ? (
          product.discount === 0 ? (
            <h2 className=" text-4xl font-semibold text-gray-700">
              $ {product.price}
            </h2>
          ) : (
            <div
              className="flex justify-between p-4 rounded-md"
              style={{
                background:
                  "linear-gradient(100deg, rgb(255, 66, 78), rgb(253, 130, 10))",
              }}
            >
              <div>
                <h2 className="text-4xl font-semibold text-white">
                  $ {product.currentPrice}{" "}
                </h2>
                <div className="flex ml-1 space-x-2">
                  <span className="text-white/50 line-through">
                    $ {product.price.toFixed(2)}
                  </span>{" "}
                  <span className="text-gray-100">-{product.discount}%</span>{" "}
                </div>
              </div>
            </div>
          )
        ) : (
          <h2 className=" text-4xl font-semibold text-gray-700">
            $ {product.price}
          </h2>
        )}
      </div>
      {product.active ? (
        <>
          <Divider
            style={{
              margin: isEmpty(product.discount) ? undefined : 0,
            }}
          />
          <div className=" pr-3 max-w-[750px] text-base text-gray-600">
            {/* <div
              className="overflow-hidden smallDescription"
              dangerouslySetInnerHTML={{
                __html: product.description.replace(/<img[^>]*>/g, ""),
              }}
            ></div> */}
          </div>
          {user?.cart?.some(
            (pd: any) =>
              pd.product === product.id || pd.product._id === product.id,
          ) && user?.addressList?.length > 0 ? (
            <div>
              Delivered to{" "}
              <span className="mr-3 font-medium text-black underline">
                {" "}
                {`${user.addressList[0].ward} , ${user.addressList[0].district} , ${user.addressList[0].city}`}
              </span>
              <Link href="/customer/address" passHref>
                <span className="font-medium text-[#0b74e5] cursor-pointer">
                  Change address
                </span>
              </Link>
            </div>
          ) : (
            <h3 className=" text-sm text-gray-600">
              You can{" "}
              <Link href="/customer/address" passHref>
                <span className="font-medium text-[#0b74e5] cursor-pointer">
                  change delivery address
                </span>
              </Link>{" "}
              when placing an order.
            </h3>
          )}
          <Divider />
          <QuantityProduct product={product} />
        </>
      ) : (
        <h2 className="py-14 text-5xl font-medium text-red-500">
          We no longer sell this product
        </h2>
      )}
    </div>
  );
};

export default InforProduct;
