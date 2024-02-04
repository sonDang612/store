import { Breadcrumb, Button, Col, Divider, Row, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import ReviewProduct from "@/components/Review/ReviewProduct";
import UserSideBar from "@/components/SideBar/UserSideBar";
import { useProductsToReview } from "@/src/react-query/hooks/review/useProductsToReview";
import { renderOnlyOnClient } from "@/utils/renderOnlyOnClient";

const ReviewProductPage = () => {
  const router = useRouter();
  const { data: productToReview, isLoading } = useProductsToReview();

  return (
    <div>
      <div className=" min-h-[calc(100vh-70px)] bg-[#f0f2f5]">
        <div className="pt-5 ml-4 bg-[#f0f2f5]">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link href="/">Home page</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>Review product</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="mt-3 bg-[#f0f2f5]">
          <Row gutter={[15, 0]}>
            <Col flex="270px">
              <Row gutter={[10, 0]} className="px-4">
                <Col flex="55px">
                  <Image
                    src="/images/blank-avatar.png"
                    alt="blank-avatar.png"
                    width={45}
                    height={45}
                    className=" rounded-[50%]"
                  />
                </Col>
                <Col flex="1 1 0%">
                  <h4 className="text-sm text-gray-500"> Account </h4>
                  <h3 className="text-base text-gray-700">
                    {productToReview?.name}
                  </h3>
                </Col>
              </Row>
              <div className="mt-3">
                <UserSideBar />
              </div>
            </Col>
            {isLoading ? (
              <Col flex="1 1 0%">
                <h3 className=" px-4 mb-7 text-2xl text-center">
                  Review product that you bought
                </h3>
                <div className="px-10">
                  <div className=" flex justify-center items-center min-h-[400px]">
                    <Spin size="large" />
                  </div>
                </div>
              </Col>
            ) : (
              <Col flex="1 1 0%">
                <h3 className=" px-4 mb-7 text-2xl text-center">
                  Review products that you bought
                </h3>
                <div className="px-10">
                  {productToReview?.products?.length === 0 ? (
                    <div className="min-h-[100vh] bg-[#f0f2f5]">
                      <div className="flex flex-col justify-center items-center space-y-5 h-[340px] bg-white rounded-sm">
                        <div>
                          <Image
                            src="/images/empty-favorite.svg"
                            alt="/images/empty-favorite.svg"
                            width={190}
                            height={160}
                          />
                        </div>

                        <Button type="primary" onClick={() => router.push("/")}>
                          Continue shopping{" "}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="">
                      <div className="bg-white">
                        <Row className=" py-5 px-4">
                          <Col flex="0 0 400px">
                            <h2 className="pl-5 text-[17px] text-gray-500">
                              Product
                            </h2>
                          </Col>
                          <Col flex="0 0 170px">
                            <h2 className="text-[17px] text-gray-500">
                              Total Price
                            </h2>
                          </Col>
                          <Col flex="0 0 170px">
                            <h2
                              className="pl-6 text-[17px] text-gray-500"
                              style={{ fontSize: 17 }}
                            >
                              Status
                            </h2>
                          </Col>

                          <Col flex="0 0 100px">
                            <h2
                              className="pr-3 text-right text-gray-500"
                              style={{ fontSize: 17 }}
                            >
                              Detail
                            </h2>
                          </Col>
                        </Row>
                        <Divider className="m-0" />
                        {productToReview.products.map(
                          (product: any, i: any) => {
                            return (
                              <div
                                key={`${product.productId}${product.orderId}`}
                              >
                                {i !== 0 && <Divider className="!m-0" />}
                                <ReviewProduct product={product} />
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};

// export default AccountPage;
export default renderOnlyOnClient(ReviewProductPage);
// export default dynamic(() => Promise.resolve(ReviewProductPage), {
//    ssr: false,
// });
