import { useToggle } from "ahooks";
import {
  Button,
  Checkbox,
  Form,
  FormItemProps,
  Input,
  message,
  Radio,
} from "antd";
import dayjs from "dayjs";
import React, { useMemo } from "react";

import DatePicker from "@/components/DatePicker";
import { VALIDATE_FORM_ACCOUNT } from "@/src/constant/validateForm";
import { useMutationUpdateUserProfile } from "@/src/react-query/hooks/user/useMutationUpdateUserProfile";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { Gender } from "@/src/types/user";

type FormType = {
  name: string;
  phone: string;
  dob: Date;
  email: string;
  gender: Gender;
  oldPassword: string;
  password: string;
  confirm: string;
};
type FromElementAccount = FormItemProps<FormType> & {
  component: React.ReactNode;
  show?: boolean;
};
const Account = () => {
  const { data: user } = useUserData(false, false);

  const [form] = Form.useForm<FormType>();

  const [showChangePass, { toggle }] = useToggle(false);
  const { mutate: updateProfile, isLoading: isLoadingUpdateProfile } =
    useMutationUpdateUserProfile(() => {
      form.setFieldsValue({
        ...form.getFieldsValue(),
        oldPassword: "",
        password: "",
        confirm: "",
      });
    });

  const onFormValuesChangeHandler = (
    changedValues: Partial<FormType>,
    values: FormType,
  ) => {
    const [name] = Object.keys(changedValues);
    if (name === "phone" && /[^0-9]/g.test(values[name])) {
      const validValue = values[name].replace(/[^0-9]/g, "");
      form.setFieldValue(name, validValue);
    }
  };
  const onFinish = (data: FormType) => {
    if (data.password && data.oldPassword && data.confirm) {
      if (data.password !== data.confirm) {
        return message.error("Password and confirm Password do not match");
      }
    }

    updateProfile({
      userUpdate: data,
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
  };
  const renderForm = (
    { component, ...itemProps }: FromElementAccount,
    i: number,
  ) => {
    return (
      <Form.Item {...itemProps} key={i}>
        {component}
      </Form.Item>
    );
  };
  const arrayFormAccount = useMemo<FromElementAccount[]>(
    () => [
      {
        label: "Full Name",
        name: "name",
        rules: [
          {
            required: true,
          },
          {
            pattern: new RegExp(/^[A-Za-z\s\u00AA-\uFFDC]+$/),
            message: "Full name does not allow special characters and numbers",
          },
        ],
        labelAlign: "left",
        className: "",
        component: <Input />,
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
        component: <Input className="rounded-md" />,
      },
      {
        label: "Phone Number",
        name: "phone",
        rules: [{ len: 10 }],
        labelAlign: "left",
        className: "",
        component: <Input className="rounded-md" />,
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
        label: "Gender",
        name: "gender",
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
        label: "Change Password",
        name: "gender",
        labelAlign: "left",
        className: "",
        component: <Checkbox checked={showChangePass} onChange={toggle} />,
      },
      //
      {
        label: "Old Password: ",
        name: "oldPassword",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        show: showChangePass,
        component: <Input.Password className="rounded-md" />,
      },
      {
        label: "New Password: ",
        name: "password",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        show: showChangePass,
        component: <Input.Password className="rounded-md" />,
      },
      {
        label: "Confirm Password: ",
        name: "confirm",
        rules: [
          {
            required: true,
          },
        ],
        labelAlign: "left",
        className: "",
        show: showChangePass,
        component: <Input.Password className="rounded-md" />,
      },
      {
        wrapperCol: { offset: 6, span: 16 },
        component: (
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-md"
            loading={isLoadingUpdateProfile}
          >
            Save
          </Button>
        ),
      },
    ],
    [showChangePass, isLoadingUpdateProfile, toggle],
  );

  return (
    <div className="p-4 bg-white rounded-md">
      <div className="mt-7 ml-10 w-[550px]">
        {
          <Form
            form={form}
            name="accountInformation"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            onValuesChange={onFormValuesChangeHandler}
            onFinish={onFinish}
            initialValues={{
              name: user.name,
              email: user.email,
              phone: user.phone,
              gender: user.gender,
              dob: dayjs(user.dob),
            }}
            validateMessages={VALIDATE_FORM_ACCOUNT}
            onFinishFailed={onFinishFailed}
            size="large"
          >
            {arrayFormAccount
              .filter((item) => !(item.show === false))
              .map(renderForm)}
          </Form>
        }
      </div>
    </div>
  );
};

export default Account;
