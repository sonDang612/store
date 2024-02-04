import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Spin } from "antd";
import { useRouter } from "next/router";
import React from "react";

import { useListProductsDiscount } from "@/src/react-query/hooks/product/useListProductsDiscount";

import SingleProductDiscount from "./SingleProductDiscount";

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
  // tru 6 vi de hien thi 6 cai
  return (
    <RightOutlined
      {...props}
      style={{ display: currentSlide === slideCount - 6 ? "none" : "block" }}
    />
  );
};
const ProductsDiscount = () => {
  const router = useRouter();
  const { data: productDiscount, isLoading: isLoadingProductDiscount } =
    useListProductsDiscount();

  const onClickHandler = (product: any) => {
    router.push(`/product/${product.id}?slug=${product.slug}`);
  };
  const settings = {
    arrows: true,
    infinite: false,
    className: "cursor-pointer hoverArrow",
    dots: false,
    slidesToShow: 6,
    swipeToSlide: true,
    draggable: true,
    pauseOnHover: false,
    // centerMode: true,
    // centerPadding: "0px",
    // className: "center",
  };
  return (
    <div className=" min-h-[300px] bg-white styleCarousel">
      <div className="flex justify-between items-center py-3 px-5 mt-1 border-0 border-b-[1px] border-gray-100 border-solid">
        <h2 className=" flex justify-between items-center w-[235px] text-2xl font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-yellow-500">
          Discount{" "}
          <img
            src="./images/dealFlashIcon.svg"
            alt="flash deal"
            className=" w-5 AnimateFlash"
          />
          product
        </h2>
      </div>
      <Spin spinning={isLoadingProductDiscount}>
        <div className="min-h-[200px]">
          <Carousel
            // autoplay
            // autoplaySpeed={2000}
            // pauseOnHover={false}
            {...settings}
            arrows
            prevArrow={<SlickArrowLeft />}
            nextArrow={<SlickArrowRight />}
          >
            {productDiscount?.map((discountProduct: any) => {
              return (
                <div
                  key={discountProduct._id}
                  // flex={1}
                  className=" p-2 mx-auto max-w-[207px] cursor-pointer discountProductHover"
                  onClick={() => onClickHandler(discountProduct)}
                >
                  <SingleProductDiscount
                    image={discountProduct.image[0]}
                    price={discountProduct.currentPrice}
                    discount={discountProduct.discount}
                    soldDiscount={discountProduct.soldDiscount}
                    quantityDiscount={discountProduct.quantityDiscount}
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      </Spin>
    </div>
  );
};

export default ProductsDiscount;
