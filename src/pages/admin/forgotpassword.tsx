import { Button, Form, FormItemProps, Input } from "antd";
import React, { useMemo } from "react";

import { useMutationForgotPassword } from "@/src/react-query/hooks/user/useMutationForgotPassword";

type FormTypeForgotPassword = {
  email: string;
};
type FromElementFilter = FormItemProps<FormTypeForgotPassword> & {
  component: React.ReactNode;
  show?: boolean;
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 6 },
};

const ForgotPasswordScreen = () => {
  const [form] = Form.useForm();
  const { mutate: forgotPassword } = useMutationForgotPassword();
  const handleSubmit = async ({ email }: any) => {
    forgotPassword({ email });
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
        ...tailLayout,
        component: (
          <Button type="primary" size="middle" htmlType="submit">
            Continue
          </Button>
        ),
      },
    ],
    [],
  );
  return (
    <div className=" overflow-hidden mx-auto max-w-md bg-white">
      <div className="mt-40 text-center">
        <span className=" inline-block mb-4 text-xl font-medium">
          FORGOT PASSWORD
        </span>
      </div>
      <Form name="basic" {...layout} form={form} onFinish={handleSubmit}>
        {arrayFormFilter.map(renderForm)}
      </Form>
    </div>
  );
};

export default ForgotPasswordScreen;
ForgotPasswordScreen.getLayout = function getLayout(page: any) {
  return <>{page}</>;
};
