import { Button, Result } from "antd";
import { useRouter } from "next/dist/client/router";
import React from "react";

const Custom404 = () => {
  const router = useRouter();
  return (
    <div className=" flex justify-center items-center min-h-[calc(100vh-75px)]">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            onClick={() => {
              router.push("/");
            }}
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default Custom404;
