/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { MENU_USER_INFORMATION } from "@/src/constant";

const UserSideBar = () => {
  const router = useRouter();
  // console.log(router);
  return (
    <ul>
      {MENU_USER_INFORMATION.map(({ infor, img, url }, i) => {
        return (
          <Link href={`${url}`} passHref key={i}>
            <li
              className={
                router.pathname === url
                  ? "flex items-center py-2 px-4 ml-2 space-x-6 text-black bg-[#e5e5eb]  cursor-pointer"
                  : "flex items-center py-2 px-4 ml-2 space-x-6 hover:text-black hover:bg-[#e3e3e9]  cursor-pointer duration-75"
              }
            >
              <img src={img} alt={img} className="w-6 h-6" />
              <span className="text-[13px]">{infor}</span>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

// export default UserSideBar;
export default dynamic(Promise.resolve(UserSideBar), { ssr: false });
