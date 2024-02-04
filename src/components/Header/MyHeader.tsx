import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Badge,
  Button,
  Col,
  Dropdown,
  Layout,
  Menu,
  Row,
} from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import slugify from "slugify";

import { queryKeys } from "@/src/react-query/constants";
import { useListNameProducts } from "@/src/react-query/hooks/product/useListNameProducts";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { HeaderType } from "@/src/redux/reducers/headerReducer";
import { RootState } from "@/src/redux/store";
import { useActions } from "@/src/redux/useActions";
import isEmpty from "@/utils/is-empty";
import { saveDataToLocalStorage } from "@/utils/saveDataToLocalStorage";

import Search from "./Search";

const { Header } = Layout;

const arrayKey = ["ArrowUp", "ArrowDown"];
const MyHeader = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUserData();
  const router = useRouter();

  const { search, open, flag } = useSelector<RootState, HeaderType>(
    (state) => state.header,
  );
  const [listNameProduct, setListNameProduct] = useState([]);
  const actions = useActions();

  const { data: productNameId } = useListNameProducts();

  const handlerToCart = () => {
    if (isEmpty(user)) {
      actions.showModalLogin();
      return;
    }
    router.push("/customer/cart");
  };
  const onSelect = (value: any, option: any): any => {
    const ob = productNameId.find(
      (pd: any) => pd.id.toString() === value.toString(),
    );

    if (isEmpty(ob)) {
      actions.setHeaderState({ open: false });
      saveDataToLocalStorage("search-keyword", value);
      router.push({
        query: {
          name: value,
        },
        pathname: "/products/search",
      });
    } else {
      const slugProduct = slugify(ob.name.toLowerCase());
      setListNameProduct([]);
      actions.setHeaderState({ search: "", open: false });
      router.push(`/product/${value}?slug=${slugProduct}`);
    }
  };
  const handleSearch = () => {
    if (!search) return router.push(`/products/search`);
    // const searchFilter = search.replace(/[^\w\s]/gi, "");
    const searchFilter = search.trim();
    if (!searchFilter) return;

    saveDataToLocalStorage("search-keyword", searchFilter);
    actions.setHeaderState({ open: false });
    router.push({
      query: {
        name: searchFilter,
      },
      pathname: "/products/search",
    });
  };
  const handleFocus = () => {
    actions.setHeaderState({ open: true });
    const listHistorySearch = localStorage
      .getObject("search-keyword")
      .map((nameSearch: any) => {
        return {
          value: nameSearch,
          label: <Search product={nameSearch} handleFocus={handleFocus} />,
        };
      });
    setListNameProduct(listHistorySearch);
  };
  const handleFilterSearch = (value: any) => {
    actions.setHeaderState({ open: true });

    if (!value) {
      handleFocus();
      return;
    }

    const result = productNameId
      .filter(({ name }: any) =>
        name.toLowerCase().includes(value.toLowerCase()),
      )
      .map((product: any) => {
        return {
          value: product._id,
          label: <Search product={product} />,
        };
      });
    setListNameProduct(result);
  };
  const optionMenu: ItemType[] = [
    {
      key: "SIGN IN",
      label: (
        <div>
          <Button
            type="default"
            className="hover:text-black !bg-[#fdd835] hover:!bg-[#fdd835] border-0"
            block
            onClick={() => actions.showModalLogin()}
          >
            Sign In
          </Button>
        </div>
      ),
    },
    {
      key: "SIGN UP",
      label: (
        <div>
          <Button
            type="default"
            className="hover:text-black !bg-[#fdd835] hover:!bg-[#fdd835] border-0"
            block
            onClick={() => actions.showModalRegister()}
          >
            Sign Up
          </Button>
        </div>
      ),
    },
  ];
  const menu = <Menu className="-mt-5 " items={optionMenu} />;
  const optionMenuLogin: ItemType[] = [
    {
      key: "My Order",
      label: (
        <Button
          type="link"
          className="text-left text-gray-600 hover:text-[#1a94ff]"
          block
          onClick={() => router.push("/customer/account")}
        >
          My account
        </Button>
      ),
    },
    {
      key: "My Account",
      label: (
        <Button
          type="link"
          className="text-left text-gray-600 hover:text-[#1a94ff]"
          block
          onClick={() => router.push("/customer/order")}
        >
          My order
        </Button>
      ),
    },
    {
      key: "My Address",
      label: (
        <Button
          type="link"
          className="text-left text-gray-600 hover:text-[#1a94ff]"
          block
          onClick={() => router.push("/customer/address")}
        >
          My Address
        </Button>
      ),
    },
    {
      key: "Review Products",
      label: (
        <Button
          type="link"
          className="text-left text-gray-600 hover:text-[#1a94ff]"
          block
          onClick={() => router.push("/customer/review-product")}
        >
          Review products
        </Button>
      ),
    },
    {
      key: "My Wishlist",
      label: (
        <Button
          type="link"
          className="text-left text-gray-600 hover:text-[#1a94ff]"
          block
          onClick={() => router.push("/customer/wishlist")}
        >
          My Wishlist
        </Button>
      ),
    },
    {
      key: "Logout",
      label: (
        <Button
          type="link"
          className="text-left text-gray-600 hover:text-[#ff1a5f]"
          block
          onClick={() => {
            // router.push("/");
            queryClient.setQueryData(queryKeys.getUserData, {});
            Cookies.remove("tokenUser");
          }}
        >
          Logout
        </Button>
      ),
    },
  ];
  const menuLogin = (
    <Menu className="-mt-5 !text-blue-500" items={optionMenuLogin} />
  );
  const optionMenuMain: ItemType[] = [
    {
      key: "HOME",
      label: (
        <Link href="/" passHref>
          <h2 className=" text-[20px] font-bold text-white translate-y-[2px]">
            HOME
          </h2>
        </Link>
      ),
      className: "!px-0 mr-32 -ml-3",
    },
    {
      key: "SEARCH",
      label: (
        <div className="flex justify-center items-center w-full h-16">
          <div className="flex Autocomplete">
            <AutoComplete
              dropdownMatchSelectWidth={252}
              style={{ width: 590 }}
              onSelect={onSelect}
              value={search}
              open={open}
              onClick={() => {
                if (open) return;

                handleFocus();
              }}
              onChange={(value) => {
                actions.setHeaderState({ search: value });
              }}
              onSearch={handleFilterSearch}
              onFocus={handleFocus}
              onBlur={() => actions.setHeaderState({ open: false })}
              options={listNameProduct}
              allowClear
              placeholder="Search for the product you want"
              onKeyDown={(event) => {
                if (event.key !== "Enter") {
                  actions.setHeaderState({ flag: event.key });
                  return;
                }
                if (
                  !arrayKey.includes(flag) ||
                  !event.currentTarget.classList.contains("ant-select-open")
                ) {
                  handleSearch();
                }
              }}
              className="overflow-hidden"
            ></AutoComplete>

            <Button
              type="primary"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              className=" h-[35px] !bg-[#0d5cb6] hover:!bg-[#0d5cb6] !border-[#0d5cb6] btn-search"
            >
              Search
            </Button>
          </div>
        </div>
      ),
      className: "cursor-default",
    },
    {
      key: "SIGN IN/UP",
      label: (
        <Dropdown
          overlay={isEmpty(user) ? menu : menuLogin}
          placement="bottom"
          overlayClassName="w-[170px] -mt-5"
          arrow
        >
          <Row>
            <Col
              span={9}
              className=" mt-[10px] !text-white"
              style={{ flexBasis: "45px" }}
            >
              <UserOutlined style={{ fontSize: 32, width: 20 }} />
            </Col>
            <Col span={15} className=" flex flex-col mt-1 !text-white">
              <div className="mt-[-10px] text-[11px]">
                {/* &nbsp; &nbsp;&nbsp; */}
                {isEmpty(user) ? " Sign In / Sign Up" : "Account"}
              </div>
              <div className="flex mt-[-46px] h-[10px] text-[13px]">
                <div className=" text-[14px]">
                  {/* &nbsp; &nbsp; */}
                  <h2 className="max-w-[120px] !text-white truncate">
                    {" "}
                    {isEmpty(user) ? " Account" : user!.name}
                  </h2>
                </div>
                <div className=" z-50 mt-1 ml-[2px]">
                  <img
                    src="/images/down.png"
                    alt="down"
                    className=" inline-block w-4 h-4"
                  />
                  &nbsp; &nbsp; &nbsp;
                </div>
              </div>
            </Col>
          </Row>
        </Dropdown>
      ),
      className: "!-mt-1 w-[200px]",
    },
    {
      key: "CART",
      label: (
        <div className=" cursor-pointer" onClick={handlerToCart}>
          <div className="flex justify-between items-center mt-1">
            <div>
              <Badge
                count={user?.cart?.length || 0}
                offset={[0, 17]}
                size="default"
              >
                <img
                  className="mt-3"
                  src="/images/cart.png"
                  alt="down"
                  width={32}
                  height={32}
                />
              </Badge>
            </div>
            <div className=" inline-block -mt-10 ml-1 h-[20px] text-[13px] !text-white">
              Cart
            </div>
          </div>
        </div>
      ),
      className: "!pr-0 mr-4",
    },
  ];

  return (
    <Header className=" overflow-hidden px-32 min-h-[70px] text-white !bg-[#1a94ff] Header">
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[]}
        className="flex justify-between mx-auto max-w-[1280px] !bg-[#1a94ff]"
        items={optionMenuMain}
      />
    </Header>
  );
};

export default MyHeader;
// export default renderOnlyOnClient(MyHeader);

// export default dynamic(() => Promise.resolve(MyHeader), { ssr: false });
