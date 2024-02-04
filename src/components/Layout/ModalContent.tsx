import { Button, Form, Input, message } from "antd";
import React from "react";
import { useSelector } from "react-redux";

import { useMutationForgotPassword } from "@/src/react-query/hooks/user/useMutationForgotPassword";
import { useMutationLoginUser } from "@/src/react-query/hooks/user/useMutationLoginUser";
import { useMutationRegisterUser } from "@/src/react-query/hooks/user/useMutationRegisterUser";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import { Modal } from "@/src/types/modal";

const { Item } = Form;
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 17 },
};
const validateMessages = {
  required: "${label} is required !",
  types: {
    email: "${label} is not a valid email !",
  },
};
const ModalContent: React.FC<any> = ({ form }) => {
  const { head, subHead, button, createAccount } = useSelector<
    RootState,
    Modal
  >((state) => state.modal);

  const actions = useActions();
  const { mutate: register, isLoading: isLoadingRegister } =
    useMutationRegisterUser(form);
  const { mutate: login, isLoading: isLoadingLogin } =
    useMutationLoginUser(form);
  const { mutate: sendToEmail, isLoading: isLoadingSendToEmail } =
    useMutationForgotPassword();

  const handleSubmit = async (data: any) => {
    if (head.startsWith("Login")) {
      const { email, password } = data;
      login({ email, password });
    } else if (head.startsWith("Register")) {
      const { email, password, confirmPassword } = data;
      if (password !== confirmPassword) {
        return message.error("Passwords do not match");
      }
      register({ email, password });
    } else if (head.startsWith("Forgot")) {
      const { email } = data;
      if (!email) {
        return message.error("Please enter your email");
      }
      sendToEmail({ email });
    }
    // message.info(JSON.stringify(data, null, 2));
  };
  const onFinishFailed = (errorInfo: any) => {
    message.error(JSON.stringify(errorInfo));
    // eslint-disable-next-line no-console
    console.log(errorInfo);
  };
  const field = () => {
    if (head.startsWith("Login")) {
      return (
        <>
          <Item
            label={<p className="s-text-6">Email</p>}
            name="email"
            rules={[
              {
                type: "email",
              },
              { required: true },
            ]}
          >
            <Input className="s-h-10 s-text-5" />
          </Item>
          <Item
            label={<p className="s-text-6">Password</p>}
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password className="s-h-10" />
          </Item>
        </>
      );
    }
    if (head.startsWith("Register")) {
      return (
        <>
          {/* <Item label="Name: " name="name" rules={[{ required: true }]}>
                  <Input />
               </Item> */}
          <Item
            label={<p className="s-text-6">Email</p>}
            name="email"
            rules={[
              {
                type: "email",
              },
              { required: true },
            ]}
          >
            <Input className="s-h-10 s-text-5" />
          </Item>
          <Item
            label={<p className="s-text-6">Password</p>}
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password className="s-h-10" />
          </Item>
          <Item
            label={<p className="s-text-6">Confirm</p>}
            name="confirmPassword"
            rules={[{ required: true }]}
          >
            <Input.Password className="s-h-10" />
          </Item>
        </>
      );
    }
    if (head.startsWith("Forgot")) {
      return (
        <>
          <Item
            label={<p className="s-text-6">Email: </p>}
            name="email"
            rules={[
              {
                type: "email",
              },
              { required: true },
            ]}
          >
            <Input className="s-h-10 s-text-5" />
          </Item>
        </>
      );
    }
  };
  const back = () => {
    if (head.startsWith("Forgot password")) {
      return (
        <Button
          type="link"
          className="mb-3 -ml-4"
          onClick={() => actions.showModalLogin()}
        >
          <img
            src="/images/back.png"
            alt="back"
            className="w-[21px] h-[21px] s-w-10 s-h-10"
          />
        </Button>
      );
    }

    form.setFieldsValue({ password: "" });
  };
  return (
    <div className="flex">
      <div className="p-[24px] pl-8 w-[700px] s-padding-20">
        {back()}
        <h2 className="mb-2 text-[24px] font-bold s-text-11">{head}</h2>
        <p className="mb-8 text-[14px] s-text-5">{subHead}</p>
        <Form
          name="login"
          {...layout}
          form={form}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          validateMessages={validateMessages}
          // initialValues={{
          //    emailRegister: "culi@example.com",
          //    passwordRegister: "123456",
          //    confirmPasswordRegister: "123456",
          //    emailLogin: "culi@example.com",
          //    passwordLogin: "123456",
          // }}
          // initialValues={{ email: "", password: "" }}
          // onFieldsChange={onChangeHandler}
        >
          {field()}
          <Item {...tailLayout} className="ml-[20.833333%] w-full form-btn">
            <div className="flex justify-between items-center mt-2">
              <Button
                type="primary"
                size="middle"
                htmlType="submit"
                block
                shape="round"
                danger
                loading={
                  isLoadingLogin || isLoadingRegister || isLoadingSendToEmail
                }
                className="h-10 uppercase s-h-12 s-text-6"
              >
                {button}
              </Button>
            </div>
          </Item>
        </Form>
        {!head.startsWith("Forgot") && (
          <div>
            <Button
              type="link"
              className="text-[13px] s-text-5"
              style={{ color: "#1a94ff" }}
              onClick={() => actions.showModalForgotPassword()}
            >
              Forgot password?
            </Button>
            <div className="-mt-2 text-[13px] s-text-5">
              <span className="ml-4">
                {head.startsWith("Login") ? "No account?" : "Have an Account?"}
              </span>
              <Button
                type="link"
                className="text-[13px] s-text-5"
                onClick={() => {
                  if (head.startsWith("Login")) {
                    actions.showModalRegister();
                  } else if (head.startsWith("Register")) {
                    actions.showModalLogin();
                  }
                }}
                style={{ color: "#1a94ff" }}
              >
                {createAccount}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="ModalRight">
        <img src="/images/logintiki.png" width="203" alt="login" />
        <div className="flex flex-col items-center mt-3 text-[#0b74e5]">
          <div className=" text-[17px] font-medium s-text-5">
            Shopping at MyShop
          </div>
          <span className="text-[13px] s-text-4">Super deals every day</span>
        </div>
      </div>
    </div>
  );
};

export default ModalContent;
// export default dynamic(() => Promise.resolve(ModalContent), { ssr: false });
