import { Button, Spin } from "antd";
import { useEffect, useState } from "react";

import { useUserData } from "@/src/react-query/hooks/user/useUserData";

import { useActions } from "../redux/useActions";
import notEmpty from "./not-empty";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}
export function renderOnlyOnClient(TheComponent: any) {
  return function ClientOnlyComponent({ children, ...rest }: any) {
    const isClient = useIsClient();
    const actions = useActions();
    const { data: user, isSuccess } = useUserData(false, false);

    if (!isClient || !isSuccess) {
      return (
        <div className=" flex justify-center items-center min-h-[calc(100vh-75px)]">
          <Spin size="large" />
        </div>
      );
    }
    return notEmpty(user) ? (
      <TheComponent {...rest}>{children}</TheComponent>
    ) : (
      <>
        <div className=" flex flex-col justify-center items-center space-y-3 min-h-[calc(100vh-75px)]">
          <h2 className=" text-lg text-gray-500">You haven't login yet</h2>
          <Button type="primary" onClick={() => actions.showModalLogin()}>
            Login
          </Button>
        </div>
      </>
    );
  };
}
