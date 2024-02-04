import { Form, Layout, Modal } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

import MyHeader from "@/components/Header/MyHeader";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";

import ModalContent from "./ModalContent";
import ClientSay from "../Category/ClientSay/ClientSay";

const { Content } = Layout;
const MyLayout: React.FC<any> = ({ children }) => {
  const actions = useActions();
  const visible = useSelector<RootState, boolean>(
    (state) => state.modal.visible,
  );

  const router = useRouter();
  const [form] = Form.useForm();

  return (
    <Layout className="min-w-[1400px]">
      <Layout>
        <MyHeader />
        <Content
          className={
            router.pathname === "/payment"
              ? " mx-auto w-full bg-white"
              : " mx-auto w-[1270px] bg-white"
          }
        >
          {children}
        </Content>
        {router.pathname === "/" && <ClientSay />}
      </Layout>
      <Modal
        open={visible}
        centered
        onOk={() => {
          form.resetFields();

          actions.handleOk();
        }}
        onCancel={() => {
          form.resetFields();
          actions.handleCancel();
        }}
        footer={null}
        className="overflow-hidden !w-[750px] Modal s-minWidth-200"
      >
        <ModalContent form={form} />
      </Modal>
    </Layout>
  );
};

export default MyLayout;
