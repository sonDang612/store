/* eslint-disable complexity */
/* eslint-disable @next/next/no-img-element */
import {
  LeftOutlined,
  PlusCircleTwoTone,
  RightOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Carousel,
  CarouselProps,
  Col,
  Divider,
  Pagination,
  Row,
  Spin,
} from "antd";
import mongoose from "mongoose";
import { GetStaticPaths, GetStaticProps } from "next";
import NextImage from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import slugify from "slugify";

import Description from "@/components/Admin/Description";
import InforProduct from "@/components/Product/InforProduct";
import MyImage from "@/components/Product/MyImage";
import Product from "@/components/ProductCard/Product";
import Comment from "@/components/Review/Comment";
import ReviewStatistic from "@/components/Review/ReviewStatistic";
import { useNextQueryParams } from "@/hook/useNextQueryParams";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product";
import ProductSpecification from "@/src/components/Admin/ProductSpecification";
import Compare from "@/src/components/Compare";
import { useListSuggestProduct } from "@/src/react-query/hooks/product/useListSuggestProduct";
// import { useProductDetails } from "@/src/react-query/hooks/product/useProductDetails";
import { useProductReview } from "@/src/react-query/hooks/product/useProductReview";
import { useProductStatisticReview } from "@/src/react-query/hooks/product/useProductStatisticReview";
import { CompareProductType } from "@/src/redux/reducers/compareProductReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";

import isEmpty from "../../utils/is-empty";

// import { useProductDetails } from "../react-query/hooks/product/useProductDetails";
// import isEmpty from "@/utils/is-empty";
// import notEmpty from "@/utils/not-empty";
// import { useUserLikeProduct } from "../react-query/hooks/user/useUserLikeProduct";

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
      style={{
        display: currentSlide === slideCount - 6 ? "none" : "block",
        marginRight: 10,
      }}
    />
  );
};
const settings: CarouselProps = {
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

const ProductPage = (props: any) => {
  const product = props?.product || {};
  const actions = useActions();
  const compareProductList = useSelector<RootState, CompareProductType["list"]>(
    (state) => state.compareProduct.list,
  );
  const router = useNextQueryParams();

  const [star, setStar] = useState(7);

  const [page, setPage] = useState(1);

  const {
    data: suggestProduct,
    isLoading: isLoadingSuggestProduct,
    isSuccess: isSuccessSuggestProduct,
  } = useListSuggestProduct(
    (product ? product?.id : null) as string,
    product?.active !== false,
  );

  const { data: statisticReview, isLoading: isLoadingProductStatisticReview } =
    useProductStatisticReview(
      product ? product?.id : null,
      product?.active !== false,
    );

  const { data: reviews, isLoading: isLoadingProductReview } = useProductReview(
    (product ? product?.id : null) as string,
    page,
    process.env.NEXT_PUBLIC_PAGE_SIZE_REVIEW || 1,
    star - 7 === 0 ? undefined : star,
    product?.active !== false,
  );
  const reviewRef = useRef(null);

  const handlePaginateReview = (pageReview: any, pageSize: any) => {
    setPage(pageReview);
  };

  if (router.isFallback) {
    return (
      <div className=" flex justify-center items-center min-h-[calc(100vh-75px)]">
        <Spin size="large" />
      </div>
    );
  }
  // if (isEmpty(product)) {
  //   return (
  //     <div className=" flex justify-center items-center min-h-[calc(100vh-75px)]">
  //       <Result
  //         status="404"
  //         title="404"
  //         subTitle="Sorry, the page you visited does not exist."
  //         extra={
  //           <Button
  //             type="primary"
  //             onClick={() => {
  //               router.push("/");
  //             }}
  //           >
  //             Back Home
  //           </Button>
  //         }
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="bg-[#f0f2f5]">
      <div className="py-5 bg-[#f0f2f5]">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link href="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link
              href={`/products/search/?category=${product?.category
                .toLowerCase()
                .replace(/ /g, "-")}`}
            >
              {product?.category}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {slugify(product?.name)}{" "}
            <span
              className="inline-block ml-2 cursor-pointer"
              onClick={() => {
                actions.addCompareProduct(product);
              }}
            >
              <PlusCircleTwoTone />
              <span className="inline-block pb-3 ml-1 text-xs text-[#1890ff]">
                {compareProductList.some(
                  (p) => p._id.toString() === (router.query.id as string),
                )
                  ? "Compare has been added"
                  : "Compare"}
              </span>
            </span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className=" overflow-hidden w-full bg-white rounded-sm">
        <Row>
          <Col flex="0 0 450px" className=" ">
            {product && <MyImage product={product} />}
          </Col>
          <Col flex="0 0 1px" className=" mx-3 bg-[#f2f2f2]" />
          <Col flex="1 1 0" className=" py-5">
            {product && (
              <InforProduct reviewRef={reviewRef} product={product} />
            )}
          </Col>
        </Row>
      </div>
      <div className="overflow-hidden mt-10 bg-white rounded-sm">
        <h3 className=" py-6 ml-5 text-2xl font-medium">
          {/* Related products  */}
          Products you may like
        </h3>
        <div>
          {!isLoadingSuggestProduct && isSuccessSuggestProduct && (
            <Carousel
              {...settings}
              accessibility
              arrows
              prevArrow={<SlickArrowLeft />}
              nextArrow={<SlickArrowRight />}
            >
              {suggestProduct?.filter(Boolean).map((product: any) => {
                return <Product product={product || {}} key={product?.id} />;
              })}
            </Carousel>
          )}

          {/* <Row>
            {suggestProduct?.map((product: any) => {
              return (
                <Col key={product.id} span={4}>
                  <Product product={product} />
                </Col>
              );
            })}
          </Row> */}
        </div>
      </div>
      <ProductSpecification tableInformation={product?.tableInformation} />
      <Description description={product?.description} />
      <Spin
        tip="Loading..."
        spinning={isLoadingProductReview || isLoadingProductStatisticReview}
      >
        <div
          className="overflow-hidden p-3 mt-10 bg-white rounded-sm"
          ref={reviewRef}
          style={{
            minHeight:
              reviews?.reviews?.length === 0 && star === 7 ? undefined : 480,
          }}
        >
          <h3 className="mt-3 mb-4 ml-9 text-2xl font-medium">
            Reviews From Customers
          </h3>
          <div>
            <div>
              <div
                style={{
                  minHeight:
                    reviews?.reviews?.length === 0 && star === 7
                      ? undefined
                      : 180,
                }}
              >
                {(reviews?.reviews?.length > 0 || star !== 7) && (
                  <ReviewStatistic
                    product={product}
                    reviews={reviews}
                    statisticReview={statisticReview}
                    star={star}
                    setStar={setStar}
                  />
                )}{" "}
              </div>
              {reviews?.reviews?.map((review: any) => {
                return (
                  <div key={review._id}>
                    {/* {i !== 0 && <Divider />}  */}
                    <Divider />
                    <Comment
                      review={review}
                      page={page}
                      limit={process.env.NEXT_PUBLIC_PAGE_SIZE_REVIEW || 1}
                      rating={star - 7 === 0 ? undefined : star}
                      productId={product?.id}
                    />
                  </div>
                );
              })}
            </div>
            <div>
              {reviews?.reviews?.length === 0 && (
                <div className="flex flex-col justify-center items-center mt-16">
                  <NextImage
                    src="/images/empty-review.svg"
                    alt="/images/empty-review.svg"
                    height={90}
                    width={90}
                  />
                  <h3 className="mt-1 text-sm text-gray-500">
                    {page === 1 && star === 7
                      ? "There are no reviews for this product yet"
                      : " No matching comments found."}
                  </h3>
                </div>
              )}{" "}
              {reviews?.reviews?.length > 0 && (
                <div className="mt-4 text-right">
                  <Pagination
                    size="small"
                    current={reviews.currentPage}
                    total={reviews.totalReview}
                    pageSize={reviews.reviewPerPage}
                    onChange={handlePaginateReview}
                  />
                </div>
              )}
            </div>
          </div>
        </div>{" "}
      </Spin>
      <Compare />
    </div>
  );
};
export const getStaticPaths: GetStaticPaths = async () => {
  await dbConnect();
  const products = await ProductModel.find({ active: { $ne: false } });
  const paths = products.map((p) => ({
    params: { id: p.id as string },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  if (!mongoose.isValidObjectId(id)) {
    return {
      notFound: true,
    };
  }
  await dbConnect();

  const product = await ProductModel.findOne({
    _id: id,
    active: { $ne: false },
  });

  if (isEmpty(product)) {
    return {
      notFound: true,
      // props: { product: {} },
      revalidate: +process.env.NEXT_PUBLIC_REVALIDATE || 20,
    };
  }
  return {
    props: { product: JSON.parse(JSON.stringify(product)) },
    revalidate: +process.env.NEXT_PUBLIC_REVALIDATE || 20,
  };
};
export default ProductPage;
