import { Menu } from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { useRouter } from "next/router";
import React from "react";

import { MENU_FILTER } from "@/src/constant";
import isEmpty from "@/utils/is-empty";

const MenuFilter: React.FC<any> = ({ handleFilter }) => {
  const router = useRouter();
  const { sort } = router.query;

  const getOptionMenuMain = () => {
    const optionMenuMain: ItemType[] = MENU_FILTER.map((item) => {
      return {
        ...item,
        label: (
          <span className="inline-block min-w-[45px] font-medium tracking-wide text-center">
            {item.name}
          </span>
        ),
      };
    });
    return optionMenuMain;
  };

  return (
    <>
      <Menu
        mode="horizontal"
        className="space-x-4"
        onClick={(e) => handleFilter("sort", e.key === "all" ? null : e.key)}
        selectedKeys={
          isEmpty(sort) ? ["all"] : Array.isArray(sort) ? sort : [sort]
        }
        items={getOptionMenuMain()}
      />
    </>
  );
};

export default MenuFilter;
