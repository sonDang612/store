import { Result, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { useMutationCreateOrder } from "@/src/react-query/hooks/order/useMutationCreateOrder";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import notEmpty from "@/utils/not-empty";
import { renderOnlyOnClient } from "@/utils/renderOnlyOnClient";

let pay = false;
const SuccessfulOrder = () => {
  const router = useRouter();
  const { data: user } = useUserData(!router.query.id, !router.query.id);
  const { mutate: createOrder } = useMutationCreateOrder();
  useEffect(() => {
    if (!pay && !router.query.id && notEmpty(user.cart.at(0)?.product?.image)) {
      const orderPayload = JSON.parse(router.query.payload as string);
      createOrder(orderPayload);
      pay = true;
    }
  }, [user, router, createOrder]);
  return (
    <div>
      <Spin tip="Loading..." spinning={!router.query.id}>
        <div className="flex justify-center items-center h-[calc(100vh-70px)]">
          {router.query.id && (
            <Result
              status="success"
              title="Successfully Purchased Products"
              subTitle={`Order number: ${router.query.id} `}
              extra={[
                <Link
                  key="order"
                  href={`/customer/order/${router.query.id}`}
                  passHref
                >
                  View Order Details
                </Link>,
              ]}
            />
          )}
        </div>
      </Spin>
    </div>
  );
};
export default renderOnlyOnClient(SuccessfulOrder);
