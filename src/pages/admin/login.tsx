import { Button, Form, FormItemProps, Input, Spin } from "antd";
import Link from "next/link";
import React, { useMemo } from "react";

import { useMutationLoginUser } from "@/src/react-query/hooks/user/useMutationLoginUser";
import { useUserAdmin } from "@/src/react-query/hooks/user/useUserAdmin";
import isEmpty from "@/utils/is-empty";

type FormTypeLogin = {
  email: string;
  password: string;
};
type FromElementFilter = FormItemProps<FormTypeLogin> & {
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

const LoginPage = () => {
  const { data: user, isLoading, isSuccess } = useUserAdmin(false);
  const [form] = Form.useForm();
  // const router = useRouter();
  const { mutate: login, isLoading: isLoadingLogin } =
    useMutationLoginUser(form);

  const handleSubmit = async ({ email, password }: any) => {
    login({ email, password });
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
        label: "Email: ",
        name: "email",
        rules: [
          {
            type: "email",
          },
          { required: true },
        ],
        className: "",
        component: <Input />,
      },
      {
        label: "Password: ",
        name: "password",
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
              loading={isLoadingLogin}
            >
              Login
            </Button>
            <div>
              <Link href="/admin/forgotpassword">Forgot password</Link>
            </div>
          </div>
        ),
      },
    ],
    [],
  );
  return (
    <Spin tip="Loading..." spinning={isLoading}>
      <div className=" overflow-hidden h-screen">
        {isSuccess && isEmpty(user) && (
          <div className=" pt-10 pr-14 pb-1 mx-auto mt-36 max-w-md bg-white">
            <div className="text-center">
              <span className=" inline-block mb-4 text-xl font-medium">
                LOGIN
              </span>
            </div>
            <Form
              name="loginAdmin"
              {...layout}
              form={form}
              onFinish={handleSubmit}
            >
              {arrayFormFilter.map(renderForm)}
            </Form>
          </div>
        )}
      </div>{" "}
    </Spin>
  );
};
LoginPage.getLayout = function getLayout(page: any) {
  return <>{page}</>;
};
export default LoginPage;
