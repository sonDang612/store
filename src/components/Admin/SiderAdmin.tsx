import {
  BulbOutlined,
  CodeOutlined,
  DashboardOutlined,
  DingtalkOutlined,
  FileDoneOutlined,
  FireOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Switch } from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

import { useMounted } from "@/hook/useMounted";
import { AdminSidebarType } from "@/src/redux/reducers/adminSidebarReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";

const { Sider } = Layout;
const SiderAdmin: React.FC<any> = () => {
  const { theme, collapsed } = useSelector<RootState, AdminSidebarType>(
    (state) => state.adminSidebar,
  );
  const actions = useActions();
  const { hasMounted } = useMounted();

  const router = useRouter();
  const optionMenuMain: ItemType[] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: (
        <Link className="ml-1" href="/admin/dashboard">
          Dashboard
        </Link>
      ),
    },
    {
      key: "user",
      icon: <UserOutlined />,
      label: (
        <Link className="ml-1" href="/admin/user">
          User
        </Link>
      ),
    },
    {
      key: "orders",
      icon: <FileDoneOutlined />,
      label: (
        <Link className="ml-1" href="/admin/orders">
          Orders
        </Link>
      ),
    },
    {
      key: "products",
      icon: <CodeOutlined />,
      label: (
        <Link className="ml-1" href="/admin/products">
          Products
        </Link>
      ),
    },
    {
      key: "reviews",
      icon: <DingtalkOutlined />,
      label: (
        <Link className="ml-1" href="/admin/reviews">
          Reviews
        </Link>
      ),
    },
    {
      key: "coupon",
      icon: <FireOutlined />,
      label: (
        <Link className="ml-1" href="/admin/coupon">
          Coupon
        </Link>
      ),
    },
  ];
  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={
          theme === "dark"
            ? "bg-[#001529]  fixed z-20 h-full mr-[256px]"
            : "bg-white fixed z-20 h-full mr-[256px] "
        }
        width={256}
      >
        <div className=" z-30 pr-5 m-4 w-full h-7 text-center uppercase Logo">
          {!collapsed ? (
            <span> Admin Management</span>
          ) : (
            <span className="-ml-2"> Admin</span>
          )}
        </div>

        <div className=" flex flex-col justify-between h-[calc(100%-64px)]">
          {hasMounted && (
            <div>
              <Menu
                theme={theme}
                mode="inline"
                selectedKeys={[router.asPath.split("/")[2]]}
                items={optionMenuMain}
              />
            </div>
          )}
          {!collapsed && (
            <div className="flex justify-between px-4 pb-4">
              <div className={"font-normal text-[#666666]"}>
                <span>
                  {" "}
                  <BulbOutlined />
                </span>
                <span className=""> Switch Theme</span>
              </div>
              <Switch
                onChange={() => {
                  actions.setAdminSidebarState({
                    theme: theme === "dark" ? "light" : "dark",
                  });
                }}
                defaultChecked={theme === "dark"}
                checkedChildren={`Dark`}
                unCheckedChildren={`Light`}
              />
            </div>
          )}
        </div>
      </Sider>
      <div
        style={{ width: collapsed ? 80 : 256 }}
        className="transition-all duration-100"
      ></div>
    </>
  );
};

export default SiderAdmin;
