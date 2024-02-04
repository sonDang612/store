/* eslint-disable @next/next/no-img-element */
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import { useRouter } from "next/router";
import React from "react";

import { MENU_PRODUCT_CATEGORY } from "@/src/constant";
import { useNumProductEachCategory } from "@/src/react-query/hooks/product/useNumProductEachCategory";
import { convertCategory } from "@/utils/convertCategory";

import SingleCategory from "./SingleCategory";

const SlickArrowLeft: React.FC<any> = ({
  currentSlide,
  slideCount,
  ...props
}) => {
  return (
    <LeftOutlined
      {...props}
      style={{ display: currentSlide === 0 ? "none" : "block" }}
    />
  );
};

const SlickArrowRight: React.FC<any> = ({
  currentSlide,
  slideCount,
  ...props
}) => {
  return (
    <RightOutlined
      {...props}
      style={{ display: currentSlide === slideCount - 1 ? "none" : "block" }}
    />
  );
};
const Category = () => {
  const router = useRouter();
  const { data: numProductCategory } = useNumProductEachCategory();

  const numCarousel =
    MENU_PRODUCT_CATEGORY.length % 6 === 0
      ? parseInt((MENU_PRODUCT_CATEGORY.length / 6).toString(), 10)
      : parseInt((MENU_PRODUCT_CATEGORY.length / 6).toString(), 10) + 1;
  return (
    <div className="styleCarousel">
      <Carousel
        arrows
        prevArrow={<SlickArrowLeft />}
        nextArrow={<SlickArrowRight />}
        infinite={false}
        className="cursor-pointer hoverArrow"
        dots={false}
      >
        {Array(numCarousel)
          .fill(1)
          .map((_, i) => {
            const array = MENU_PRODUCT_CATEGORY.slice(
              6 * i,
              MENU_PRODUCT_CATEGORY.length - 6 * i >= 6
                ? 6 * i + 6
                : MENU_PRODUCT_CATEGORY.length,
            );
            return (
              <div key={i}>
                <div className="grid grid-cols-4 grid-rows-2 grid-flow-col gap-x-3 gap-y-2 p-2 pt-6">
                  {array.map((category, i) => {
                    const big = () => {
                      if (i === 0 || i === 3) return true;
                      return false;
                    };
                    return (
                      <div
                        key={i}
                        className={big() ? "row-span-2" : "row-span-1"}
                        onClick={() =>
                          // router.push(`category/${category.name}`)
                          router.push(
                            `/products/search?category=${category.name}`,
                          )
                        }
                      >
                        <SingleCategory
                          bg={category.bg}
                          h={big() ? 310 : 150}
                          img={category.img}
                          name={category.name}
                          numProduct={
                            numProductCategory?.find(
                              (cate: any) =>
                                cate._id === convertCategory(category.name),
                            )?.total || 0
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </Carousel>
    </div>
  );
};

export default Category;
