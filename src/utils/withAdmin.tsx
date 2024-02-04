import { Spin } from "antd";
import { useEffect, useState } from "react";

import { useUserAdmin } from "@/src/react-query/hooks/user/useUserAdmin";

import { ROLE } from "../constant";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}
export function withAdmin(TheComponent: any) {
  function ClientOnlyComponent({ children, ...rest }: any) {
    const isClient = useIsClient();

    const { data: user } = useUserAdmin();

    return (
      <>
        {isClient && user?.role === ROLE.ADMIN ? (
          <TheComponent {...rest}>{children}</TheComponent>
        ) : (
          <Spin tip="Loading..." spinning={true}>
            <div className="flex justify-center items-center h-screen"></div>
          </Spin>
        )}
      </>
    );
  }

  ClientOnlyComponent.getLayout = function getLayout(page: any) {
    return <>{page}</>;
  };
  return ClientOnlyComponent;
}
