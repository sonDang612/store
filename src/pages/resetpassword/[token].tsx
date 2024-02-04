import { Button, Form, FormItemProps, Input, message, Spin } from "antd";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";

import { useCheckTokenReset } from "@/src/react-query/hooks/user/useCheckTokenReset";
import { useMutationResetPassword } from "@/src/react-query/hooks/user/useMutationResetPassword";

type FormTypeResetPassword = {
  password: string;
  confirmPassword: string;
};
type FromElementFilter = FormItemProps<FormTypeResetPassword> & {
  component: React.ReactNode;
  show?: boolean;
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const validateMessages = {
  required: "${label} is required !",
  types: {
    email: "${label} is not a valid email !",
  },
};
const ResetPasswordScreen = () => {
  const router = useRouter();
  const { token } = router.query;
  const [form] = Form.useForm();
  const [show, setShow] = useState(false);
  // console.log(token);
  const { mutate: resetPassowrd, isLoading } = useMutationResetPassword(router);
  const { isSuccess, isLoading: isLoadingCheckToken } = useCheckTokenReset(
    token,
    setShow,
  );

  const handleSubmit = async ({ password, confirmPassword }: any) => {
    if (password !== confirmPassword) {
      message.error("Passwords do not match");
    } else {
      resetPassowrd({ password, token: token as string });
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.message);
    console.log("Failed:", errorInfo);
  };
  const renderForm = (
    { component, ...itemProps }: FromElementFilter,
    i: number,
  ) => {
    return (
      <Form.Item {...itemProps} key={i}>
        {component}
      </Form.Item>
    );
  };
  const arrayFormFilter = useMemo<FromElementFilter[]>(
    () => [
      {
        label: "Password: ",
        name: "password",
        rules: [{ required: true }],
        className: "",
        component: <Input.Password />,
      },
      {
        label: "Confirm Password: ",
        name: "confirmPassword",
        rules: [{ required: true }],
        className: "",
        component: <Input.Password />,
      },
      {
        ...tailLayout,
        component: (
          <div className="flex justify-between items-center">
            <Button
              type="primary"
              size="middle"
              htmlType="submit"
              shape="round"
              loading={isLoading}
            >
              Reset password
            </Button>
          </div>
        ),
      },
    ],
    [isLoading],
  );
  return (
    <Spin tip="Loading..." spinning={isLoadingCheckToken}>
      <div className=" w-full h-screen resetPassword">
        <div
          className=" w-full h-full bg-white/40"
          // style={{ filter: "blur(8px);" }}
        ></div>
        <div className=" absolute top-[20%] left-1/2 py-5 px-3 pt-10 pr-14 pb-1 mx-auto max-w-[700px] bg-white border-2 translate-x-[-50%] outer">
          {show ? (
            <>
              {" "}
              <div>
                <h2 className="mb-4 ml-20 text-xl font-bold text-center">
                  RESET PASSWORD
                </h2>
              </div>
              <Form
                name="resetPassword"
                {...layout}
                form={form}
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                // initialValues={{
                //    password: "123456",
                //    confirmPassword: "123456",
                // }}
                validateMessages={validateMessages}
                className="w-[430px]"
              >
                {arrayFormFilter.map(renderForm)}
              </Form>
            </>
          ) : (
            isSuccess && (
              <div>
                <h2 className="mb-4 ml-20 text-xl font-bold text-center text-red-500 uppercase">
                  Token is invalid or has expired
                </h2>
              </div>
            )
          )}
        </div>
      </div>
    </Spin>
  );
};

export default ResetPasswordScreen;

ResetPasswordScreen.getLayout = function getLayout(page: any) {
  return <>{page}</>;
};
