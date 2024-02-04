import { HeartFilled } from "@ant-design/icons";
import { Breadcrumb, Button, Col, Row, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import UserSideBar from "@/components/SideBar/UserSideBar";
import WishList from "@/components/WishList/WishList";
import { useWishList } from "@/src/react-query/hooks/user/useWishList";
import { renderOnlyOnClient } from "@/utils/renderOnlyOnClient";

const WishLishPage = () => {
  const router = useRouter();
  const { data: wishList, isLoading }: any = useWishList();

  return (
    <div>
      <div className="min-h-[calc(100vh-70px)] bg-[#f0f2f5]">
        <div className="pt-5 ml-4 bg-[#f0f2f5]">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link href="/">Home page</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>Wishlish</Breadcrumb.Item>
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
                  <h3 className="text-base text-gray-700">{wishList?.name}</h3>
                </Col>
              </Row>
              <div className="mt-3">
                <UserSideBar />
              </div>
            </Col>
            {isLoading ? (
              <Col flex="1 1 0%">
                <h3 className=" px-4 mb-7 text-2xl text-center">
                  Favorites List {`(${wishList?.products?.length || 0})`}
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
                  Favorites List {`(${wishList?.products?.length})`}
                </h3>
                <div className="px-10">
                  {wishList?.products.length === 0 ? (
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
                        <h3 className="text-base text-gray-400">
                          Please <HeartFilled style={{ color: "red" }} /> your
                          favorite products when shopping for the most
                          convenient evaluation
                        </h3>
                        <Button type="primary" onClick={() => router.push("/")}>
                          Continue shopping{" "}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <WishList products={wishList?.products} />
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

export default renderOnlyOnClient(WishLishPage);

// export default dynamic(() => Promise.resolve(WishLishPage), { ssr: false });
