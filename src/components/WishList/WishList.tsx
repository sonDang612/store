import { Divider } from "antd";
import React from "react";

import WishListCard from "./WishListCard";

const WishList: React.FC<any> = ({ products }) => {
  return (
    <div className="bg-white rounded-sm">
      {products.map((product: any, i: any) => {
        return (
          <div key={product._id} className="relative">
            {i !== 0 && <Divider className="my-1 h-2" />}
            <WishListCard product={product} i={i} />
          </div>
        );
      })}
    </div>
  );
};

export default WishList;
