import { Button, Form, FormItemProps, Input, Radio } from "antd";
import React, { useMemo } from "react";

import DatePicker from "@/components/DatePicker";
import { useMutationUpdateUserAdmin } from "@/src/react-query/hooks/user/useMutationUpdateUserAdmin";

type FormTypeUser = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dob: Date;
  gender: string;
};
type FromElementFilter = FormItemProps<FormTypeUser> & {
  component: React.ReactNode;
  show?: boolean;
};

const validateMessages = {
  required: "${label} is required !",
  types: {
    email: "${label} is not a valid email !",
  },
  string: {
    len: "Invalid '${label}'",
  },
  // string: {
  //    len: "'${label}' must be exactly ${len} characters",
  // },
};

const FormUser: React.FC<any> = ({ form }) => {
  const { mutate: updateUser, isLoading } = useMutationUpdateUserAdmin();
  const onFinish = (values: any) => {
    const userUpdate = {
      name: values.fullName,
      phone: values.phoneNumber,
      addressDetail: values.addressDetail,
      email: values.email,
      gender: values.gender,
      dob: values.dob.format("YYYY-MM-DD"),
      _id: values._id,
    };
    // console.log(userUpdate);

    updateUser({ userUpdate });
  };

  const onFinishFailed = (errorInfo: any) => {
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
        name: "_id",
        className: "m-0 h-0",
        component: <div></div>,
      },
      {
        label: "Full Name",
        name: "fullName",
        rules: [
          {
            required: true,
          },
          {
            pattern: new RegExp(/^[A-Za-z\s\u00AA-\uFFDC]+$/),

            message: "Full Name do not include special characters and numbers",
          },
        ],
        labelAlign: "left",
        className: "",
        component: <Input className="rounded-md" />,
      },
      {
        className: "mb-3 h-0",
        component: <div></div>,
      },
      {
        label: "Email",
        name: "email",
        rules: [
          {
            type: "email",
          },
          { required: true },
        ],
        labelAlign: "left",
        className: "",
        component: <Input className="rounded-md" disabled />,
      },
      {
        className: "mb-3 h-0",
        component: <div></div>,
      },
      {
        label: "Phone Number",
        name: "phoneNumber",
        rules: [
          //   {
          //      required: true,
          //   },
          { len: 10 },
        ],
        labelAlign: "left",
        className: "",
        component: <Input className="rounded-md" disabled />,
      },
      {
        className: "mb-3 h-0",
        component: <div></div>,
      },
      {
        label: "Date of birth",
        name: "dob",
        labelAlign: "left",
        className: "",
        component: (
          <DatePicker
            format="DD-MM-YYYY"
            className="w-full rounded-md"
            allowClear={false}
          />
        ),
      },
      {
        className: "mb-3 h-0",
        component: <div></div>,
      },
      {
        label: "Gender",
        name: "gender",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        component: (
          <Radio.Group className="space-x-4">
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="other">Other</Radio>
          </Radio.Group>
        ),
      },
      {
        className: "mb-3 h-0",
        component: <div></div>,
      },
      {
        wrapperCol: { offset: 21, span: 16 },
        component: (
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-md"
            loading={isLoading}
          >
            Save
          </Button>
        ),
      },
    ],
    [isLoading],
  );
  return (
    <div>
      {" "}
      <Form
        form={form}
        name="userForm"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        validateMessages={validateMessages}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {arrayFormFilter.map(renderForm)}
      </Form>
    </div>
  );
};

export default FormUser;
