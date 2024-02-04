import { Breadcrumb, Col, Row } from "antd";
import Image from "next/image";
import Link from "next/link";

import Address from "@/components/Address/Address";
import UserSideBar from "@/components/SideBar/UserSideBar";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { renderOnlyOnClient } from "@/utils/renderOnlyOnClient";

const AddressPage = () => {
  const { data: user } = useUserData();

  return (
    <div>
      <div className="min-h-[calc(100vh-70px)] bg-[#f0f2f5]">
        <div className="pt-5 ml-4 bg-[#f0f2f5]">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link href="/">Home page</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>Account information</Breadcrumb.Item>
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
                  <h3 className="text-base text-gray-700">{user?.name}</h3>
                </Col>
              </Row>
              <div className="mt-3">
                <UserSideBar />
              </div>
            </Col>
            <Col flex="1 1 0%">
              <h3 className=" px-4 mb-7 text-2xl text-center">Address</h3>
              <Address />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

// export default AddressPage;
// export default dynamic(() => Promise.resolve(AddressPage), { ssr: false });
export default renderOnlyOnClient(AddressPage);
