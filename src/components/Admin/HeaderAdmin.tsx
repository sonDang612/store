import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Affix,
  Button,
  Dropdown,
  Form,
  FormItemProps,
  Input,
  Layout,
  Menu,
  message,
  Modal,
} from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";

import { useMounted } from "@/hook/useMounted";
import { VALIDATE_FORM_ACCOUNT } from "@/src/constant/validateForm";
import { queryKeys } from "@/src/react-query/constants";
import { useMutationUpdateUserProfile } from "@/src/react-query/hooks/user/useMutationUpdateUserProfile";
import { useUserAdmin } from "@/src/react-query/hooks/user/useUserAdmin";
import { AdminSidebarType } from "@/src/redux/reducers/adminSidebarReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";

type FormType = {
  oldPassword: string;
  password: string;
  confirm: string;
};
type FromElementAdminAccount = FormItemProps<FormType> & {
  component: React.ReactNode;
};
const { Header } = Layout;
const HeaderAdmin: React.FC<any> = () => {
  const { hasMounted } = useMounted();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm<FormType>();
  const { mutate: updateProfile, isLoading: isLoadingUpdateProfile } =
    useMutationUpdateUserProfile(() => {
      form.setFieldsValue({
        oldPassword: "",
        password: "",
        confirm: "",
      });
      setVisible(false);
    }, true);

  const collapsed = useSelector<RootState, AdminSidebarType["collapsed"]>(
    (state) => state.adminSidebar.collapsed,
  );
  const actions = useActions();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useUserAdmin(false);
  const optionDropDownMenuMain: ItemType[] = [
    {
      key: "ChangePassword",
      label: (
        <Button
          type="link"
          className="text-left text-gray-600 hover:text-[#1a94ff]"
          block
          onClick={() => {
            setVisible(true);
          }}
        >
          Change Password
        </Button>
      ),
    },
    {
      key: "Logout",
      label: (
        <Button
          type="link"
          className="text-left text-gray-600 hover:text-[#1a94ff]"
          block
          onClick={() => {
            Cookies.remove("tokenAdmin");

            queryClient.setQueryData(queryKeys.getAdminData, {});
            router.replace(`/admin/login?redirect=${router.asPath}`);
          }}
        >
          Logout
        </Button>
      ),
    },
  ];

  const menu = (
    <Menu
      className=" !text-blue-500 rounded-md"
      items={optionDropDownMenuMain}
    />
  );

  const optionMenuMain: ItemType[] = [
    {
      key: "admin2",
      className: "z-20 !bg-white hover:!bg-gray-50 transition duration-75",
      label: (
        <div className="inline px-3 text-gray-700 transition-colors duration-300 cursor-pointer">
          <span>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div>
      ),
      onClick: () => actions.toggleCollapse(),
    },
    {
      key: "admin",
      className: "ml-auto !bg-white hover:!bg-gray-50 transition duration-75",
      label: (
        <Dropdown overlay={menu} placement="bottomLeft" overlayClassName="">
          <div className="flex items-center space-x-2">
            <h2 className="mr-3 text-gray-600">
              Hi <span className="capitalize">{user?.name}</span>
            </h2>

            <Image
              src="/images/admin-avatar.png"
              alt="/images/admin-avatar.png"
              width={40}
              height={40}
              className="block"
            />
          </div>
        </Dropdown>
      ),
    },
  ];
  const onFinish = (data: FormType) => {
    if (data.password && data.oldPassword && data.confirm) {
      if (data.password !== data.confirm) {
        return message.error("Password and confirm Password do not match");
      }
    }
    updateProfile({
      userUpdate: { ...data, isAdmin: true },
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
  };
  const renderForm = ({ component, ...itemProps }: any, i: number) => {
    return (
      <Form.Item {...itemProps} key={i}>
        {component}
      </Form.Item>
    );
  };
  const arrayFormAdminAccount = useMemo<FromElementAdminAccount[]>(
    () => [
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
    [],
  );
  return (
    <>
      <Affix>
        <Header
          className=" bg-white"
          style={{
            padding: 0,
            boxShadow: "4px 4px 40px 0 rgb(0 0 0 / 5%)",
          }}
        >
          {hasMounted && (
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[]}
              className=" flex !bg-white"
              items={optionMenuMain}
              // className={
              //    collapsed
              //       ? " flex  !bg-white "
              //       : " flex !bg-white pl-[256px] duration-300 transition-all "
              // }
            />
          )}
        </Header>
      </Affix>
      <Modal
        open={visible}
        title={"Change password"}
        onOk={() => {
          setVisible(true);
        }}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
        className=" rounded-sm"
        width={600}
        // preserve={false}
        // maskClosable={false}
      >
        <Form
          form={form}
          name="accountAdminInformation"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          validateMessages={VALIDATE_FORM_ACCOUNT}
          onFinishFailed={onFinishFailed}
          size="large"
        >
          {arrayFormAdminAccount.map(renderForm)}
        </Form>
      </Modal>
    </>
  );
};

export default HeaderAdmin;
